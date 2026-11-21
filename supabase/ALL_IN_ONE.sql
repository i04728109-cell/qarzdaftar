-- QarzDaftar: ALL migrations in one file. Paste into Supabase -> SQL Editor -> Run (once).

-- ===== supabase/migrations/0001_schema.sql =====
-- =====================================================================
-- QarzDaftar | 0001_schema.sql | types, tables, constraints, indexes
-- All money: bigint, whole UZS. All ids: uuid.
-- =====================================================================
create type public.user_role           as enum ('owner', 'admin');
create type public.store_status        as enum ('pending', 'active', 'blocked');
create type public.debt_status         as enum ('open', 'partial', 'paid', 'cancelled');
create type public.payment_status      as enum ('confirmed', 'voided');
create type public.subscription_status as enum ('pending', 'active', 'expired', 'rejected', 'cancelled');
create type public.conversation_status as enum ('open', 'closed');
create type public.notification_type   as enum (
  'debt_due_soon','debt_overdue','payment_received',
  'subscription_requested','subscription_confirmed','subscription_rejected',
  'subscription_expiring','subscription_expired',
  'support_message','store_status','system');

create or replace function public.today_tashkent() returns date
language sql stable set search_path = '' as
$$ select (now() at time zone 'Asia/Tashkent')::date $$;

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as
$$ begin new.updated_at := now(); return new; end $$;

-- 1. profiles --------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'owner',
  full_name  text not null default '' check (char_length(full_name) <= 120),
  phone      text unique check (phone ~ '^\+[0-9]{9,15}$'),
  language   text not null default 'uz' check (language in ('uz','ru','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. stores ----------------------------------------------------------
create table public.stores (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null unique references public.profiles(id) on delete restrict,
  name              text not null check (char_length(trim(name)) between 2 and 120),
  city              text check (char_length(city) <= 80),
  address           text check (char_length(address) <= 240),
  status            public.store_status not null default 'pending',
  blocked_reason    text,
  status_changed_at timestamptz,
  status_changed_by uuid references public.profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint stores_blocked_has_reason check (status <> 'blocked' or blocked_reason is not null)
);

-- 3. customers -------------------------------------------------------
create table public.customers (
  id         uuid primary key default gen_random_uuid(),
  store_id   uuid not null references public.stores(id) on delete restrict,
  full_name  text not null check (char_length(trim(full_name)) between 2 and 120),
  phone      text check (phone ~ '^\+[0-9]{9,15}$'),
  photo_path text,
  note       text check (char_length(note) <= 500),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, store_id)               -- target for composite FKs (tenant integrity)
);
create unique index customers_store_phone_uq on public.customers (store_id, phone)
  where deleted_at is null and phone is not null;
create index customers_store_name_idx on public.customers (store_id, lower(full_name))
  where deleted_at is null;

-- 4. debts -----------------------------------------------------------
create table public.debts (
  id               uuid primary key default gen_random_uuid(),
  store_id         uuid not null,
  customer_id      uuid not null,
  amount           bigint not null check (amount > 0 and amount <= 100000000000),
  paid_amount      bigint not null default 0 check (paid_amount >= 0),
  remaining_amount bigint generated always as (amount - paid_amount) stored,
  status           public.debt_status not null default 'open',
  issued_on        date not null default public.today_tashkent(),
  due_on           date not null,
  comment          text check (char_length(comment) <= 500),
  created_by       uuid references public.profiles(id),
  cancelled_at     timestamptz,
  cancel_reason    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint debts_paid_le_amount    check (paid_amount <= amount),
  constraint debts_due_after_issue   check (due_on >= issued_on),
  constraint debts_cancel_consistent check ((status = 'cancelled') = (cancelled_at is not null)),
  constraint debts_customer_fk foreign key (customer_id, store_id)
    references public.customers (id, store_id) on delete restrict,
  unique (id, store_id)
);
create index debts_store_status_due_idx on public.debts (store_id, status, due_on);
create index debts_customer_idx         on public.debts (customer_id);

-- 5. payments (append-only ledger) -----------------------------------
create table public.payments (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null,
  debt_id         uuid not null,
  amount          bigint not null check (amount > 0 and amount <= 100000000000),
  paid_on         date not null default public.today_tashkent(),
  method          text not null default 'cash' check (method in ('cash','card','transfer','other')),
  note            text check (char_length(note) <= 500),
  status          public.payment_status not null default 'confirmed',
  idempotency_key uuid,
  created_by      uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  voided_at       timestamptz,
  voided_by       uuid references public.profiles(id),
  void_reason     text check (char_length(void_reason) between 3 and 500),
  constraint payments_void_consistent
    check ((status = 'voided') = (voided_at is not null and void_reason is not null)),
  constraint payments_debt_fk foreign key (debt_id, store_id)
    references public.debts (id, store_id) on delete restrict
);
create unique index payments_idem_uq on public.payments (store_id, idempotency_key)
  where idempotency_key is not null;
create index payments_debt_idx  on public.payments (debt_id);
create index payments_store_day on public.payments (store_id, paid_on) where status = 'confirmed';

-- 6. subscription_plans ---------------------------------------------
create table public.subscription_plans (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique check (code ~ '^[a-z0-9_]{2,40}$'),
  name            text not null check (char_length(name) between 2 and 80),
  duration_months integer not null check (duration_months between 1 and 36),
  price_uzs       bigint not null check (price_uzs >= 0 and price_uzs <= 100000000000),
  is_active       boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 7. subscriptions ---------------------------------------------------
create table public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  store_id           uuid not null references public.stores(id) on delete restrict,
  plan_id            uuid not null references public.subscription_plans(id) on delete restrict,
  status             public.subscription_status not null default 'pending',
  duration_months    integer not null check (duration_months > 0),   -- snapshot of plan
  price_uzs          bigint  not null check (price_uzs >= 0),        -- snapshot of plan
  starts_at          timestamptz,
  ends_at            timestamptz,
  payment_method     text not null default 'manual',
  payment_reference  text check (char_length(payment_reference) <= 200),
  payment_proof_path text,
  submitted_at       timestamptz not null default now(),
  reviewed_by        uuid references public.profiles(id),
  reviewed_at        timestamptz,
  reject_reason      text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint subscriptions_active_dates check
    (status not in ('active','expired') or (starts_at is not null and ends_at is not null and ends_at > starts_at))
);
create index subscriptions_store_idx on public.subscriptions (store_id, status, ends_at);
create unique index subscriptions_one_pending on public.subscriptions (store_id) where status = 'pending';

-- 8. support_conversations ------------------------------------------
create table public.support_conversations (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid not null references public.stores(id) on delete cascade,
  subject         text not null check (char_length(trim(subject)) between 3 and 150),
  status          public.conversation_status not null default 'open',
  created_by      uuid not null references public.profiles(id),
  last_message_at timestamptz not null default now(),
  closed_at       timestamptz,
  closed_by       uuid references public.profiles(id),
  created_at      timestamptz not null default now(),
  constraint conv_closed_consistent check ((status = 'closed') = (closed_at is not null))
);
create index conv_store_idx on public.support_conversations (store_id, status, last_message_at desc);

-- 9. support_messages ------------------------------------------------
create table public.support_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.support_conversations(id) on delete cascade,
  store_id        uuid not null references public.stores(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id),
  sender_role     public.user_role not null,
  body            text check (char_length(body) <= 4000),
  attachment_path text,
  attachment_name text check (char_length(attachment_name) <= 200),
  attachment_type text check (char_length(attachment_type) <= 100),
  attachment_size integer check (attachment_size between 1 and 10485760),
  read_at         timestamptz,
  created_at      timestamptz not null default now(),
  constraint msg_has_content check (nullif(trim(coalesce(body, '')), '') is not null or attachment_path is not null)
);
create index msg_conv_idx on public.support_messages (conversation_id, created_at);

-- 10. notifications --------------------------------------------------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  store_id   uuid references public.stores(id) on delete cascade,
  type       public.notification_type not null,
  title      text not null,
  body       text,
  data       jsonb not null default '{}'::jsonb,
  dedupe_key text,
  read_at    timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);
create index notif_user_idx   on public.notifications (user_id, created_at desc);
create index notif_unread_idx on public.notifications (user_id) where read_at is null;

-- 11. audit_logs (append-only) --------------------------------------
create table public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid,
  store_id    uuid,
  action      text not null,
  entity_type text not null,
  entity_id   uuid,
  before_data jsonb,
  after_data  jsonb,
  created_at  timestamptz not null default now()
);
create index audit_store_idx on public.audit_logs (store_id, created_at desc);
create index audit_actor_idx on public.audit_logs (actor_id, created_at desc);

create trigger trg_profiles_updated  before update on public.profiles  for each row execute function public.set_updated_at();
create trigger trg_stores_updated    before update on public.stores    for each row execute function public.set_updated_at();
create trigger trg_customers_updated before update on public.customers for each row execute function public.set_updated_at();
create trigger trg_debts_updated     before update on public.debts     for each row execute function public.set_updated_at();
create trigger trg_plans_updated     before update on public.subscription_plans for each row execute function public.set_updated_at();
create trigger trg_subs_updated      before update on public.subscriptions for each row execute function public.set_updated_at();

-- ===== supabase/migrations/0002_functions.sql =====
-- =====================================================================
-- QarzDaftar | 0002_functions.sql | helpers, integrity triggers, RPC
-- Every function: SECURITY DEFINER only where needed, search_path = ''.
-- Error codes are raised as plain messages and mapped to HTTP in the API.
-- =====================================================================

-- ---------- access helpers (used by RLS and RPC) ---------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.owns_store(p_store uuid) returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.stores where id = p_store and owner_id = auth.uid()) $$;

create or replace function public.store_has_active_subscription(p_store uuid) returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.subscriptions
                  where store_id = p_store and status = 'active'
                    and starts_at <= now() and ends_at > now()) $$;

-- Paid features (writes) need: store active AND subscription active.
create or replace function public.store_can_write(p_store uuid) returns boolean
language sql stable security definer set search_path = '' as
$$ select exists (select 1 from public.stores where id = p_store and status = 'active')
      and public.store_has_active_subscription(p_store) $$;

create or replace function public.require_writable_store() returns uuid
language plpgsql stable security definer set search_path = '' as $$
declare v_store uuid;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select id into v_store from public.stores where owner_id = auth.uid();
  if v_store is null then raise exception 'store_not_found'; end if;
  if not public.store_can_write(v_store) then
    raise exception 'subscription_inactive_or_store_blocked';
  end if;
  return v_store;
end $$;

create or replace function public.storage_store_id(p_name text) returns uuid
language plpgsql immutable set search_path = '' as $$
declare v text := split_part(p_name, '/', 1);
begin
  if v ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then return v::uuid; end if;
  return null;
end $$;

-- ---------- internal notification helpers (not exposed) --------------
create or replace function public.notify(
  p_user uuid, p_store uuid, p_type public.notification_type,
  p_title text, p_body text default null, p_data jsonb default '{}'::jsonb, p_dedupe text default null)
returns void language sql security definer set search_path = '' as $$
  insert into public.notifications (user_id, store_id, type, title, body, data, dedupe_key)
  values (p_user, p_store, p_type, p_title, p_body, coalesce(p_data, '{}'::jsonb), p_dedupe)
  on conflict (user_id, dedupe_key) do nothing
$$;

create or replace function public.notify_admins(
  p_store uuid, p_type public.notification_type, p_title text, p_body text default null, p_data jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = '' as $$
  insert into public.notifications (user_id, store_id, type, title, body, data)
  select id, p_store, p_type, p_title, p_body, coalesce(p_data, '{}'::jsonb)
  from public.profiles where role = 'admin'
$$;

-- ---------- new auth user -> profile (role is NEVER taken from metadata)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, phone, full_name)
  values (new.id,
          case when coalesce(new.phone, '') <> '' then '+' || ltrim(new.phone, '+') end,
          left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 120));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- generic immutability / audit -----------------------------
create or replace function public.forbid_mutation() returns trigger
language plpgsql set search_path = '' as
$$ begin raise exception 'immutable_record'; end $$;

create or replace function public.audit_row() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_row jsonb := to_jsonb(case when tg_op = 'DELETE' then old else new end);
begin
  insert into public.audit_logs (actor_id, store_id, action, entity_type, entity_id, before_data, after_data)
  values (auth.uid(),
          case when tg_table_name = 'stores' then (v_row ->> 'id')::uuid else (v_row ->> 'store_id')::uuid end,
          lower(tg_op), tg_table_name, (v_row ->> 'id')::uuid,
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return null;
end $$;

create trigger audit_logs_no_update before update or delete on public.audit_logs
  for each row execute function public.forbid_mutation();
create trigger audit_logs_no_truncate before truncate on public.audit_logs
  for each statement execute function public.forbid_mutation();

create trigger audit_profiles  after insert or update or delete on public.profiles  for each row execute function public.audit_row();
create trigger audit_stores    after insert or update or delete on public.stores    for each row execute function public.audit_row();
create trigger audit_customers after insert or update or delete on public.customers for each row execute function public.audit_row();
create trigger audit_debts     after insert or update or delete on public.debts     for each row execute function public.audit_row();
create trigger audit_payments  after insert or update or delete on public.payments  for each row execute function public.audit_row();
create trigger audit_plans     after insert or update or delete on public.subscription_plans for each row execute function public.audit_row();
create trigger audit_subs      after insert or update or delete on public.subscriptions for each row execute function public.audit_row();
create trigger audit_convs     after insert or update or delete on public.support_conversations for each row execute function public.audit_row();

-- ---------- profiles: role can never be changed through the API ------
create or replace function public.profiles_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null then
    raise exception 'forbidden';
  end if;
  return new;
end $$;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.profiles_guard();

-- ---------- customers guard ------------------------------------------
create or replace function public.customers_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.photo_path is not null and split_part(new.photo_path, '/', 1) <> new.store_id::text then
    raise exception 'invalid_attachment_path';
  end if;
  if tg_op = 'UPDATE' and new.deleted_at is not null and old.deleted_at is null then
    if exists (select 1 from public.debts where customer_id = new.id and status in ('open','partial')) then
      raise exception 'customer_has_open_debts';
    end if;
  end if;
  return new;
end $$;
create trigger customers_guard before insert or update on public.customers
  for each row execute function public.customers_guard();

-- ---------- debts guard ----------------------------------------------
create or replace function public.debts_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.store_id <> old.store_id or new.customer_id <> old.customer_id then
    raise exception 'immutable_record';
  end if;
  return new;
end $$;
create trigger debts_guard before update on public.debts
  for each row execute function public.debts_guard();

-- ---------- payments: append-only ledger -----------------------------
create or replace function public.payments_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.status = 'voided' then raise exception 'payment_immutable'; end if;
  if new.status = 'voided' and old.status = 'confirmed'
     and new.voided_at is not null and new.void_reason is not null
     and (new.id, new.store_id, new.debt_id, new.amount, new.paid_on, new.method, new.note,
          new.idempotency_key, new.created_by, new.created_at)
         is not distinct from
         (old.id, old.store_id, old.debt_id, old.amount, old.paid_on, old.method, old.note,
          old.idempotency_key, old.created_by, old.created_at)
  then
    return new;
  end if;
  raise exception 'payment_immutable';
end $$;
create trigger payments_guard before update on public.payments
  for each row execute function public.payments_guard();
create trigger payments_no_delete before delete on public.payments
  for each row execute function public.forbid_mutation();
create trigger payments_no_truncate before truncate on public.payments
  for each statement execute function public.forbid_mutation();

-- Recalculate the debt from the ledger delta; CHECKs make negative balances impossible.
create or replace function public.payments_apply_to_debt() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_delta bigint; v_debt public.debts; v_paid bigint;
begin
  if tg_op = 'INSERT' then
    v_delta := new.amount;
  elsif old.status = 'confirmed' and new.status = 'voided' then
    v_delta := -new.amount;
  else
    return new;
  end if;
  select * into v_debt from public.debts where id = new.debt_id and store_id = new.store_id for update;
  if not found then raise exception 'debt_not_found'; end if;
  if v_debt.status = 'cancelled' then raise exception 'debt_cancelled'; end if;
  v_paid := v_debt.paid_amount + v_delta;
  if v_paid > v_debt.amount then raise exception 'overpayment'; end if;
  if v_paid < 0 then raise exception 'negative_balance'; end if;
  update public.debts
     set paid_amount = v_paid,
         status = (case when v_paid >= v_debt.amount then 'paid'
                        when v_paid > 0 then 'partial' else 'open' end)::public.debt_status
   where id = v_debt.id;
  return new;
end $$;
create trigger payments_apply after insert or update on public.payments
  for each row execute function public.payments_apply_to_debt();

-- ---------- support messages -----------------------------------------
create or replace function public.support_message_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_conv public.support_conversations;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into v_conv from public.support_conversations where id = new.conversation_id;
  if not found then raise exception 'conversation_not_found'; end if;
  if v_conv.status = 'closed' then raise exception 'conversation_closed'; end if;
  new.store_id    := v_conv.store_id;
  new.sender_id   := auth.uid();
  new.sender_role := (case when public.is_admin() then 'admin' else 'owner' end)::public.user_role;
  new.read_at     := null;
  if new.attachment_path is not null and split_part(new.attachment_path, '/', 1) <> new.store_id::text then
    raise exception 'invalid_attachment_path';
  end if;
  return new;
end $$;
create trigger support_message_before_insert before insert on public.support_messages
  for each row execute function public.support_message_before_insert();

create or replace function public.support_message_after_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
declare v_owner uuid;
begin
  update public.support_conversations set last_message_at = new.created_at where id = new.conversation_id;
  if new.sender_role = 'owner' then
    perform public.notify_admins(new.store_id, 'support_message', 'Yangi xabar',
      left(coalesce(new.body, 'Fayl'), 120), jsonb_build_object('conversation_id', new.conversation_id));
  else
    select owner_id into v_owner from public.stores where id = new.store_id;
    perform public.notify(v_owner, new.store_id, 'support_message', 'Admin javobi',
      left(coalesce(new.body, 'Fayl'), 120), jsonb_build_object('conversation_id', new.conversation_id));
  end if;
  return new;
end $$;
create trigger support_message_after_insert after insert on public.support_messages
  for each row execute function public.support_message_after_insert();

create or replace function public.support_message_guard() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (to_jsonb(new) - 'read_at') is distinct from (to_jsonb(old) - 'read_at') then
    raise exception 'immutable_record';
  end if;
  return new;
end $$;
create trigger support_message_guard before update on public.support_messages
  for each row execute function public.support_message_guard();
create trigger support_message_no_delete before delete on public.support_messages
  for each row execute function public.forbid_mutation();

-- =====================================================================
-- STORE RPC
-- =====================================================================
create or replace function public.register_store(p_name text, p_city text default null, p_address text default null)
returns public.stores language plpgsql security definer set search_path = '' as $$
declare v public.stores;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  begin
    insert into public.stores (owner_id, name, city, address)
    values (auth.uid(), trim(p_name), nullif(trim(coalesce(p_city, '')), ''), nullif(trim(coalesce(p_address, '')), ''))
    returning * into v;
  exception when unique_violation then
    raise exception 'store_already_exists';
  end;
  perform public.notify_admins(v.id, 'system', 'Yangi doʻkon roʻyxatdan oʻtdi', v.name, jsonb_build_object('store_id', v.id));
  return v;
end $$;

create or replace function public.create_debt(
  p_customer_id uuid, p_amount bigint, p_due_on date, p_comment text default null, p_issued_on date default null)
returns public.debts language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v public.debts;
begin
  if p_amount is null or p_amount <= 0 or p_amount > 100000000000 then raise exception 'invalid_amount'; end if;
  perform 1 from public.customers where id = p_customer_id and store_id = v_store and deleted_at is null;
  if not found then raise exception 'customer_not_found'; end if;
  insert into public.debts (store_id, customer_id, amount, issued_on, due_on, comment, created_by)
  values (v_store, p_customer_id, p_amount, coalesce(p_issued_on, public.today_tashkent()), p_due_on,
          nullif(trim(coalesce(p_comment, '')), ''), auth.uid())
  returning * into v;
  return v;
end $$;

create or replace function public.update_debt(
  p_debt_id uuid, p_amount bigint default null, p_due_on date default null, p_comment text default null)
returns public.debts language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v public.debts; v_amount bigint;
begin
  select * into v from public.debts where id = p_debt_id and store_id = v_store for update;
  if not found then raise exception 'debt_not_found'; end if;
  if v.status = 'cancelled' then raise exception 'debt_cancelled'; end if;
  v_amount := coalesce(p_amount, v.amount);
  if v_amount <= 0 or v_amount > 100000000000 then raise exception 'invalid_amount'; end if;
  if v_amount < v.paid_amount then raise exception 'amount_below_paid'; end if;
  update public.debts
     set amount = v_amount,
         due_on = coalesce(p_due_on, due_on),
         comment = coalesce(nullif(trim(coalesce(p_comment, '')), ''), comment),
         status = (case when v.paid_amount >= v_amount then 'paid'
                        when v.paid_amount > 0 then 'partial' else 'open' end)::public.debt_status
   where id = v.id returning * into v;
  return v;
end $$;

create or replace function public.cancel_debt(p_debt_id uuid, p_reason text)
returns public.debts language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v public.debts;
begin
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'reason_required'; end if;
  select * into v from public.debts where id = p_debt_id and store_id = v_store for update;
  if not found then raise exception 'debt_not_found'; end if;
  if v.status = 'cancelled' then raise exception 'debt_cancelled'; end if;
  if v.paid_amount > 0 then raise exception 'debt_has_payments'; end if;   -- void payments first
  update public.debts set status = 'cancelled', cancelled_at = now(), cancel_reason = trim(p_reason)
   where id = v.id returning * into v;
  return v;
end $$;

create or replace function public.record_payment(
  p_debt_id uuid, p_amount bigint, p_paid_on date default null,
  p_method text default 'cash', p_note text default null, p_idempotency_key uuid default null)
returns public.payments language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v_debt public.debts; v_pay public.payments; v_day date;
begin
  select * into v_debt from public.debts where id = p_debt_id and store_id = v_store for update;
  if not found then raise exception 'debt_not_found'; end if;
  if v_debt.status = 'cancelled' then raise exception 'debt_cancelled'; end if;
  if p_idempotency_key is not null then
    select * into v_pay from public.payments where store_id = v_store and idempotency_key = p_idempotency_key;
    if found then return v_pay; end if;
  end if;
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  if p_amount > v_debt.remaining_amount then raise exception 'overpayment'; end if;
  v_day := coalesce(p_paid_on, public.today_tashkent());
  if v_day > public.today_tashkent() + 1 then raise exception 'future_date'; end if;
  insert into public.payments (store_id, debt_id, amount, paid_on, method, note, idempotency_key, created_by)
  values (v_store, p_debt_id, p_amount, v_day, coalesce(p_method, 'cash'),
          nullif(trim(coalesce(p_note, '')), ''), p_idempotency_key, auth.uid())
  returning * into v_pay;
  return v_pay;
end $$;

create or replace function public.settle_debt(p_debt_id uuid, p_paid_on date default null, p_note text default null)
returns public.payments language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v_rem bigint;
begin
  select remaining_amount into v_rem from public.debts where id = p_debt_id and store_id = v_store for update;
  if not found then raise exception 'debt_not_found'; end if;
  if v_rem <= 0 then raise exception 'already_paid'; end if;
  return public.record_payment(p_debt_id, v_rem, p_paid_on, 'cash', p_note, null);
end $$;

-- A wrong payment is never edited or deleted: it is voided with a reason, history stays.
create or replace function public.void_payment(p_payment_id uuid, p_reason text)
returns public.payments language plpgsql security definer set search_path = '' as $$
declare v_store uuid := public.require_writable_store(); v_debt uuid; v public.payments;
begin
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'reason_required'; end if;
  select debt_id into v_debt from public.payments where id = p_payment_id and store_id = v_store;
  if not found then raise exception 'payment_not_found'; end if;
  perform 1 from public.debts where id = v_debt for update;               -- lock order: debt -> payment
  select * into v from public.payments where id = p_payment_id for update;
  if v.status = 'voided' then raise exception 'already_voided'; end if;
  update public.payments
     set status = 'voided', voided_at = now(), voided_by = auth.uid(), void_reason = trim(p_reason)
   where id = p_payment_id returning * into v;
  return v;
end $$;

create or replace function public.get_store_stats(p_from date default null, p_to date default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_store uuid; v_today date := public.today_tashkent(); v_from date; v_to date;
begin
  select id into v_store from public.stores where owner_id = auth.uid();
  if v_store is null then raise exception 'store_not_found'; end if;
  v_to := coalesce(p_to, v_today); v_from := coalesce(p_from, v_to - 29);
  return jsonb_build_object(
    'from', v_from, 'to', v_to,
    'outstanding',    coalesce((select sum(remaining_amount) from public.debts where store_id = v_store and status in ('open','partial')), 0)::bigint,
    'overdue_amount', coalesce((select sum(remaining_amount) from public.debts where store_id = v_store and status in ('open','partial') and due_on < v_today), 0)::bigint,
    'overdue_count',  (select count(*) from public.debts where store_id = v_store and status in ('open','partial') and due_on < v_today),
    'customers_count',(select count(*) from public.customers where store_id = v_store and deleted_at is null),
    'issued',    coalesce((select sum(amount) from public.debts where store_id = v_store and status <> 'cancelled' and issued_on between v_from and v_to), 0)::bigint,
    'collected', coalesce((select sum(amount) from public.payments where store_id = v_store and status = 'confirmed' and paid_on between v_from and v_to), 0)::bigint,
    'daily', coalesce((select jsonb_agg(jsonb_build_object('date', d, 'amount', s) order by d)
                       from (select paid_on d, sum(amount)::bigint s from public.payments
                             where store_id = v_store and status = 'confirmed' and paid_on between v_from and v_to
                             group by paid_on) x), '[]'::jsonb),
    'top_customers', coalesce((select jsonb_agg(jsonb_build_object('customer_id', t.id, 'full_name', t.full_name, 'remaining', t.rem, 'debts', t.n) order by t.rem desc)
                       from (select c.id, c.full_name, sum(d.remaining_amount)::bigint rem, count(*) n
                             from public.debts d join public.customers c on c.id = d.customer_id
                             where d.store_id = v_store and d.status in ('open','partial')
                             group by c.id, c.full_name order by rem desc limit 5) t), '[]'::jsonb)
  );
end $$;

-- =====================================================================
-- SUBSCRIPTIONS
-- =====================================================================
create or replace function public.request_subscription(p_plan_id uuid, p_reference text default null, p_proof_path text default null)
returns public.subscriptions language plpgsql security definer set search_path = '' as $$
declare v_store public.stores; v_plan public.subscription_plans; v public.subscriptions;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into v_store from public.stores where owner_id = auth.uid();
  if not found then raise exception 'store_not_found'; end if;
  if v_store.status = 'blocked' then raise exception 'store_blocked'; end if;
  select * into v_plan from public.subscription_plans where id = p_plan_id and is_active;
  if not found then raise exception 'plan_not_found'; end if;
  if p_proof_path is not null and split_part(p_proof_path, '/', 1) <> v_store.id::text then
    raise exception 'invalid_attachment_path';
  end if;
  begin
    insert into public.subscriptions (store_id, plan_id, duration_months, price_uzs, payment_reference, payment_proof_path)
    values (v_store.id, v_plan.id, v_plan.duration_months, v_plan.price_uzs, left(p_reference, 200), p_proof_path)
    returning * into v;
  exception when unique_violation then
    raise exception 'pending_request_exists';
  end;
  perform public.notify_admins(v_store.id, 'subscription_requested', 'Toʻlov tekshiruvi kutilmoqda', v_store.name,
                               jsonb_build_object('subscription_id', v.id));
  return v;
end $$;

create or replace function public.admin_confirm_subscription(p_subscription_id uuid)
returns public.subscriptions language plpgsql security definer set search_path = '' as $$
declare v public.subscriptions; v_base timestamptz; v_owner uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select * into v from public.subscriptions where id = p_subscription_id for update;
  if not found then raise exception 'subscription_not_found'; end if;
  if v.status <> 'pending' then raise exception 'invalid_state'; end if;
  -- renewal extends from the end of the latest active period, otherwise starts now
  select greatest(coalesce(max(ends_at), now()), now()) into v_base
    from public.subscriptions where store_id = v.store_id and status = 'active' and ends_at > now();
  update public.subscriptions
     set status = 'active', starts_at = v_base, ends_at = v_base + make_interval(months => v.duration_months),
         reviewed_by = auth.uid(), reviewed_at = now()
   where id = v.id returning * into v;
  update public.stores set status = 'active', status_changed_at = now(), status_changed_by = auth.uid()
   where id = v.store_id and status = 'pending';
  select owner_id into v_owner from public.stores where id = v.store_id;
  perform public.notify(v_owner, v.store_id, 'subscription_confirmed', 'Obuna faollashtirildi', null,
                        jsonb_build_object('subscription_id', v.id, 'ends_at', v.ends_at));
  return v;
end $$;

create or replace function public.admin_reject_subscription(p_subscription_id uuid, p_reason text)
returns public.subscriptions language plpgsql security definer set search_path = '' as $$
declare v public.subscriptions; v_owner uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'reason_required'; end if;
  select * into v from public.subscriptions where id = p_subscription_id for update;
  if not found then raise exception 'subscription_not_found'; end if;
  if v.status <> 'pending' then raise exception 'invalid_state'; end if;
  update public.subscriptions set status = 'rejected', reject_reason = trim(p_reason),
         reviewed_by = auth.uid(), reviewed_at = now() where id = v.id returning * into v;
  select owner_id into v_owner from public.stores where id = v.store_id;
  perform public.notify(v_owner, v.store_id, 'subscription_rejected', 'Toʻlov tasdiqlanmadi', trim(p_reason),
                        jsonb_build_object('subscription_id', v.id));
  return v;
end $$;

-- Manual grant / renewal by the platform admin (price defaults to the plan price; 0 = free).
create or replace function public.admin_grant_subscription(
  p_store_id uuid, p_plan_id uuid, p_price bigint default null, p_note text default null)
returns public.subscriptions language plpgsql security definer set search_path = '' as $$
declare v_plan public.subscription_plans; v_id uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  perform 1 from public.stores where id = p_store_id;
  if not found then raise exception 'store_not_found'; end if;
  select * into v_plan from public.subscription_plans where id = p_plan_id and is_active;
  if not found then raise exception 'plan_not_found'; end if;
  update public.subscriptions set status = 'cancelled' where store_id = p_store_id and status = 'pending';
  insert into public.subscriptions (store_id, plan_id, duration_months, price_uzs, payment_method, payment_reference)
  values (p_store_id, v_plan.id, v_plan.duration_months, coalesce(p_price, v_plan.price_uzs), 'manual',
          coalesce(left(p_note, 200), 'admin grant'))
  returning id into v_id;
  return public.admin_confirm_subscription(v_id);
end $$;

create or replace function public.admin_set_store_status(p_store_id uuid, p_status public.store_status, p_reason text default null)
returns public.stores language plpgsql security definer set search_path = '' as $$
declare v public.stores;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_status = 'pending' then raise exception 'invalid_state'; end if;
  if p_status = 'blocked' and char_length(trim(coalesce(p_reason, ''))) < 3 then raise exception 'reason_required'; end if;
  update public.stores
     set status = p_status,
         blocked_reason = case when p_status = 'blocked' then trim(p_reason) else null end,
         status_changed_at = now(), status_changed_by = auth.uid()
   where id = p_store_id returning * into v;
  if not found then raise exception 'store_not_found'; end if;
  perform public.notify(v.owner_id, v.id, 'store_status',
          case when p_status = 'blocked' then 'Doʻkon bloklandi' else 'Doʻkon faollashtirildi' end,
          v.blocked_reason, jsonb_build_object('status', p_status));
  return v;
end $$;

create or replace function public.admin_dashboard_stats() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  return jsonb_build_object(
    'stores_total',   (select count(*) from public.stores),
    'stores_active',  (select count(*) from public.stores where status = 'active'),
    'stores_blocked', (select count(*) from public.stores where status = 'blocked'),
    'stores_pending', (select count(*) from public.stores where status = 'pending'),
    'users_total',    (select count(*) from public.profiles where role = 'owner'),
    'new_stores_30d', (select count(*) from public.stores where created_at >= now() - interval '30 days'),
    'stores_with_active_subscription', (select count(distinct store_id) from public.subscriptions where status = 'active' and starts_at <= now() and ends_at > now()),
    'expiring_5d',    (select count(distinct store_id) from public.subscriptions where status = 'active' and ends_at between now() and now() + interval '5 days'),
    'revenue_total',  coalesce((select sum(price_uzs) from public.subscriptions where status in ('active','expired') and reviewed_at is not null), 0)::bigint,
    'revenue_30d',    coalesce((select sum(price_uzs) from public.subscriptions where status in ('active','expired') and reviewed_at >= now() - interval '30 days'), 0)::bigint,
    'pending_payments', (select count(*) from public.subscriptions where status = 'pending'),
    'open_conversations', (select count(*) from public.support_conversations where status = 'open'),
    'monthly_revenue', coalesce((select jsonb_agg(jsonb_build_object('month', m, 'revenue', r) order by m)
        from (select date_trunc('month', reviewed_at)::date m, sum(price_uzs)::bigint r
              from public.subscriptions
              where status in ('active','expired') and reviewed_at >= date_trunc('month', now()) - interval '11 months'
              group by 1) t), '[]'::jsonb),
    'plan_breakdown', coalesce((select jsonb_agg(jsonb_build_object('plan', code, 'subscriptions', n, 'revenue', rev))
        from (select p.code, count(*) n, sum(s.price_uzs)::bigint rev
              from public.subscriptions s join public.subscription_plans p on p.id = s.plan_id
              where s.status in ('active','expired') group by p.code) b), '[]'::jsonb)
  );
end $$;

-- "Check" section: one call that answers status / subscription / expiry / payment / block / admin history
create or replace function public.admin_check_store(p_store_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_store public.stores; v_sub public.subscriptions;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select * into v_store from public.stores where id = p_store_id;
  if not found then raise exception 'store_not_found'; end if;
  select * into v_sub from public.subscriptions
   where store_id = p_store_id and status = 'active' and starts_at <= now() and ends_at > now()
   order by ends_at desc limit 1;
  return jsonb_build_object(
    'store', jsonb_build_object('id', v_store.id, 'name', v_store.name, 'status', v_store.status,
             'blocked_reason', v_store.blocked_reason, 'status_changed_at', v_store.status_changed_at),
    'owner', (select jsonb_build_object('full_name', full_name, 'phone', phone) from public.profiles where id = v_store.owner_id),
    'subscription_active', v_sub.id is not null,
    'subscription', case when v_sub.id is null then null else jsonb_build_object(
        'id', v_sub.id, 'starts_at', v_sub.starts_at, 'ends_at', v_sub.ends_at,
        'days_left', ceil(extract(epoch from (v_sub.ends_at - now())) / 86400)::int) end,
    'pending_requests', (select count(*) from public.subscriptions where store_id = p_store_id and status = 'pending'),
    'last_confirmed_payment', (select jsonb_build_object('amount', price_uzs, 'confirmed_at', reviewed_at, 'reference', payment_reference)
        from public.subscriptions where store_id = p_store_id and status in ('active','expired') and reviewed_at is not null
        order by reviewed_at desc limit 1),
    'admin_actions', coalesce((select jsonb_agg(to_jsonb(a) order by a.created_at desc) from (
        select l.created_at, l.action, l.entity_type, l.entity_id, l.actor_id
        from public.audit_logs l join public.profiles p on p.id = l.actor_id and p.role = 'admin'
        where l.store_id = p_store_id order by l.created_at desc limit 20) a), '[]'::jsonb)
  );
end $$;

-- =====================================================================
-- SUPPORT RPC
-- =====================================================================
create or replace function public.open_conversation(p_subject text, p_body text)
returns public.support_conversations language plpgsql security definer set search_path = '' as $$
declare v_store uuid; v public.support_conversations;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select id into v_store from public.stores where owner_id = auth.uid();
  if v_store is null then raise exception 'store_not_found'; end if;
  insert into public.support_conversations (store_id, subject, created_by)
  values (v_store, trim(p_subject), auth.uid()) returning * into v;
  insert into public.support_messages (conversation_id, body) values (v.id, p_body);   -- trigger fills the rest
  return v;
end $$;

create or replace function public.close_conversation(p_id uuid)
returns public.support_conversations language plpgsql security definer set search_path = '' as $$
declare v public.support_conversations;
begin
  select * into v from public.support_conversations where id = p_id for update;
  if not found then raise exception 'conversation_not_found'; end if;
  if not (public.is_admin() or public.owns_store(v.store_id)) then raise exception 'forbidden'; end if;
  if v.status = 'closed' then return v; end if;
  update public.support_conversations set status = 'closed', closed_at = now(), closed_by = auth.uid()
   where id = p_id returning * into v;
  return v;
end $$;

create or replace function public.mark_conversation_read(p_id uuid) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_conv public.support_conversations; v_admin boolean := public.is_admin(); v_n integer;
begin
  select * into v_conv from public.support_conversations where id = p_id;
  if not found then raise exception 'conversation_not_found'; end if;
  if not (v_admin or public.owns_store(v_conv.store_id)) then raise exception 'forbidden'; end if;
  update public.support_messages set read_at = now()
   where conversation_id = p_id and read_at is null
     and sender_role = (case when v_admin then 'owner' else 'admin' end)::public.user_role;
  get diagnostics v_n = row_count;
  return v_n;
end $$;

-- =====================================================================
-- SCHEDULED JOBS (service role / pg_cron only, never exposed to users)
-- =====================================================================
create or replace function public.generate_due_notifications() returns integer
language plpgsql security definer set search_path = '' as $$
declare v_today date := public.today_tashkent(); v_total integer := 0; v_n integer;
begin
  insert into public.notifications (user_id, store_id, type, title, body, data, dedupe_key)
  select s.owner_id, d.store_id, 'debt_due_soon', 'Toʻlov muddati yaqinlashmoqda', c.full_name,
         jsonb_build_object('debt_id', d.id, 'customer_id', d.customer_id, 'due_on', d.due_on, 'remaining', d.remaining_amount),
         'due:' || d.id || ':' || d.due_on
    from public.debts d join public.customers c on c.id = d.customer_id join public.stores s on s.id = d.store_id
   where d.status in ('open','partial') and d.due_on between v_today and v_today + 3 and s.status = 'active'
  on conflict (user_id, dedupe_key) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  insert into public.notifications (user_id, store_id, type, title, body, data, dedupe_key)
  select s.owner_id, d.store_id, 'debt_overdue', 'Qarz muddati oʻtgan', c.full_name,
         jsonb_build_object('debt_id', d.id, 'customer_id', d.customer_id, 'due_on', d.due_on, 'remaining', d.remaining_amount),
         'overdue:' || d.id || ':' || to_char(v_today, 'IYYY-IW')
    from public.debts d join public.customers c on c.id = d.customer_id join public.stores s on s.id = d.store_id
   where d.status in ('open','partial') and d.due_on < v_today and s.status = 'active'
  on conflict (user_id, dedupe_key) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;
  return v_total;
end $$;

create or replace function public.expire_subscriptions() returns integer
language plpgsql security definer set search_path = '' as $$
declare v_total integer := 0; v_n integer;
begin
  with ex as (
    update public.subscriptions set status = 'expired'
     where status = 'active' and ends_at <= now() returning id, store_id)
  insert into public.notifications (user_id, store_id, type, title, data, dedupe_key)
  select s.owner_id, ex.store_id, 'subscription_expired', 'Obuna muddati tugadi',
         jsonb_build_object('subscription_id', ex.id), 'expired:' || ex.id
    from ex join public.stores s on s.id = ex.store_id
  on conflict (user_id, dedupe_key) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;

  insert into public.notifications (user_id, store_id, type, title, data, dedupe_key)
  select s.owner_id, sb.store_id, 'subscription_expiring', 'Obuna tez orada tugaydi',
         jsonb_build_object('subscription_id', sb.id, 'ends_at', sb.ends_at), 'expiring:' || sb.id
    from public.subscriptions sb join public.stores s on s.id = sb.store_id
   where sb.status = 'active' and sb.ends_at between now() and now() + interval '5 days'
     and not exists (select 1 from public.subscriptions n
                      where n.store_id = sb.store_id and n.status = 'active' and n.ends_at > sb.ends_at)
  on conflict (user_id, dedupe_key) do nothing;
  get diagnostics v_n = row_count; v_total := v_total + v_n;
  return v_total;
end $$;

-- ---------- views -----------------------------------------------------
create view public.customer_balances with (security_invoker = true) as
select c.id as customer_id, c.store_id, c.full_name, c.phone, c.photo_path,
       coalesce(sum(d.amount)           filter (where d.status <> 'cancelled'), 0)::bigint as total_debt,
       coalesce(sum(d.paid_amount)      filter (where d.status <> 'cancelled'), 0)::bigint as total_paid,
       coalesce(sum(d.remaining_amount) filter (where d.status in ('open','partial')), 0)::bigint as remaining,
       coalesce(sum(d.remaining_amount) filter (where d.status in ('open','partial') and d.due_on < public.today_tashkent()), 0)::bigint as overdue
  from public.customers c left join public.debts d on d.customer_id = c.id
 where c.deleted_at is null
 group by c.id;

create view public.admin_store_overview with (security_invoker = true) as
select s.id, s.name, s.city, s.status, s.blocked_reason, s.created_at,
       p.full_name as owner_name, p.phone as owner_phone,
       cur.id as subscription_id, cur.plan_code, cur.ends_at as subscription_ends_at,
       (cur.id is not null) as subscription_active
  from public.stores s
  join public.profiles p on p.id = s.owner_id
  left join lateral (
    select sb.id, sb.ends_at, pl.code as plan_code
      from public.subscriptions sb join public.subscription_plans pl on pl.id = sb.plan_id
     where sb.store_id = s.id and sb.status = 'active' and sb.starts_at <= now() and sb.ends_at > now()
     order by sb.ends_at desc limit 1) cur on true
 where public.is_admin();

-- ===== supabase/migrations/0003_rls.sql =====
-- =====================================================================
-- QarzDaftar | 0003_rls.sql | least-privilege grants + Row Level Security
-- Principle: deny by default. Users get SELECT (filtered by RLS) and a few
-- column-limited writes. Everything financial goes through RPC functions.
-- =====================================================================

-- 1) Remove Supabase's permissive defaults ---------------------------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- 2) Enable RLS on every table ---------------------------------------
alter table public.profiles              enable row level security;
alter table public.stores                enable row level security;
alter table public.customers             enable row level security;
alter table public.debts                 enable row level security;
alter table public.payments              enable row level security;
alter table public.subscription_plans    enable row level security;
alter table public.subscriptions         enable row level security;
alter table public.support_conversations enable row level security;
alter table public.support_messages      enable row level security;
alter table public.notifications         enable row level security;
alter table public.audit_logs            enable row level security;

-- 3) Table / column privileges for signed-in users -------------------
grant select on public.profiles, public.stores, public.customers, public.debts, public.payments,
                public.subscription_plans, public.subscriptions, public.support_conversations,
                public.support_messages, public.notifications, public.audit_logs,
                public.customer_balances, public.admin_store_overview
  to authenticated;

grant update (full_name, language)           on public.profiles           to authenticated;  -- never role / phone
grant update (name, city, address)           on public.stores             to authenticated;  -- never status / owner
grant insert (store_id, full_name, phone, photo_path, note)  on public.customers to authenticated;
grant update (full_name, phone, photo_path, note, deleted_at) on public.customers to authenticated; -- soft delete only
grant insert (code, name, duration_months, price_uzs, is_active, sort_order) on public.subscription_plans to authenticated;
grant update (name, duration_months, price_uzs, is_active, sort_order)       on public.subscription_plans to authenticated;
grant insert (conversation_id, body, attachment_path, attachment_name, attachment_type, attachment_size)
  on public.support_messages to authenticated;
grant update (read_at) on public.notifications to authenticated;
-- debts, payments, subscriptions, audit_logs: SELECT only -> writes only via RPC.

-- 4) Policies ---------------------------------------------------------
-- profiles
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- stores
create policy stores_select on public.stores for select to authenticated
  using (owner_id = auth.uid() or public.is_admin());
create policy stores_update_own on public.stores for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- customers (admin deliberately has NO access to shop customer data)
create policy customers_select on public.customers for select to authenticated
  using (public.owns_store(store_id));
create policy customers_insert on public.customers for insert to authenticated
  with check (public.owns_store(store_id) and public.store_can_write(store_id));
create policy customers_update on public.customers for update to authenticated
  using (public.owns_store(store_id) and public.store_can_write(store_id))
  with check (public.owns_store(store_id));

-- debts / payments: read-only for owners, no admin access
create policy debts_select on public.debts for select to authenticated
  using (public.owns_store(store_id));
create policy payments_select on public.payments for select to authenticated
  using (public.owns_store(store_id));

-- subscription plans
create policy plans_select on public.subscription_plans for select to authenticated
  using (is_active or public.is_admin());
create policy plans_insert_admin on public.subscription_plans for insert to authenticated
  with check (public.is_admin());
create policy plans_update_admin on public.subscription_plans for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- subscriptions
create policy subscriptions_select on public.subscriptions for select to authenticated
  using (public.owns_store(store_id) or public.is_admin());

-- support (works even when subscription is expired or store is blocked)
create policy conv_select on public.support_conversations for select to authenticated
  using (public.owns_store(store_id) or public.is_admin());
create policy msg_select on public.support_messages for select to authenticated
  using (public.owns_store(store_id) or public.is_admin());
create policy msg_insert on public.support_messages for insert to authenticated
  with check (public.owns_store(store_id) or public.is_admin());   -- store_id/sender are set by trigger

-- notifications
create policy notif_select on public.notifications for select to authenticated
  using (user_id = auth.uid());
create policy notif_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit
create policy audit_select on public.audit_logs for select to authenticated
  using (public.is_admin() or (store_id is not null and public.owns_store(store_id)));

-- 5) Function privileges ----------------------------------------------
grant execute on function
  public.is_admin(), public.owns_store(uuid), public.store_has_active_subscription(uuid),
  public.store_can_write(uuid), public.today_tashkent(), public.storage_store_id(text),
  -- store
  public.register_store(text, text, text),
  public.create_debt(uuid, bigint, date, text, date),
  public.update_debt(uuid, bigint, date, text),
  public.cancel_debt(uuid, text),
  public.record_payment(uuid, bigint, date, text, text, uuid),
  public.settle_debt(uuid, date, text),
  public.void_payment(uuid, text),
  public.get_store_stats(date, date),
  public.request_subscription(uuid, text, text),
  -- support
  public.open_conversation(text, text),
  public.close_conversation(uuid),
  public.mark_conversation_read(uuid),
  -- admin (each one re-checks is_admin() internally)
  public.admin_confirm_subscription(uuid),
  public.admin_reject_subscription(uuid, text),
  public.admin_grant_subscription(uuid, uuid, bigint, text),
  public.admin_set_store_status(uuid, public.store_status, text),
  public.admin_dashboard_stats(),
  public.admin_check_store(uuid)
to authenticated;
-- generate_due_notifications() and expire_subscriptions(): service_role / pg_cron only.

-- 6) Realtime (RLS is applied to realtime events) ----------------------
alter publication supabase_realtime add table
  public.support_messages, public.support_conversations, public.notifications;

grant execute on function public.generate_due_notifications(), public.expire_subscriptions() to service_role;

-- ===== supabase/migrations/0004_storage.sql =====
-- =====================================================================
-- QarzDaftar | 0004_storage.sql | private buckets + path-based policies
-- Path convention (enforced): <store_id>/<anything>   e.g. 7c1e.../photo.jpg
-- Files are never public: the app uses signed URLs.
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('customer-photos',     'customer-photos',     false,  2097152, array['image/jpeg','image/png','image/webp']),
  ('support-attachments', 'support-attachments', false, 10485760, array['image/jpeg','image/png','image/webp','application/pdf']),
  ('payment-proofs',      'payment-proofs',      false,  5242880, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- customer photos: store owner only (read / upload / replace). Writes need an active subscription.
create policy "customer photos read" on storage.objects for select to authenticated
  using (bucket_id = 'customer-photos' and public.owns_store(public.storage_store_id(name)));
create policy "customer photos write" on storage.objects for insert to authenticated
  with check (bucket_id = 'customer-photos' and public.owns_store(public.storage_store_id(name))
              and public.store_can_write(public.storage_store_id(name)));
create policy "customer photos update" on storage.objects for update to authenticated
  using (bucket_id = 'customer-photos' and public.owns_store(public.storage_store_id(name))
         and public.store_can_write(public.storage_store_id(name)));

-- support attachments: owner of the store + admin, insert-only (no overwrite / delete)
create policy "support files read" on storage.objects for select to authenticated
  using (bucket_id = 'support-attachments'
         and (public.owns_store(public.storage_store_id(name)) or public.is_admin()));
create policy "support files write" on storage.objects for insert to authenticated
  with check (bucket_id = 'support-attachments'
              and (public.owns_store(public.storage_store_id(name)) or public.is_admin()));

-- payment proofs: owner uploads, admin + owner read, insert-only
create policy "proofs read" on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs'
         and (public.owns_store(public.storage_store_id(name)) or public.is_admin()));
create policy "proofs write" on storage.objects for insert to authenticated
  with check (bucket_id = 'payment-proofs' and public.owns_store(public.storage_store_id(name)));

-- ===== supabase/migrations/0005_seed.sql =====
-- =====================================================================
-- QarzDaftar | 0005_seed.sql | default tariffs (admin can change them later)
-- =====================================================================
insert into public.subscription_plans (code, name, duration_months, price_uzs, sort_order) values
  ('month_1', '1 oy',  1, 60000, 1),
  ('month_2', '2 oy',  2, 85000, 2)
on conflict (code) do nothing;

-- ===== supabase/migrations/0006_theme.sql =====
-- Theme preference is owner-controlled only; role and identity remain protected.
alter table public.profiles
  add column if not exists theme text not null default 'yashil'
  check (theme in ('yashil','oq'));
grant update (theme) on public.profiles to authenticated;

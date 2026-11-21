-- QarzDaftar theme preference migration
alter table public.profiles
  add column if not exists theme text not null default 'yashil'
  check (theme in ('yashil','oq'));

-- Existing profile RLS remains owner-scoped; grant only the theme column,
-- never role or identity fields.
grant update (theme) on public.profiles to authenticated;

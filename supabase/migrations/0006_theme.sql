-- QarzDaftar theme preference migration
alter table public.profiles
  add column if not exists theme text not null default 'dark'
  check (theme in ('dark','bright'));

-- Existing profile RLS remains owner-scoped; grant only the theme column,
-- never role or identity fields.
grant update (theme) on public.profiles to authenticated;

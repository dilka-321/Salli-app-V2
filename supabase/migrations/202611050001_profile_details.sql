-- Salli Money Manager profile details + first-login profile completion
-- Run once in Supabase SQL Editor after deploying app version 1.8.0.

alter table public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists profile_completed boolean not null default false;

create or replace function public.save_my_profile_details(
  p_full_name text,
  p_phone text default null,
  p_country text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in.';
  end if;

  if p_full_name is null or length(trim(p_full_name)) < 2 then
    raise exception 'Please enter your full name.';
  end if;

  update public.profiles
  set full_name = left(trim(p_full_name), 100),
      phone = nullif(left(trim(coalesce(p_phone, '')), 30), ''),
      country = nullif(left(trim(coalesce(p_country, '')), 80), ''),
      profile_completed = true
  where user_id = auth.uid()
    and role = 'user'
    and status = 'approved';

  if not found then
    raise exception 'Your account must be approved before profile details can be saved.';
  end if;
end;
$$;

revoke all on function public.save_my_profile_details(text, text, text) from public;
grant execute on function public.save_my_profile_details(text, text, text) to authenticated;

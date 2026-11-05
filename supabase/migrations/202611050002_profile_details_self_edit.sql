-- Salli profile editor fix: allow every approved signed-in user (including admin)
-- to update only their own profile details. Run once in Supabase SQL Editor.

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
    raise exception 'Please enter your full name (at least 2 characters).';
  end if;
  update public.profiles
  set full_name = left(trim(p_full_name), 100),
      phone = nullif(left(trim(coalesce(p_phone, '')), 30), ''),
      country = nullif(left(trim(coalesce(p_country, '')), 80), ''),
      profile_completed = true
  where user_id = auth.uid() and status = 'approved';
  if not found then
    raise exception 'Your account must be approved before profile details can be saved.';
  end if;
end;
$$;
revoke all on function public.save_my_profile_details(text, text, text) from public;
grant execute on function public.save_my_profile_details(text, text, text) to authenticated;

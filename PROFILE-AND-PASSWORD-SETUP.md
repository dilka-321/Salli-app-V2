# Salli 1.8.0 — profile details and password recovery

## App changes
- Admin approvals is now the last item in the administrator's side menu (the floating button is removed).
- After a normal user is approved, their first sign-in displays a required profile form (full name; phone and country optional).
- Details are saved to `public.profiles` through a restricted RPC; users cannot choose their own role or approval status.
- Sign-in screen includes Forgot password. Supabase sends a recovery email; opening its link returns to Salli to set a new password.
- Admin approvals list shows the details users chose to provide.

## Database migration
Before deploying the new app, open Supabase SQL Editor and run:
`supabase/migrations/202611050001_profile_details.sql`

This adds profile columns and a restricted function. It does not change roles, approval status, or existing financial data.

## Supabase redirect configuration
In Supabase Dashboard → Authentication → URL Configuration:
- Set Site URL to `https://dilka-321.github.io/Salli-app-V2/`
- Add that same address to Redirect URLs (exact trailing slash).
- Save changes.

Keep email confirmation enabled. Test password recovery with a test account before inviting users. Never put a Supabase secret/service-role key in the app.


## Profile editor update (v1.8.1)
Run `supabase/migrations/202611050002_profile_details_self_edit.sql` in the Supabase SQL Editor before deploying v1.8.1. This lets any approved account, including the administrator, update only its own profile details.

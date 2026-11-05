# Salli Money Manager

Salli is a single-page money manager packaged for Android with Capacitor and published as a progressive web app (PWA).

## Cloud accounts and data

- Supabase email/password authentication.
- New registrations create a `pending` profile; an administrator must approve them.
- Each approved account stores its own JSON app state in `public.user_data`.
- Row Level Security must remain enabled on `profiles` and `user_data`.
- The browser app uses only the Supabase publishable key. Never place a Supabase secret/service-role key in this repository.
- Local data is namespaced by Supabase user ID. Changes are saved locally first and queued for cloud sync.
- If another device changed the cloud copy while this device has unsynced changes, Salli asks which complete copy to keep. Export backups from both devices before resolving if both contain important changes.

## Supabase configuration

This repository is configured for the Salli Supabase project and GitHub Pages URL:

`https://dilka-321.github.io/Salli-app-V2/`

In Supabase, set **Authentication → URL Configuration**:

- Site URL: `https://dilka-321.github.io/Salli-app-V2/`
- Redirect URL allow-list: `https://dilka-321.github.io/Salli-app-V2/`

The database must contain the `profiles` and `user_data` tables, the new-user profile trigger, `is_admin()` / `is_approved()` functions, and the RLS policies created in the setup SQL. The first administrator must be assigned through the SQL Editor, not from the public app.

## Website deployment

1. Push this repository to the `main` branch.
2. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. The `Deploy Salli website` workflow publishes the contents of `www/` to GitHub Pages.
4. The site URL is `https://dilka-321.github.io/Salli-app-V2/`.

The PWA service worker caches the app shell and Supabase browser SDK after an online visit. A first-time sign-in still requires internet access.

## Android APK

The existing `Build Android APK` GitHub Actions workflow builds a debug APK. Push to `main` or run it manually from **Actions**; download the `Salli-APK` artifact.

For local builds, use Node.js 18+, JDK 17 and Android Studio:

```sh
npm install
npx cap add android
npx cap sync android
cd android && ./gradlew assembleDebug
```

## Important operational notes

- This project does not include a Supabase secret key.
- Supabase free-tier quotas and inactivity/pause policies apply; “free” is not a guarantee of unlimited or permanent hosting.
- Offline changes stay on that device until synchronization succeeds. Use **Backup & Restore** for independent backups.
- The cloud row stores the app's complete state as one JSON document per user. Avoid editing the same account on multiple devices simultaneously; if a conflict occurs, Salli asks which full copy to retain.

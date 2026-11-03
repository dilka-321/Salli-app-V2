# Salli Money Manager — Android app

This folder turns the Salli web app (`www/index.html`) into an installable Android APK using Capacitor.

## Option A — build the APK in the cloud with GitHub (no Android Studio needed)
1. Create a free GitHub account and a new repository.
2. Upload everything in this folder (including the hidden `.github` folder) to the repository.
3. Open the **Actions** tab. The "Build Android APK" workflow runs automatically (about 5–8 minutes).
4. Open the finished run and download **Salli-APK** from "Artifacts". Unzip it to get `app-debug.apk`.
5. Copy the APK to your phone, open it and allow "Install unknown apps" when asked.

## Option B — build on your computer
Requirements: Node.js 18+, JDK 17 and Android Studio (with the Android SDK).
```
npm install
npx cap add android
# allow fingerprint / face unlock: add this line to android/app/src/main/AndroidManifest.xml (inside <manifest>)
#   <uses-permission android:name="android.permission.USE_BIOMETRIC" />
npm run android:apk        # APK at android/app/build/outputs/apk/debug/app-debug.apk
npm run android:open       # or open the project in Android Studio
```

## Updating the app
Replace `www/index.html` with a new version and run `npx cap sync android` (or push to GitHub again).

## Publishing to Google Play
Build a signed release bundle in Android Studio (Build → Generate Signed Bundle / APK) and upload the `.aab` in the Google Play Console.

## Notes
- Biometric unlock: Settings → turn on App Lock (PIN), then Biometric Unlock. The phone asks for your fingerprint or face when the app opens; the PIN always works as a backup.
- Exchange rates update automatically once a day when the phone is online (source: open.er-api.com). Manual rates in Settings → Exchange Rates always take priority.
- The share buttons open Android's share sheet (WhatsApp, Gmail, etc.).
- All data is stored on the phone. Use **Backup & Restore** in the app to keep a copy.
- The Android back button navigates back inside the app and asks before exiting.
- Automatic SMS reading needs an extra native SMS plugin and the READ_SMS permission (Google Play restricts this permission); the built-in SMS Parser works by pasting messages.

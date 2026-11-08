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


## Version 1.8.2 stability fixes
- Isolates side-menu scrolling from the dashboard.
- Android hardware Back from Admin approvals returns to the open side menu; subsequent Back closes the menu, then navigates the existing page stack before offering Exit at the home screen.
- Shows a secure session-loading screen at startup to prevent a sign-in flash before restoring an existing session.
- Rechecks online exchange rates when the cached fetch is older than six hours and when the app returns online/foreground. The provider itself publishes rates on its own update schedule; manual rates still take priority.

## Version 1.8.3 fixes
- Cloud/offline account data now gets the same data upgrades as local data, so Fixed Deposits work again (Fixed Deposit asset type, FD interest payouts) along with recurring-payment and subscription-reminder defaults. Restored backups get the same upgrades.
- Monthly FD interest is posted when a cloud account opens.
- Deleting a loan or lending repayment transaction from the transaction list now removes it from the loan/lending, so the balance and Paid/Active status update. Existing repayments whose transaction was already deleted are cleaned up once automatically.
- Editing a repayment transaction from the transaction list updates the loan/lending as well.
- Loan → Payment History: each repayment has a ⋮ menu to Edit payment (amount, bank fee, wallet, date, note) or Delete payment (also removes its transaction and bank fee).

## Version 1.9.0
**Linked records now stay in step (delete in one place → gone from both)**
- Loans: deleting the loan in the Loans section also removes its "Loan received" transaction, repayments and bank fees. Deleting the "Loan received" transaction from the dashboard removes the loan (the confirmation says so first).
- Lending: deleting the lending removes its "lending created" transaction and received payments; deleting that transaction from the dashboard removes the lending.
- Subscriptions: deleting a subscription payment from the transaction list removes it from the subscription's Payment History (and puts the next payment date back). Each payment in Payment History now has a ⋮ menu with **Edit payment** and **Delete payment**. Payments whose transaction was already deleted are cleaned up once automatically.
- Editing a loan received / lending / subscription transaction from the transaction list updates the linked record.

**Loan overdue**
- When a loan instalment date has passed, the loan shows an **OVERDUE** badge (detail and Loans list), the overdue instalments are marked in the schedule, and the button becomes **PAY NOW - OVERDUE**.

**Offline**
- The sign-in library and all app fonts are bundled into the app at build time (`scripts/copy-vendor.js`, run by both GitHub workflows), so the APK and the website open without internet.
- With no internet, Salli opens the last signed-in account from the data saved on the phone; changes sync automatically when the connection returns.
- The website's offline cache (`sw.js`) also keeps the stylesheet, bundled files and Google Fonts.

**Premium look** (`www/premium.css`, styling only)
- Soft aurora background, light-edged cards with depth, glossy buttons with press feedback, frosted top/bottom bars, smooth screen and list entrance animations, tabular numbers. Works with dark/light mode and every accent colour; animations switch off when the phone's "reduce motion" setting is on.

## Version 1.9.1
**Everything linked now updates everywhere**
- Edit Loan (name / amount / currency) updates its "Loan received" transaction in the dashboard list; editing that transaction updates the loan.
- Lending: new **Edit lending** in the ⋮ menu (name, amount, currency, account, due date, note) — updates its transaction. Editing the transaction updates the lending.
- Lending received payments: ⋮ → **Edit payment** (amount, account, date, note) — updates its transaction, and the other way round.
- Subscription, installment and recurring payments edited in the full transaction editor now update their subscription / plan / recurring payment. Deleting a recurring payment's transaction removes it and puts the due date back.
- Savings-goal deposits/withdrawals stay in step with their transaction (new entries).
- Editing a linked transaction no longer drops its loan / lending / FD link.

**Dark mode is true black** (#000 background, dark-grey glass cards).

## Version 1.9.2
- **Offline changes are kept.** Fixed: when the app came back online it could replace data added offline with the older cloud copy. Now unsynced changes always stay on the phone and are uploaded; if the cloud copy changed on another device meanwhile, you're asked which to keep. Coming back online no longer reloads the screen.
- **Sign-in screen** redesigned to look like part of the app: full colour background, large Salli logo, frosted form card and a big Sign in button.
- **Spending Trend**: touch and drag across the chart — a line follows your finger with dots on each series and a dark value box (Income, Expense, Cash In, Cash Out and the date). Lines are now smooth curves.
- **Due Soon card** on the dashboard (under SMS setup): loan instalments, money to receive, subscriptions, recurring payments and installments that are overdue or due within 7 days, e.g. "Payment overdue by 3 days". › opens the item, × hides that due. It can be moved or hidden in Customize Dashboard.

## Version 1.9.3
- **Transfers between different currencies** (including from a credit card): optional *Exchange rate* box — "1 MVR = [17] LKR", tap the currency to quote it the other way round. You can type the rate or the amount received (the other fills in). The rate is used for this transfer only.
  The receiving account gets the app-rate amount as the transfer plus the difference as **Exchange Gain** (income) or **Exchange Loss** (expense), so its balance equals the amount your bank actually credited. These appear in the transaction list, reports and bank statements.
- **Edit transfer** in each transfer's ⋮ menu (accounts, amount, rate, fee, date, note).
- **Loans: agreed exchange rates** (Add/Edit Loan → "Agreed exchange rates"): one rate per currency for that loan. The loan received amount, every repayment (in any currency or from any account) and the liability shown in your main currency use those rates — not the app rates — for that loan only.

## Version 1.9.4
- Loan transactions (loan received, repayments, their bank fees) now use that loan's **agreed exchange rate** for the main-currency amount everywhere: dashboard transaction list, daily totals, cash flow, reports. Other transactions keep the app rate.
- Add/Edit Loan: every agreed rate you enter (e.g. "1 USD = 23 MVR") now shows what the loan is worth in that currency, and it's used when you pay from an account in that currency.

## Version 1.9.5
- **Premium page transitions**: opening a page slides it in from the right while the previous page sinks back and dims; going back slides the page away to the right and brings the previous one forward; bottom tabs cross-fade with a gentle zoom. Page titles glide in, cards rise in one after another, and the active tab icon pops. Off automatically when the phone's "reduce motion" setting is on.

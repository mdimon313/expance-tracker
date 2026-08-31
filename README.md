# Expense Tracker — Premium Fintech App (Expo + Firebase)

A production-architected React Native (Expo Router) expense tracker. **No REST API, no Axios, no fake backend** — the app talks to Firebase directly through an isolated service layer (`Screen → Hook → Service → Firebase`).

## What's implemented and wired end-to-end

- **Firebase-only backend**: Auth, Firestore (with offline persistence), Storage, Notifications — configured in `src/firebase/`.
- **User-scoped data model**: every transaction/budget/goal/debt/account lives at `users/{uid}/{collection}/{docId}`, `userId` is always derived server-side from `auth.currentUser`, never trusted from the UI. `firestore.rules` enforces this (ownership can't be forged or changed).
- **3-second add-transaction flow**: FAB → bottom sheet with the amount field auto-focused → category/account preselected → save. See `src/components/QuickAddSheet.js`.
- **Auth**: email/password login & registration (React Hook Form + Zod, password-strength meter), password reset, biometric login via `expo-local-authentication` + `expo-secure-store` (only a session marker/preference is ever stored locally — never biometric data), and an OTP screen scaffolded for Firebase Phone Auth.
- **Startup flow**: splash → location permission → onboarding (first run only, via AsyncStorage) → auth/main app, exactly as specified.
- **Home dashboard**: gradient balance card, month income/expense, recent transactions with swipe-to-edit/delete (Reanimated + Gesture Handler).
- **Transactions**: search, type filter, sort, swipe actions, empty states.
- **Budgets**: monthly budget cards with animated progress bars that shift color at 80%/100%, plus a notification helper (`notifyBudgetThreshold`) ready to be triggered from a Cloud Function.
- **Analytics**: pie chart (expense by category), weekly trend line chart, top-categories list (`react-native-chart-kit`).
- **Savings goals & Debt/Lend**: full CRUD services + list screens (`src/services/savingsService.js`, `debtService.js`).
- **Settings**: profile photo upload (Storage), theme (light/dark/system, persisted), currency (BDT/USD/EUR, centralized formatting via `useCurrency`), language (EN/BN, centralized via `useLanguage`/`src/i18n`), biometric toggle, location-permission status, logout.
- **i18n**: full English + Bangla dictionaries, device-language detection (BN devices default to BN, everyone else to EN), Firestore-persisted preference, Firebase-error → friendly-message mapping, locale-aware currency/date formatting.
- **Demo data**: `src/services/seedService.js` writes real Firestore documents (not a mock API) via the same services the UI uses — call `seedDemoData()` once after first login during development.

## What's scaffolded but needs your Firebase project to finish

- Firebase **Phone Authentication** for the OTP screen (UI is complete, wire `confirmationResult.confirm(code)` in `app/auth/otp.js`).
- **Cloud Functions** for budget-threshold pushes, debt due-date reminders, and any privileged calculations — client-side triggers/log entries are in place (`notificationService.js`), but scheduled/production-grade notification delivery belongs server-side.
- **CSV/PDF export** — architecture point is in Settings; implement using each user's already-scoped transaction data.
- App icons/splash images (`src/assets/*.png` are referenced but not generated here).

## Project structure

```
app/                     Expo Router screens (file-based routing)
  onboarding/, auth/, (tabs)/, transaction/, savings/, debts/, profile/
src/
  firebase/               config.js, auth.js, firestore.js, storage.js, messaging.js
  services/               one file per domain — the ONLY layer that talks to Firestore
  context/                AuthContext, ThemeContext, CurrencyContext, LanguageContext
  hooks/                  useTransactions, useAccounts, useBudgets
  components/             Card, Button, Input, BalanceCard, TransactionItem/List,
                           QuickAddSheet, CategorySelector, BudgetCard, SavingsGoalCard,
                           DebtCard, FAB, EmptyState, Skeleton, ProgressBar...
  i18n/                   index.js, en.js, bn.js
  constants/               colors.js, categories.js
firestore.rules
```

## Setup

1. **Create a Firebase project** at console.firebase.google.com.
2. **Enable Authentication** → Email/Password (and Phone, if you'll wire OTP).
3. **Enable Cloud Firestore** (production mode) and **Firebase Storage**.
4. **Deploy security rules**: `firebase deploy --only firestore:rules` (rules are in `firestore.rules`).
5. **Register a Web app** in Firebase project settings to get your config values.
6. Copy `.env.example` to `.env` and fill in the `EXPO_PUBLIC_FIREBASE_*` values.
7. Install dependencies:
   ```
   npm install
   ```
8. (Optional, for push) Configure Cloud Messaging / Expo push credentials via `eas build` config once you're ready for a dev/production build — Expo Go does not support FCM remote push on Android.
9. Run it:
   ```
   npx expo start
   ```
10. After your first login in the app, you can call `seedDemoData()` (see `src/services/seedService.js`) from a temporary button or the debugger to populate realistic sample data for your account only.

## Design system

Primary `#10B981`, Expense `#EF4444`, dark bg `#0F172A`, light bg `#F8FAFC` — defined once in `tailwind.config.js` and `src/constants/colors.js` and used everywhere (no hard-coded hexes in screens).

## Notes on scope

This is a real, wired codebase — not a mockup — covering the primary flows end-to-end. Given the size of the original spec (60 sections), a few secondary surfaces (CSV/PDF export, Cloud Functions, phone OTP confirmation, RTL groundwork beyond the i18n structure) are intentionally left as clearly marked extension points rather than filled with placeholder behavior, so you can wire them against your real Firebase project without untangling fake logic first.

## 1. Setup & Environment

- [x] 1.1 Install `@supabase/supabase-js` package
- [x] 1.2 Configure Supabase client helper (`src/lib/supabase.ts`) reading environment variables
- [x] 1.3 Add Supabase table creation SQL / migration script for `user_fasting`

## 2. API Endpoints

- [x] 2.1 Implement `GET /api/user/purpose` to retrieve user fasting purpose and history from Supabase
- [x] 2.2 Implement `POST /api/user/purpose` to upsert user fasting purpose and history to Supabase

## 3. Client State & Auto-Sync Integration

- [x] 3.1 Create user synchronization hook/service (`src/hooks/useUserPurposeSync.ts` or store enhancer) to sync with Supabase on login and store updates
- [x] 3.2 Update `useFastingStore` actions (`saveAndGenerateSchedule`, `rescheduleSchedule`, `interruptFast`, `clearFastingData`) to automatically trigger cloud sync when authenticated
- [x] 3.3 Update `HomePageClient` and `PropositoPage` to guarantee seamless hydration on initial page load

## 4. Verification

- [x] 4.1 Verify build and TypeScript compilation (`npm run build`)
- [x] 4.2 Test saving a purpose on one session, logging out/in, and verify persistence across origins

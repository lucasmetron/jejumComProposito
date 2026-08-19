## Why

Currently, the user's spiritual fasting purpose and schedule are saved only in the browser's `localStorage`. Because `localStorage` is isolated per origin and per device, whenever an authenticated user accesses the application from another device, browser, or environment (e.g. localhost vs production on Vercel), their active purpose does not appear. Sincronizing user purpose data with a cloud database (Supabase) ensures that a user's active fast, schedule, and history are available across all their devices and sessions once logged in.

## What Changes

- Install `@supabase/supabase-js` and configure Supabase client utilities for server-side persistence.
- Create database schema in Supabase with a `user_fasting` table indexed by `user_email`.
- Create server-side API endpoints (`GET /api/user/purpose` and `POST /api/user/purpose`) to load and persist fasting state for authenticated users.
- Update `useFastingStore` and app initialization to automatically hydrate active purpose from Supabase upon login and sync changes made on the client to the cloud.
- Support seamless onboarding: if an unauthenticated user creates a purpose locally in `localStorage` and then signs in with Google, migrate the local purpose to their Supabase cloud account.

## Capabilities

### New Capabilities

- `cloud-purpose-sync`: Remote persistence and automatic synchronization of user spiritual fasting purposes, active sessions, and history across devices using Supabase.

### Modified Capabilities

<!-- None -->

## Impact

- **Dependencies**: Add `@supabase/supabase-js`.
- **Environment variables**: Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **APIs**: New route handlers at `/api/user/purpose`.
- **Client State**: Hydration and sync integration in `useFastingStore` and `HomePageClient` / `PropositoPage`.

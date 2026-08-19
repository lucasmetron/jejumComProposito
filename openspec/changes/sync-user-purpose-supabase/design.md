## Context

The application utilizes NextAuth with Google Provider. Currently, state is persisted in client `localStorage` through Zustand's `persist` middleware. Supabase is configured with project URL `https://hdtqqyxgtmiaohsoeupy.supabase.co`.

## Goals / Non-Goals

**Goals:**

- Provide reliable bidirectional sync between client Zustand state and Supabase database for authenticated users.
- Enable automatic cross-device and cross-origin state synchronization (e.g. localhost, Vercel, mobile web).
- Transparent fallback: maintain offline/anonymous support with `localStorage` when the user is not authenticated.
- Auto-migration on first login: seamlessly promote local offline purpose to cloud DB upon sign-in.

**Non-Goals:**

- Replacing NextAuth session management with Supabase Auth (we will continue using NextAuth Google Provider for auth and Google Calendar tokens, using Supabase purely as the secure data persistence layer).

## Decisions

1. **Table Schema (`user_fasting`)**:
   - `user_email` (TEXT PRIMARY KEY)
   - `config` (JSONB)
   - `events` (JSONB)
   - `has_configured` (BOOLEAN)
   - `history` (JSONB)
   - `updated_at` (TIMESTAMPTZ)
     _Rationale:_ Storing `config`, `events`, and `history` as JSONB provides zero schema friction for the existing TypeScript models and Zustand state representation, allowing fast reads and atomic updates.

2. **Server-Side API Routes (`/api/user/purpose`)**:
   - `GET /api/user/purpose`: Authenticates session with NextAuth `getServerSession(authOptions)` and queries Supabase for the user's purpose.
   - `POST /api/user/purpose`: Validates authenticated session and upserts purpose data into Supabase with updated timestamp.
     _Rationale:_ Using server routes keeps database credentials (like `SUPABASE_SERVICE_ROLE_KEY`) securely on the server and avoids exposing write permissions directly to the public client.

3. **Client-Side Sync Hook / Store Integration**:
   - Create a synchronization lifecycle in an app-level provider or store hook that triggers upon `session` status change.
   - When transitioning from `unauthenticated` to `authenticated`, if the local store already has a configured purpose, sync local -> cloud; otherwise, load cloud -> local.

## Risks / Trade-offs

- **[Network latency on login]** → Optimistic UI: app continues rendering local cache immediately, revalidating and merging from Supabase in the background.
- **[Concurrent edits across 2 devices]** → `updated_at` timestamp comparison ensures the latest modification takes precedence.

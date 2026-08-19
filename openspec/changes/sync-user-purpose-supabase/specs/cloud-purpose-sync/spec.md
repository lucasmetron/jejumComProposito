## Purpose

Provides cloud persistence and automatic cross-device synchronization for spiritual fasting purposes, active schedules, and prayer history linked to authenticated user accounts via Supabase.

## ADDED Requirements

### Requirement: Cloud Purpose Persistence for Authenticated Users

The system SHALL securely persist the user's active fasting configuration, scheduled sessions, and prayer history to Supabase whenever an authenticated user saves, modifies, or manages a purpose.

#### Scenario: User saves purpose while authenticated

- **WHEN** an authenticated user clicks "Salvar Propósito & Gerar Escala"
- **THEN** the system saves the purpose to the Supabase cloud database linked to their authenticated email address and updates the local state.

#### Scenario: User reschedules or interrupts purpose

- **WHEN** an authenticated user reschedules dates or interrupts an active purpose
- **THEN** the system updates the corresponding record in Supabase in real-time.

### Requirement: Automatic Cross-Device Purpose Hydration

The system SHALL check and hydrate the active purpose from Supabase when an authenticated user opens the application on any device, browser, or environment.

#### Scenario: User logs in from a new device or environment

- **WHEN** a user logs in via Google on a new device or localhost where local storage is empty
- **THEN** the system fetches their active purpose and history from Supabase and restores the active fast dashboard.

#### Scenario: Local-to-Cloud Migration on First Login

- **WHEN** an anonymous user configures a purpose locally in the browser and subsequently signs in with Google
- **THEN** the system uploads the existing local purpose to their Supabase account without losing any configured sessions.

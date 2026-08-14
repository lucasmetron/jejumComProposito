## Purpose

Handles multi-channel schedule sharing, including direct Google Calendar synchronization via NextAuth OAuth tokens, client-side PDF document generation with jsPDF, and standard .ICS calendar file downloads.

## Requirements

### Requirement: Google Calendar Synchronization via OAuth
The system SHALL authenticate users using NextAuth.js (Auth.js) with Google Provider requesting the `calendar.events` scope and provide an API endpoint `/api/calendar/sync` to push generated events to the user's primary calendar.

#### Scenario: User authenticates with Google and syncs schedule
- **WHEN** user clicks "Sincronizar com Google Agenda" and is authenticated with Google
- **THEN** the system issues API requests to create each `SpiritualFastEvent` in Google Calendar with proper start/end timestamps and descriptions, returning success confirmation

#### Scenario: User is unauthenticated when attempting sync
- **WHEN** unauthenticated user attempts calendar sync
- **THEN** the system prompts the user to sign in with Google seamlessly

### Requirement: Client-Side PDF Export
The system SHALL provide an isolated utility function `exportToPDF(events: SpiritualFastEvent[], config: FastingConfig)` that creates and triggers a download of an aesthetically formatted devotional PDF summary using jsPDF.

#### Scenario: Downloading schedule as PDF
- **WHEN** user clicks "Baixar em PDF"
- **THEN** the system generates a printable devotional PDF containing the list of fasting dates, hourly windows, purpose titles, and hydration guidelines, and downloads it immediately in the browser

### Requirement: Client-Side ICS Export
The system SHALL provide an isolated utility function `exportToICS(events: SpiritualFastEvent[])` that compiles all scheduled fasting sessions into an iCalendar (.ics) format file and downloads it.

#### Scenario: Downloading schedule as ICS
- **WHEN** user clicks "Exportar para Calendário (.ics)"
- **THEN** the browser downloads a valid `.ics` file containing VEVENT blocks with DTSTART, DTEND, SUMMARY, and DESCRIPTION compatible with Apple Calendar, Outlook, and other standard calendar clients

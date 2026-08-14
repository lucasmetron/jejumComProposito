## Purpose

Delivers a devotional, elegant, responsive Next.js user interface matching 100% of the visual specifications from the `stitch_planejador_de_jejum_espiritual` design system with Google Sans typography, state persistence, and contextual validation.

## Requirements

### Requirement: Devotional Layout and Google Sans Typography
The system SHALL render all user interfaces adhering strictly to the Google Sans font family, color scheme (devotional slate/teal/surface-container), and component layouts established in `stitch_planejador_de_jejum_espiritual`.

#### Scenario: Visual rendering of homepage and configurator
- **WHEN** user loads the application at `/`
- **THEN** the system displays the top navigation bar with brand icon, hero header, configurator card stack, and Google Sans font applied across all headings and copy

#### Scenario: Navigation to About page
- **WHEN** user navigates to `/sobre`
- **THEN** the system displays the devotional explanation of purpose, biblical grounding, healthy guidance, and creator mission matching `sobre_desktop`

### Requirement: Form Validation with Portuguese Contextual Messages
The system SHALL validate user inputs using React Hook Form and Zod schemas, returning contextual Portuguese feedback tailored to spiritual purpose.

#### Scenario: Submitting invalid frequency or no days selected
- **WHEN** user submits the configurator without selecting valid frequency or duration
- **THEN** the system shows clear Portuguese guidance such as "Escolha pelo menos um dia para seu propósito" or "Informe uma meta de horas válida para o propósito"

### Requirement: Persistent State Management
The system SHALL maintain user form configurations and generated schedules using Zustand with the `persist` middleware stored in browser `localStorage`.

#### Scenario: Restoring configuration across reloads
- **WHEN** user configures fasting settings and refreshes the browser page
- **THEN** the stored parameters (hours, days, start time, ramp-up, blocked days) remain loaded in the configurator

### Requirement: Interactive Schedule Preview
The system SHALL render an interactive calendar and list preview displaying the calculated fasting sessions, start/end timestamps, hydration status, and progress metrics.

#### Scenario: Real-time calculation preview
- **WHEN** user changes any configuration parameter in the form
- **THEN** the preview section updates dynamically with the calculated list of fasting sessions and summaries

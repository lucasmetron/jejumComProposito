## MODIFIED Requirements

### Requirement: Devotional Layout and Google Sans Typography
The system SHALL render all user interfaces adhering strictly to the Google Sans font family, devotional color scheme (warm slate/teal/surface-container), and spiritual devotional copywriting (avoiding clinical dietary terminology).

#### Scenario: Visual rendering of homepage and configurator
- **WHEN** user loads the application at `/proposito`
- **THEN** the system displays the top navigation, spiritual headline, devotional purpose builder, and Google Sans font applied across all headings and copy

#### Scenario: Navigation to About page
- **WHEN** user navigates to `/sobre`
- **THEN** the system displays the devotional explanation of purpose, biblical grounding, healthy guidance, and creator mission matching `sobre_desktop`

## ADDED Requirements

### Requirement: Spiritual Purpose and Prayer Motive Priority
The system SHALL place the spiritual title, biblical motivation, and prayer intention as the primary and prominent first step of the purpose creation flow.

#### Scenario: Entering prayer intention and title
- **WHEN** user starts creating a spiritual fast
- **THEN** the user can immediately provide or select a spiritual dedication title (e.g. "Clamor pela Família", "Jejum de Daniel", "Direcionamento & Sabedoria") and prayer request

### Requirement: Biblical Fasting Quick Presets
The system SHALL offer devotional quick presets based on biblical fasting traditions (such as Jejum de Daniel 21 dias, Clamor de Ester 3 dias, Consagração Semanal 7 dias, ou Propósito Livre) that auto-fill duration, rhythm, and hours.

#### Scenario: Selecting a biblical preset
- **WHEN** user clicks on the "Jejum de Daniel" preset
- **THEN** the system automatically pre-configures duration to 21 days, healthy balanced distribution, and pre-populates the purpose title

### Requirement: Spiritual Microcopy and Devotional Terminology
The system SHALL use devotional language throughout all configurator cards, badges, and tooltips, replacing dietary terminology (such as "janela de alimentação") with devotional phrasing (such as "Horas de Abstinência & Oração").

#### Scenario: Viewing daily fasting window
- **WHEN** user views the daily fasting window card
- **THEN** the badge and labels display "Xh de Jejum e Oração" and devotional guidance on caring for the body as the Temple of the Holy Spirit

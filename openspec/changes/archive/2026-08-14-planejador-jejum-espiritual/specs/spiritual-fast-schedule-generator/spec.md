## Purpose

Provides pure deterministic domain calculation and scheduling algorithms for spiritual fasting events, respecting dates, periods, frequencies, target hours, progression ramp-up, blocked days, distribution strategies, and devotional hydration guidance.

## ADDED Requirements

### Requirement: Generate Spiritual Fast Schedule
The system SHALL provide a pure domain function `generateSpiritualFastSchedule(config: FastingConfig)` that returns an array of `SpiritualFastEvent` items with start date, end date, title, isAbsoluteFast flag, and target hours.

#### Scenario: Generate weekly schedule with alternate days
- **WHEN** user requests a 1-week period with frequency of 3 days and "Alternado" distribution
- **THEN** the system generates 3 events spaced by at least 1 rest day between fasts

#### Scenario: Generate monthly schedule with random distribution
- **WHEN** user requests a 1-month period with frequency of 8 days and "Aleatório" distribution
- **THEN** the system generates 8 events distributed across the month with healthy intervals and non-consecutive overloading

### Requirement: Enforce Blocked Days Constraint
The system SHALL NEVER schedule fasting events on days of the week specified in the `blockedDays` list.

#### Scenario: Block specific weekdays
- **WHEN** user marks Sunday (0) and Saturday (6) as blocked days
- **THEN** no generated `SpiritualFastEvent` starts or overlaps into the blocked days

### Requirement: Gradual Ramp-Up Progression
The system SHALL calculate progressive fasting durations when `rampUp` is enabled, beginning with reduced fasting hours and scaling up to the target hours over the course of the schedule.

#### Scenario: Ramp-up enabled for 16h target
- **WHEN** user sets target hours to 16h with rampUp enabled across 4 fasting days
- **THEN** the earlier events have reduced durations (e.g. 10h, 12h, 14h) culminating in 16h on the final event(s)

#### Scenario: Ramp-up disabled
- **WHEN** user disables rampUp
- **THEN** every event in the schedule has the exact target duration requested

### Requirement: Devotional Hydration and Absolute Fast Title Guidance
The system SHALL tailor the event title based on the `isAbsoluteFast` flag to maintain spiritual focus while ensuring safe hydration cues.

#### Scenario: Water-permitted spiritual fast
- **WHEN** `isAbsoluteFast` is false (default)
- **THEN** the generated event title explicitly includes water permission guidance such as "Propósito de Jejum (Permitido Água)"

#### Scenario: Absolute fast (no water)
- **WHEN** `isAbsoluteFast` is true
- **THEN** the generated event title indicates "Propósito de Jejum Absoluto (Sem Água)" with spiritual solemnity

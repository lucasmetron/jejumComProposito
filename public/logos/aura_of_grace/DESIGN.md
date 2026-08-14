---
name: Aura of Grace
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf2'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e5efff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d4e4fa'
  on-surface: '#0d1c2d'
  on-surface-variant: '#414849'
  inverse-surface: '#233143'
  inverse-on-surface: '#e9f1ff'
  outline: '#71787a'
  outline-variant: '#c1c8c9'
  surface-tint: '#41646a'
  primary: '#41646a'
  on-primary: '#ffffff'
  primary-container: '#7da1a8'
  on-primary-container: '#12383e'
  inverse-primary: '#a8cdd4'
  secondary: '#5b5f5e'
  on-secondary: '#ffffff'
  secondary-container: '#dde0de'
  on-secondary-container: '#5f6362'
  tertiary: '#596060'
  on-tertiary: '#ffffff'
  tertiary-container: '#959c9c'
  on-tertiary-container: '#2d3434'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4e9f1'
  primary-fixed-dim: '#a8cdd4'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#284c52'
  secondary-fixed: '#e0e3e1'
  secondary-fixed-dim: '#c4c7c5'
  on-secondary-fixed: '#181c1b'
  on-secondary-fixed-variant: '#434846'
  tertiary-fixed: '#dde4e3'
  tertiary-fixed-dim: '#c1c8c7'
  on-tertiary-fixed: '#161d1d'
  on-tertiary-fixed-variant: '#414848'
  background: '#f8f9ff'
  on-background: '#0d1c2d'
  surface-variant: '#d4e4fa'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '300'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  title-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-padding-mobile: 24px
  container-padding-desktop: 64px
  stack-gap: 16px
  section-gap: 48px
  touch-target-min: 48px
---

## Brand & Style
The design system is rooted in the concepts of **intentionality, quietude, and spiritual focus**. It adopts a **Refined Minimalism** aesthetic that prioritizes the user's internal state over external visual noise. The interface acts as a silent companion during periods of prayer and fasting, utilizing expansive whitespace (or "breathing room") to evoke a sense of peace and reverence.

The emotional response should be one of "digital sanctuary." By stripping away non-essential decorations and relying on precise typography and soft tonal shifts, the UI encourages a contemplative mindset suitable for religious practice.

## Colors
The palette is divided into two distinct atmospheres: **The Morning Mist (Light)** and **The Midnight Vigil (Dark)**.

- **Primary:** A muted Sage Green (#7DA1A8) used sparingly for active states and progress indicators. It represents life and growth within stillness.
- **Light Mode:** Uses a base of pure white (#FFFFFF) with surfaces in soft alabaster (#F9FAFB). Text uses deep charcoal for high legibility without the harshness of pure black.
- **Dark Mode:** Rather than pure black, the background is a deep, atmospheric slate (#0F172A). Surfaces use slightly lighter charcoal tones (#1E293B) to create subtle depth, mimicking a candlelit room.
- **Accents:** Secondary colors are kept to tonal variations of the primary sage to maintain a monochromatic, serene feel.

## Typography
This design system utilizes **Geist** for its mathematical precision and neutral character, ensuring that the sacred texts or fasting timers remain the focal point. 

- **Weight Strategy:** Use Light (300) for large display headers to convey elegance. Regular (400) is reserved for body copy to maximize readability. Medium (500) is used only for functional labels.
- **Tracking:** Increased letter-spacing on small labels (uppercase) provides a modern, cinematic feel.
- **Hierarchy:** Maintain significant vertical margins between headers and body text to prevent visual clutter.

## Layout & Spacing
The layout follows a **Fluid Content Model** with strict safe-area margins. 

- **Grid:** A 12-column grid for desktop, downscaling to a single column for mobile. 
- **The "Breath" Principle:** Vertical spacing between sections should be generous (minimum 48px) to signify a transition in thought or activity (e.g., moving from a timer to a scripture reading).
- **Mobile Comfort:** All interactive elements must adhere to a minimum 48x48px touch area to ensure the app feels effortless to use, even during moments of physical fatigue during a fast.

## Elevation & Depth
In alignment with the minimalist philosophy, this design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Soft Ambient Occlusion**.

- **Surfaces:** Cards and containers use a subtle border (1px) in a slightly darker/lighter tone than the background rather than a shadow.
- **Elevated States:** Only the primary action (e.g., starting a fast) may use a very diffused, low-opacity shadow (Color: Primary, Blur: 20px, Opacity: 10%) to create a soft glow effect.
- **Glassmorphism:** Navigation bars should use a high-blur backdrop filter (30px) with 80% opacity to maintain a sense of layered transparency and airiness.

## Shapes
The shape language is **Soft and Organic**. 

The use of `rounded-lg` (1rem) for cards and `rounded-full` for progress trackers ensures there are no harsh angles that might feel aggressive or corporate. Buttons use a `rounded-md` (0.5rem) setting to maintain a structural feel while remaining approachable. High-frequency elements like checkboxes use the same 0.5rem radius to maintain consistency.

## Components
Components are styled with a focus on "Shadcn-esque" cleanliness—high-quality defaults with intentional modifications:

- **Buttons:** Primary buttons use the Sage Green background with white text. Ghost buttons are preferred for secondary actions to reduce visual weight.
- **Fasting Timer (Large Display):** The central component. Use thin stroke weights for circular progress indicators and large, tracked-out typography for the countdown.
- **Cards:** Bordered with 1px `muted` color. No shadows unless the card is "active" or "hovered." Padding should be at least 24px internally.
- **Input Fields:** Minimalist underlines or subtle 1px borders that highlight on focus using the Primary Sage color. Backgrounds should be slightly offset from the main page background.
- **Scripture Chips:** Small, pill-shaped badges used for tagging themes (e.g., "Patience," "Strength"). These use a low-contrast background (Secondary Color) with dark text.
- **Progress Bars:** Soft, rounded tracks with a subtle glow on the indicator head to symbolize "The Light."
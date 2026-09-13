# 🏛️ MASTER DESIGN SYSTEM SPECIFICATION
### Project Source of Truth: DustBeatz Portfolio Engine
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Senior UI/UX Designer + Design System Architect + Motion Designer + Frontend Architect

---

## 1. EXECUTIVE OVERVIEW & CORE PHILOSOPHY

This document serves as the permanent, immutable architectural specification for the **Pure Blacked-Out Stealth Editorial Design System**. It reverse-engineers every visual token, layout principle, typographic hierarchy, and interaction pattern from the production codebase.

### The Foundational Rules
1. **Pure Black Foundation (`#000000`)**: The website does not use dark gray or navy as its canvas. The primary canvas is absolute `#000000`. Depth is achieved through micro-elevation layers (`#050507`, `#0A0A0D`, `#111116`), ambient radial glows, and ultra-subtle border strokes (`rgba(255, 255, 255, 0.08)` to `0.22`).
2. **Acid-Lime High-Voltage Accent (`#CBFE00`)**: A single, razor-sharp chartreuse accent cuts through the darkness. It is reserved for high-intent conversion moments, status indicators, badges, active accordion rows, and micro-accents.
3. **High-Contrast Readability Rule (Charcoal on Lime)**: When `#CBFE00` is used as an active surface background, text MUST switch to pitch black (`#000000`) and deep readable charcoal (`rgba(0, 0, 0, 0.78)`). White text on lime is strictly prohibited.
4. **Architectural Dual Typography**:
   - **Structure & Power**: `Kanit` (Display & Body, geometric neo-grotesk with bold vertical stems and distinctive angles).
   - **Soul & Humanity**: `Instrument Serif` (Italic, used sparingly for single emotive words like *identity*, *deliver*, *record*).
   - **Technical Precision**: `Space Grotesk` & Monospace (rates, LUFS meters, timestamps, catalog codes).
5. **Intentionally Reduced Button Rounding (`8px`)**: Buttons utilize an architectural `8px` corner radius (`6px` for compact buttons). Generic pill-shaped (`rounded-full`) buttons are strictly avoided for actionable buttons, being reserved solely for metadata tags, category chips, and floating pills.
6. **Full-Width Canvas with Bounded Inner Content**: The page root and body are strictly `width: 100%; max-width: none; background: #000000;`. All readable content is bounded within an inner container capped at `max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14`. Never bound the root page element, as doing so causes catastrophic narrow-column rendering on ultrawide monitors.

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Families & Sources
Typography is imported via Google Fonts with complete weight coverage:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,900&family=Inter:wght@300;400;500;600;700;800;900&family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
```

| Token | Family Name | Fallback Stack | Roles |
| :--- | :--- | :--- | :--- |
| `--font-kanit` | `'Kanit'` | `sans-serif` | Primary display, headings, body copy, button labels, nav links |
| `--font-serif-italic` | `'Instrument Serif'` | `'Georgia', serif` | Emotive word accents (always italic) |
| `--font-space` | `'Space Grotesk'` | `'Courier New', monospace` | Technical specs, timestamps, numbering, LUFS stats, stream metrics |
| `--font-editorial` | `'Aeonik', 'Inter Tight'` | `'Neue Montreal', 'Helvetica Now Display', 'Inter', sans-serif` | Secondary editorial fallback |

---

### 2.2 Complete 8-Level Type Scale

Every typographic level is defined using responsive fluid `clamp()` equations ensuring natural scaling from mobile (375px) up to 4K displays (3840px).

```
Level       Desktop (>=1024px)             Tablet (768px)               Mobile (375-430px)           Font / Weight / Style
-----------------------------------------------------------------------------------------------------------------------------------------
TYPE-01     clamp(4.2rem, 11vw, 10.2rem)   clamp(2.9rem, 12.5vw, 4.4rem) clamp(2.25rem, 10.5vw, 2.95rem) Kanit 900, Line-Height: 0.92, -0.025em
            [Hero Main Title: "producer" — Brushed Chrome Metallic Gradient Lowercase]

TYPE-02     clamp(2.25rem, 4.6vw, 4.25rem) clamp(2.0rem, 4.2vw, 3.2rem)  clamp(1.75rem, 3.8vw, 2.4rem)  Kanit 900, Line-Height: 0.94, -0.025em
            [Monumental Section Titles: "THE SOUND BEHIND THE RECORDS", "WHAT I DELIVER"]

TYPE-03     clamp(1.85rem, 3.6vw, 3.25rem) clamp(1.6rem, 3.2vw, 2.5rem)  clamp(1.35rem, 3.0vw, 1.9rem)  Kanit 900, Line-Height: 1.00, -0.02em
            [Standard Section Headings: "THREE CORE PRINCIPLES", "SELECTED WORK & CREDITS"]

TYPE-04     clamp(1.75rem, 3.4vw, 2.65rem) clamp(1.4rem, 5.5vw, 2.1rem)  1.25rem                       Kanit 700, Line-Height: 1.08, -0.02em
            [Hero Supporting Title: "beats that tell stories."]

TYPE-05     clamp(1.4rem, 2.6vw, 2.35rem)  clamp(1.2rem, 2.2vw, 1.8rem)  1.15rem                       Kanit 700, Line-Height: 1.15, -0.02em
            [Pull-Quote Headings: “More than beats. I build records with identity.”]

TYPE-06     clamp(0.875rem, 1.1vw, 1.025rem) 0.875rem                    0.8125rem                     Kanit 400/Light, Line-Height: 1.6
            [Body Narrative & Editorial Descriptions, Max Width: 38rem (608px)]

TYPE-07     0.8125rem (13px)               0.75rem (12px)               0.72rem (11.5px)             Kanit 700, Line-Height: 1.0, Tracking: 0.08em
            [Action Buttons & Key CTAs: Uppercase, Letter-Spacing: +0.08em]

TYPE-08     0.6875rem – 0.75rem (11–12px)  0.6875rem (11px)             0.625rem (10px)              Kanit 600 / Space Grotesk Mono, Tracking: 0.15–0.25em
            [Eyebrow Tags, Metadata, LUFS Badges, Edition Counters: 01/08, Uppercase]
```

---

### 2.3 Specialized Typographic Recipes

#### 1. Brushed Chrome Metallic Gradient (Hero Headline)
```css
.hero-main-title {
  font-family: var(--font-kanit);
  font-size: clamp(4.2rem, 11vw, 10.2rem);
  font-weight: 900;
  letter-spacing: -0.025em;
  line-height: 0.92;
  background: linear-gradient(180deg, #EDEDF2 0%, #808088 55%, #B5BAC5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-transform: lowercase;
  filter: drop-shadow(0 8px 30px rgba(0, 0, 0, 0.45));
}
```

#### 2. Stealth Titanium Shine Heading
```css
.stealth-heading {
  background: linear-gradient(180deg, #FFFFFF 0%, #E0E4EA 40%, #7A8290 85%, #B0B8C4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

#### 3. Emotive Serif Accent Tag
```css
.serif-accent {
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-weight: 400;
  color: #CBFE00;
  font-size: 1.35em;
  line-height: 0.85;
}
```

#### 4. Monumental Numbering (Principles & Ledgers)
```css
.monumental-number {
  font-family: var(--font-kanit);
  font-weight: 900;
  font-size: clamp(3.75rem, 6vw, 5.5rem);
  line-height: 1;
  color: rgba(255, 255, 255, 0.15);
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}
.group:hover .monumental-number {
  color: #CBFE00;
}
```

---

## 3. COLOR SYSTEM & TOKENS

### 3.1 Primitive Color Tokens
```css
:root {
  /* Absolute Canvas */
  --color-black-pure:        #000000;
  --color-black-secondary:   #050507;
  --color-surface-card:      #0A0A0D;
  --color-surface-hover:     #111116;
  --color-surface-raised:    #0F0F12;
  --color-surface-modal:     #08080B;
  
  /* Acid-Lime Voltage Spectrum */
  --color-accent-lime:       #CBFE00;
  --color-accent-lime-hover: #D6FF1A;
  --color-accent-lime-muted: rgba(203, 254, 0, 0.15);
  --color-accent-lime-glow:  rgba(203, 254, 0, 0.35);
  
  /* Editorial Warm Tone Tokens */
  --color-warm-ivory:        #F4EFE7;
  --color-warm-secondary:    #D7D2CB;
  --color-warm-muted:        #B4AEA7;
  
  /* Monochrome Text Spectrum */
  --color-text-white:        #FFFFFF;
  --color-text-light:        #E8ECF2;
  --color-text-body:         #B8B8B8;
  --color-text-muted:        #8E95A2;
  --color-text-subtle:       #808088;
  --color-text-dim:          #4B5260;
  
  /* Borders & Dividers */
  --color-border-subtle:     rgba(255, 255, 255, 0.08);
  --color-border-medium:     rgba(255, 255, 255, 0.15);
  --color-border-high:       rgba(255, 255, 255, 0.22);
  --color-border-lime:       rgba(203, 254, 0, 0.40);
}
```

### 3.2 Semantic Color Mapping Table

| Semantic Token | Hex / RGBA | Usage in System | Contrast Pair |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#000000` | Global canvas, footer, section bases | On `#FFFFFF` (21:1 AAA) |
| `--bg-secondary` | `#050507` | Elevated section contrasts | On `#E8ECF2` (19.4:1 AAA) |
| `--bg-card` | `#0A0A0D` | Principle cards, media cards, booking form container | On `#B8B8B8` (11.2:1 AAA) |
| `--bg-card-hover` | `#111116` | Card hover state elevation | On `#FFFFFF` (17.5:1 AAA) |
| `--color-accent` | `#CBFE00` | Active service accordion row, primary CTA button, pulsing status | On `#000000` (17.1:1 AAA) |
| `--color-accent-glow` | `rgba(203, 254, 0, 0.35)` | Box-shadow neon drop around buttons & active cards | Ambient Layer |
| `--text-primary` | `#FFFFFF` | Primary headers, card titles, key values | On `#000000` (21:1 AAA) |
| `--text-secondary` | `#B8B8B8` | Body narratives, descriptions, studio environment specs | On `#000000` (11.6:1 AAA) |
| `--text-muted` | `#8E95A2` | Metadata tags, technical specs, section numbers (inactive) | On `#000000` (7.2:1 AAA) |
| `--text-dim` | `#4B5260` | Input field placeholders, subtle secondary watermarks | On `#000000` (3.2:1 AA large) |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | Standard card borders, row dividers, ledger lines | Ambient boundary |
| `--border-active` | `rgba(255, 255, 255, 0.22)` | Hover state borders, input field borders on hover | Interactive feedback |

---

## 4. SPACING SYSTEM & RHYTHM

The spacing rhythm is rooted in an **8pt Base Grid** with a 4pt sub-unit for compact metadata elements.

### 4.1 Spacing Scale Tokens
```css
:root {
  --space-1:   0.25rem;  /* 4px  - Micro badge padding, indicator gaps */
  --space-2:   0.5rem;   /* 8px  - Icon gaps, small button inline padding */
  --space-3:   0.75rem;  /* 12px - Input padding vertical, tag spacing */
  --space-4:   1.0rem;   /* 16px - Card gutter small, mobile screen edge padding */
  --space-5:   1.25rem;  /* 20px - Dock padding, drawer padding */
  --space-6:   1.5rem;   /* 24px - Mobile container gutter, card padding small */
  --space-8:   2.0rem;   /* 32px - Standard card padding, grid gaps */
  --space-10:  2.5rem;   /* 40px - Tablet container gutter, section margin small */
  --space-12:  3.0rem;   /* 48px - Desktop card padding, header height padding */
  --space-14:  3.5rem;   /* 56px - Desktop container gutter (`lg:px-14`) */
  --space-16:  4.0rem;   /* 64px - Section header margin-bottom */
  --space-20:  5.0rem;   /* 80px - Major story block padding */
  --space-24:  6.0rem;   /* 96px - Major desktop section vertical padding */
}
```

### 4.2 Section-Level Vertical Spacing
All content sections below the Hero utilize standardized fluid vertical padding:
```css
/* Standard Section Rhythm */
.site-section-padding {
  padding-top: clamp(3.75rem, 5.5vw, 6.25rem);    /* 60px to 100px */
  padding-bottom: clamp(3.75rem, 5.5vw, 6.25rem); /* 60px to 100px */
}

/* Compact Section Rhythm (Marquee, Transition Strips) */
.site-section-padding-sm {
  padding-top: clamp(2.75rem, 4vw, 4.75rem);      /* 44px to 76px */
  padding-bottom: clamp(2.75rem, 4vw, 4.75rem);   /* 44px to 76px */
}
```

---

## 5. CONTAINER & GRID ARCHITECTURE

### 5.1 The Master Container Rule
```css
/* 1. Global Page Width: 100% Unbounded Canvas */
html, body {
  width: 100%;
  min-width: 0;
  max-width: none;
  margin: 0;
  padding: 0;
  background-color: #000000;
  overflow-x: clip;
}

/* 2. Inner Readable Container: Strictly Bounded at 1440px */
.content-container {
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;  /* 24px Mobile */
  padding-right: 1.5rem;
}

@media (min-width: 640px) {
  .content-container {
    padding-left: 2.5rem;  /* 40px Tablet */
    padding-right: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .content-container {
    padding-left: 3.5rem;  /* 56px Desktop */
    padding-right: 3.5rem;
  }
}
```

### 5.2 Grid Archetypes
1. **12-Column Asymmetric Grid**:
   - Studio Control Room: 8 columns (`lg:col-span-8`).
   - Studio Vocal Booth: 4 columns (`lg:col-span-4`).
   - Studio Stem Architecture: 12 columns (`lg:col-span-12`).
2. **3-Column Monumental Grid**:
   - Production Principles: `grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12`.
3. **Split 50/50 & 60/40 Editorial Layouts**:
   - Sound Narrative: Left 6 columns (`lg:col-span-6`), Right 6 columns (`lg:col-span-6`).
   - Interactive Reveal Story: Left 7 columns (`lg:col-span-7`), Right 5 columns (`lg:col-span-5`).
   - Booking Section: Left 5 columns (`lg:col-span-5`), Right 7 columns (`lg:col-span-7`).

---

## 6. BUTTON SYSTEM SPECIFICATION

> [!IMPORTANT]
> **Intentionally Reduced Button Rounding**: In strict compliance with the verified design system, all actionable buttons utilize `border-radius: 8px` (compact buttons: `6px`). Pill shapes (`rounded-full` / `9999px`) are prohibited for action buttons and permitted only for metadata badges and category chips.

```
Button Variant          Background             Border                       Text Color     Corner Radius   Shadow / Glow State
------------------------------------------------------------------------------------------------------------------------------------------
HERO PRIMARY            #CBFE00                1px solid #CBFE00            #000000        8px             box-shadow: 0 0 20px rgba(203,254,0,0.25)
HERO SECONDARY GHOST    transparent            1px solid rgba(255,255,255,0.35) #FFFFFF    8px             hover: bg-white/10, border-white
STEALTH PRIMARY         #FFFFFF                none                         #000000        8px             box-shadow: 0 0 25px rgba(255,255,255,0.20)
STEALTH GHOST           transparent            1px solid rgba(255,255,255,0.25) #FFFFFF    8px             hover: bg-white/8, border-white
LIME ACTION PILL        #CBFE00                none                         #000000        8px             box-shadow: 0 0 24px rgba(203,254,0,0.25)
SERVICE CTA (INACTIVE)  #CBFE00                1px solid #CBFE00            #000000        8px             hover: scale-105
SERVICE CTA (ACTIVE)    #000000                1px solid #000000            #CBFE00        8px             box-shadow: 0 4px 14px rgba(0,0,0,0.20)
HEADER CTA BADGE        rgba(255,255,255,0.03) 1px solid rgba(255,255,255,0.22) #FFFFFF    9999px (Pill)   hover: border-[#CBFE00], text-[#CBFE00]
```

### Complete Button Code Recipe
```css
/* Primary Action Button */
.btn-lime-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  background-color: #CBFE00;
  color: #000000;
  font-family: var(--font-kanit);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.9rem 2.15rem;
  border-radius: 8px;
  border: 1px solid #CBFE00;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 20px rgba(203, 254, 0, 0.25);
}

.btn-lime-primary:hover {
  background-color: #D6FF1A;
  transform: translateY(-2px);
  box-shadow: 0 0 32px rgba(203, 254, 0, 0.45);
}

.btn-lime-primary:active {
  transform: translateY(0);
}

/* Secondary Ghost Button */
.btn-ghost-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: #FFFFFF;
  font-family: var(--font-kanit);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.9rem 2.15rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-ghost-secondary:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: #FFFFFF;
  transform: translateY(-2px);
}
```

---

## 7. HEADER & NAVIGATION ARCHITECTURE

The header operates under a **Hero-Scoped Dynamic Lifecycle**. It provides maximum focus within the Hero and gracefully retreats upon entering the deeper content sections:

```
Scroll Position          Header Classes Applied            Visual Presentation & Transitions
---------------------------------------------------------------------------------------------------------------------------------
Y = 0 (Hero Top)         .hero-active                      Transparent bg, divider opacity: 1, full interaction, 80-96px height.
Y > 40 (Inside Hero)     .hero-active.scrolled             Dark blur bg `rgba(4,4,6,0.92)`, blur(20px), shadow: 0 10px 35px black.
Leaving Hero             .hero-left                        transform: translateY(-100%), opacity: 0, pointer-events: none.
Below Hero (Page Body)   (no header / persistent dock)     Clean canvas immersion; bottom music dock appears instead.
Re-entering Hero (Top)   .hero-active                      Header slides back down smoothly (350ms cubic-bezier(0.16, 1, 0.3, 1)).
```

### Business Model Adaptation Rule
> [!NOTE]
> E-commerce shopping carts and account login buttons were explicitly removed for this direct-booking producer site. Future websites must configure the right-side header trigger to match the business model:
> - **Producer / Audio**: Direct Session Booking CTA (`BOOK A SESSION ↗`).
> - **Creative Agency / Studio**: Inquiry CTA (`START A PROJECT ↗`).
> - **SaaS**: Demo CTA (`REQUEST DEMO ↗`).
> - **Restaurant**: Reservation CTA (`RESERVE TABLE ↗`).

---

## 8. ELEVATION, SURFACES & SHADOW SPECIFICATIONS

```css
:root {
  /* Subtle Dark Elevation Layers */
  --elevation-base:       #000000;
  --elevation-card:       #0A0A0D;
  --elevation-raised:     #0F0F12;
  --elevation-modal:      #08080B;
  
  /* Precision Drop Shadows */
  --shadow-card:          0 10px 30px rgba(0, 0, 0, 0.60);
  --shadow-card-hover:    0 20px 50px rgba(0, 0, 0, 0.95);
  --shadow-modal:         0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 255, 255, 0.05);
  --shadow-dock:          0 12px 35px rgba(0, 0, 0, 0.95);
  
  /* Neon Voltage Shadows */
  --shadow-neon-sm:       0 0 16px rgba(203, 254, 0, 0.20);
  --shadow-neon-md:       0 0 24px rgba(203, 254, 0, 0.25);
  --shadow-neon-lg:       0 0 35px rgba(203, 254, 0, 0.45);
}
```

---

## 9. ACCESSIBILITY & SEO SYSTEM

### Minimum Standards Checklist
- [x] **Single H1 Tag**: Reserved strictly for the Hero title (`<h1 class="hero-main-title">producer</h1>`).
- [x] **Contrast Compliance**: 
  - Standard white on `#000000` = **21:1 (AAA)**.
  - Charcoal `#000000` / `rgba(0,0,0,0.78)` on `#CBFE00` = **17.1:1 (AAA)**.
  - Secondary text `#B8B8B8` on `#000000` = **11.6:1 (AAA)**.
- [x] **Touch Target Sizing**: Minimum clickable area of `44px x 44px` across all interactive buttons, modal triggers, and drawer links.
- [x] **Focus Ring States**: Interactive elements support visible focus outlines:
  ```css
  :focus-visible {
    outline: 2px solid #CBFE00;
    outline-offset: 3px;
  }
  ```
- [x] **Reduced Motion Support**:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- [x] **Semantic Document Structure**: Full usage of `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<blockquote>`, and `<footer>`.

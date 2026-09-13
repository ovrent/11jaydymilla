# 🧩 MASTER COMPONENT LIBRARY SPECIFICATION
### Production Component Architecture & Implementation Blueprint
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Senior UI/UX Designer + Design System Architect + Frontend Architect

---

## COMPONENT ARCHITECTURE INDEX

| Index | Component Name | Section ID | Role / Archetype | Key Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `Header` | `#main-header` | Hero-Scoped Dynamic Top Bar | Lenis, Scroll Observer |
| **02** | `Hero` | `#hero` | Cinematic Gold-Standard Hero | Google Fonts, Cover Photo |
| **03** | `ScrollMarquee` | `#scroll-marquee-section` | Opposing Scroll-Driven Text Rows | RAF, Scroll Listener |
| **04** | `Studio3DCanvas` | `#animation-showcase` | Protected 180-Frame 3D Scrubber | 180 WebP Frames, Canvas 2D |
| **05** | `AboutStory` | `#sound` | Editorial Narrative & Philosophy | `fade-in-element` |
| **06** | `ImageReveal` | `#producer-reveal-container` | Interactive Dual-Layer Cursor Mask | PointerEvents, TouchEvents |
| **07** | `Principles` | `#principles` | 3-Column Monumental Cards | Hover Transitions |
| **08** | `CreditsPlaque` | `#credits` | 3D Parallax Tilt Card + Ledger | Glare CSS, Counter Observer |
| **09** | `StudioGallery` | `#studio` | Asymmetric 12-Column Media Grid | Object-fit, Vignettes |
| **10** | `ServicesAccordion`| `#services` | Numbered Interactive Pricing Rows | CSS Grid Rows, JS Toggle |
| **11** | `Testimonials` | `#testimonials` | Monumental Pull-Quote Switcher | State Switcher Script |
| **12** | `BookingConversion`| `#booking` | Studio Inquiries & Validation Form | WhatsApp Deep Links |
| **13** | `Footer` | `footer` | Minimalist Watermark & Directory | Pure CSS Grid |
| **14** | `FloatingMusicDock`| `#sticky-bar` | Web Audio Synthesizer & Scrubber | Web Audio API, Canvas 2D |
| **15** | `Modals` | `#contact-modal`, `#license-modal` | High-Conversion Dialog Overlays | Clipboard API, Focus Trap |

---

## 1. COMPONENT 01: `Header`

### Purpose
Minimalist top navigation bar operating under a **Hero-Scoped Dynamic Lifecycle**. It remains transparent at page load, blurs smoothly during hero scroll, completely exits when scrolling deeper into the page to leave the content unobstructed, and smoothly slides back down when re-entering the hero.

### Markup Recipe
```html
<header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hero-active">
  <div class="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 relative">
    <div id="main-header-bar" class="flex items-center justify-between h-20 sm:h-24 transition-all duration-300 relative">
      
      <!-- Brand Logo -->
      <a href="#hero" class="flex items-center group">
        <span class="font-kanit font-black text-xl sm:text-2xl tracking-tight text-white lowercase">
          justbeatz<span class="text-[#CBFE00]">.</span>
        </span>
      </a>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center gap-8 sm:gap-10 font-kanit font-semibold text-sm text-white tracking-[0.06em]">
        <a href="#sound" class="editorial-nav-link py-1">The Sound</a>
        <a href="#services" class="editorial-nav-link py-1">Services</a>
        <a href="#credits" class="editorial-nav-link py-1">About</a>
        <a href="#booking" data-open-contact="true" class="editorial-nav-link py-1">Contact</a>
      </nav>

      <!-- Action & Mobile Hamburger Trigger -->
      <div class="flex items-center gap-3 sm:gap-4">
        <a href="#booking" class="editorial-header-cta group hidden md:inline-flex items-center gap-1.5">
          <span>BOOK A SESSION</span>
          <span class="cta-arrow" aria-hidden="true">↗</span>
        </a>
        <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg text-white hover:text-[#CBFE00] hover:bg-white/10 transition-colors" aria-label="Toggle Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      <!-- Hero Divider (Visible only in hero) -->
      <div id="hero-header-divider" class="hero-header-divider" aria-hidden="true"></div>
    </div>
  </div>
</header>
```

### CSS Specifications
```css
#main-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

#main-header.hero-active {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
  border-bottom-color: rgba(244, 239, 231, 0.08);
}

#main-header.hero-left,
#main-header:not(.hero-active) {
  transform: translateY(-100%) !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

#main-header.scrolled {
  background: rgba(4, 4, 6, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.9);
}

.hero-header-divider {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background-color: rgba(244, 239, 231, 0.1);
  transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 2. COMPONENT 02: `Hero` (The Gold Standard)

> [!IMPORTANT]
> **Protected Visual Gold Standard**: The Hero establishes the supreme quality bar for all future pages. It balances natural human focal photography with dominant lowercase chrome typography, three-dimensional ambient lighting vignettes, and an 8px button conversion layer.

### Visual Architecture Layers
1. **Background Photography Layer**: Natural cover photo (`assets/images/hero_producer.png`) with desktop focal center at `72% 38%` (mobile shifts to `80% 10%`).
2. **Tri-Vignette Atmospheric System**:
   - `hero-vignette-top`: Linear gradient 180deg (black 45% -> transparent 100%, 25% height).
   - `hero-vignette-bottom`: Linear gradient 0deg (pure black 100% -> transparent, 30% height).
   - `hero-vignette-text`: Radial gradient ellipse at 18% 55% ensuring absolute legibility for the headline.
3. **Upper Hero Band**:
   - Left: Eyebrow (`MUSIC FOR A HIGHER VISION—`, Kanit 600, uppercase, tracking 0.15em).
   - Right: Micro-stack (`SOUNDS PEOPLE FEEL`, tracking 0.16em + 28px horizontal line divider).
4. **Center Primary Canvas**:
   - Dominant Lowercase Headline: `<h1 class="hero-main-title">producer</h1>` (Kanit 900, Chrome Gradient).
   - Supporting Headline: `beats that tell stories.` (Kanit 700, white).
   - Body Description: 15-16px, max-width 448px (28rem), `#B8B8B8`.
   - Dual Button CTA: Primary Lime 8px (`EXPLORE THE SOUND →`) + Secondary Ghost 8px (`BOOK A SESSION`).
5. **Bottom Hero Meta Band**:
   - Left: Capabilities (`PRODUCTION · MIXING · MASTERING · RECORDING`).
   - Right: Edition Counter (`01 / 08`, `A BEAT FOR EVERY MOOD`, `EST. 2022`).

---

## 3. COMPONENT 03: `ScrollMarquee`

### Purpose
High-impact visual transition strip creating opposing horizontal parallax motion as the user scrolls.

### Markup Recipe
```html
<section id="scroll-marquee-section" class="py-6 bg-black border-y border-white/10 overflow-hidden relative">
  <div class="flex flex-col gap-3 select-none">
    <!-- Row 1: Right translation -->
    <div id="marquee-row-1" class="scroll-marquee-row whitespace-nowrap flex w-max font-kanit font-black text-xl sm:text-2xl uppercase tracking-widest text-white/20">
      <span class="mx-6 text-[#CBFE00]">★ MULTI-PLATINUM PRODUCTION</span>
      <span class="mx-6">SSL 4000 G MASTER BUS</span>
      <span class="mx-6 text-white/40">NEUMANN U87 AI TUBE</span>
      <span class="mx-6 text-zinc-400">KAOTICKOLLECTIVE</span>
      <span class="mx-6 text-[#CBFE00]">50M+ VERIFIED STREAMS</span>
    </div>
    <!-- Row 2: Left translation -->
    <div id="marquee-row-2" class="scroll-marquee-row whitespace-nowrap flex w-max font-kanit font-black text-xl sm:text-2xl uppercase tracking-widest text-white/20">
      <span class="mx-6 text-white/40">GENELEC 8351B SMART ACTIVE</span>
      <span class="mx-6 text-[#CBFE00]">SURGICAL 808 GLUE</span>
      <span class="mx-6">TONYDAYIMANE 2X PLATINUM</span>
      <span class="mx-6 text-white/40">UNIVERSAL AUDIO APOLLO X8P</span>
    </div>
  </div>
</section>
```

### Motion Math Formula
```javascript
const rect = section.getBoundingClientRect();
const sectionTop = window.scrollY + rect.top;
const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.35;

row1.style.transform = `translateX(${offset - 250}px)`;
row2.style.transform = `translateX(${-(offset - 250)}px)`;
```

---

## 4. COMPONENT 04: `Studio3DCanvas` (Protected 180-Frame Engine)

> [!CAUTION]
> **PROTECTED SYSTEM — DO NOT RECREATE OR ALTER**: The 180-frame scroll-scrubbed canvas engine is locked. It provides cinema-grade, zero-lag 3D interaction synchronized with the user's scrollbar.

### Architectural Rules
1. **Asset Structure**: Exactly 180 WebP frames located in `animasion/frames/` named `frame_000.webp` through `frame_179.webp` (720x720px each).
2. **Viewport & Track**: `height: 400vh` track with a `height: 100vh; position: sticky; top: 0;` viewport.
3. **Canvas Element**: `<canvas id="scroll-canvas" width="720" height="720"></canvas>`.
4. **Rendering Rules**:
   - `mix-blend-mode: screen; filter: contrast(1.3) brightness(0.85);`.
   - Single RAF render loop sampling the latest scroll position without competing interpolation delays.
   - Batch-controlled preloader (concurrency of 6 workers).
   - Nearest-decoded-frame fallback to prevent canvas flashing or blank frames during rapid scrolling.
   - 60ms debounce stop listener to lock in the final decoded frame upon scroll settlement.

---

## 5. COMPONENT 05: `AboutStory`

### Purpose
Editorial narrative section establishing creator authority, philosophy, and studio standards through split monumental typography.

### Markup Structure
```html
<section id="sound" class="site-section-padding bg-[#000000] border-t border-white/10 relative overflow-hidden">
  <div class="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start pb-24 border-b border-white/10 fade-in-element">
      <!-- Left Column -->
      <div class="lg:col-span-6 flex flex-col items-start">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-kanit font-semibold uppercase tracking-[0.2em] text-[#CBFE00] mb-8 select-none">
          <span class="w-1.5 h-1.5 rounded-full bg-[#CBFE00] animate-pulse"></span>
          <span>ABOUT THE PRODUCER</span>
        </div>
        <h2 class="headline-monumental text-white">THE SOUND<br>BEHIND THE<br>RECORDS</h2>
      </div>
      <!-- Right Column -->
      <div class="lg:col-span-6 flex flex-col justify-between h-full pt-2 lg:pt-10 space-y-8">
        <h3 class="headline-quote text-white">
          “More than beats.<br>I build records with <span class="font-serif-italic font-normal text-4xl sm:text-5xl lg:text-6xl text-[#CBFE00]">identity</span>.”
        </h3>
        <p class="font-kanit font-normal text-base sm:text-lg text-[#B8B8B8] leading-relaxed max-w-xl">
          From the first melody to the final master, every record is crafted with intention...
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 6. COMPONENT 06: `ImageReveal` (Interactive Dual-Layer Discovery)

### Purpose
Organic cursor-driven discovery card. A primary editorial image rests on the base layer. Moving the cursor over the card reveals an organic, feathered window into the second raw studio image with cinematic lag.

### Markup Recipe
```html
<div id="producer-reveal-container" class="relative max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-white/15 bg-[#0A0A0D] shadow-2xl group cursor-crosshair select-none">
  <div class="aspect-[4/5] overflow-hidden relative w-full h-full">
    <!-- Base Layer (Image 1) -->
    <img id="producer-img-base" src="assets/images/producer_editorial.png" alt="Editorial Session" class="w-full h-full object-cover object-center filter contrast-105 pointer-events-none select-none">
    
    <!-- Revealed Layer (Image 2) -->
    <div id="producer-reveal-layer" class="absolute inset-0 w-full h-full pointer-events-none select-none" style="opacity: 0;">
      <img id="producer-img-reveal" src="assets/images/producer_real.jpg" alt="Identity Reveal" class="w-full h-full object-cover object-center filter contrast-105 pointer-events-none select-none">
    </div>
  </div>

  <!-- Bottom Metadata Plate -->
  <div class="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between text-xs font-kanit text-white pointer-events-none">
    <div>
      <span class="block font-bold tracking-wide">JUSTBEATZ</span>
      <span class="text-[10px] font-mono text-[#B8B8B8]">CREATIVE DIRECTION & RECORD PRODUCTION</span>
    </div>
    <span class="px-2.5 py-1 rounded-full bg-black/80 border border-[#CBFE00]/40 text-[10px] font-mono font-bold text-[#CBFE00]">IN SESSION</span>
  </div>
</div>
```

### Interactive Logic (Lag & Mask Synthesis)
```javascript
// Lerp interpolation (0.12 factor)
currentX += (targetX - currentX) * 0.12;
currentY += (targetY - currentY) * 0.12;

// Mask Gradient Equation
const rx = baseRadius * 0.88;
const ry = baseRadius * 1.06;
const maskCss = `radial-gradient(ellipse ${rx}px ${ry}px at ${currentX}px ${currentY}px, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.22) 65%, transparent 100%)`;

revealLayer.style.webkitMaskImage = maskCss;
revealLayer.style.maskImage = maskCss;
```

---

## 7. COMPONENT 07: `Principles`

### Purpose
3-Column architectural pillar system framing the business's foundational philosophy.

### Key Visual Attributes
- Surface: `#0A0A0D` background, `1px solid rgba(255, 255, 255, 0.10)`.
- Hover State: Border transitions to `#CBFE00`/40, monumental number turns `#CBFE00`.
- Numbering: Monumental Kanit 900 `text-6xl sm:text-7xl text-white/15`.
- Pillar Tag: Bottom horizontal line with subtle feature chips (`ORIGINAL MELODIES · SCULPTED 808S`).

---

## 8. COMPONENT 08: `CreditsPlaque`

### Purpose
Award-winning portfolio card featuring real-time 3D parallax card tilt, dynamic specular glare tracking, animated stat counters, and an editorial release ledger.

### Parallax Tilt Math
```javascript
const rect = card.getBoundingClientRect();
const centerX = rect.width / 2;
const centerY = rect.height / 2;
const rotateX = ((e.clientY - rect.top - centerY) / centerY) * -7;
const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 7;

card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
```

---

## 9. COMPONENT 09: `StudioGallery`

### Purpose
Cinematic asymmetric 12-column masonry grid showcasing equipment, sanctuary, and physical hardware.

```
+-------------------------------------------------------------+-----------------------------------+
|  Column 1-8 (lg:col-span-8): MAIN CONTROL ROOM              |  Column 9-12 (lg:col-span-4):     |
|  Height: min 360px, max 480px                               |  ISOLATION VOCAL BOOTH            |
|  Image: SSL Console + Genelec Monitoring                   |  Image: Neumann U87 Ai Tube       |
+-------------------------------------------------------------+-----------------------------------+
|  Column 1-12 (lg:col-span-12): FULL-WIDTH 48-TRACK HYBRID STEM ARCHITECTURE                     |
|  Height: min 220px, max 290px; Horizontal gradient backdrop overlay for high legibility        |
+-------------------------------------------------------------------------------------------------+
```

---

## 10. COMPONENT 10: `ServicesAccordion`

> [!IMPORTANT]
> **Signature Contrast System**:
> - **Inactive Row**: `#000000` background, `#8E95A2` numbers, `#FFFFFF` titles, `#A1A1AA` rates/arrows.
> - **Active Row**: `#CBFE00` solid acid-lime background, `#000000` black titles, numbers, rates.
> - **Active Description Text**: High-contrast charcoal `rgba(0, 0, 0, 0.78)` for maximum readability.
> - **Active Arrow**: Rotates -45deg to point upward `↗`.
> - **CTA Button in Active Row**: Swaps to `#000000` background with `#CBFE00` text.

### CSS Accordion Height Transition
```css
.service-accordion-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  opacity: 0;
}

.service-accordion-row.is-active .service-accordion-body {
  grid-template-rows: 1fr;
  opacity: 1;
}

.service-accordion-inner {
  overflow: hidden;
}
```

---

## 11. COMPONENT 11: `Testimonials`

### Purpose
Editorial monumental quote display with instant client tab switching.

### Architecture
- Giant Serif Quote Mark: `text-[#CBFE00] font-serif-italic text-6xl sm:text-8xl`.
- Monumental Pull-Quote Text: Kanit 700, 24px–36px.
- Tab Buttons: Active button takes `#CBFE00` with black text; inactive takes `bg-white/5` with `text-zinc-400`.
- Transition: 150ms opacity crossfade during quote replacement.

---

## 12. COMPONENT 12: `BookingConversion`

### Purpose
High-intent direct conversion block combining immediate inquiry channels (WhatsApp, phone) with a structured 6-input session booking form.

### Form Fields
1. `Artist / Producer Name` (text, required)
2. `Email Address` (email, required)
3. `Phone / WhatsApp Number` (tel, required)
4. `Required Service` (select, options mapped to pricing tiers)
5. `Preferred Session Date` (date, optional)
6. `Reference / Demo Link` (url, optional)
7. `Project Vision & Requirements` (textarea)

### Submission Flow
Submitting the form prevents page reload, formats the input data into a clean WhatsApp deep-link message, and reveals the `#booking-success-modal` with instant confirmation.

---

## 13. COMPONENT 13: `Footer`

### Key Elements
- **Giant Watermark**: `<div class="footer-watermark">JUSTBEATZ</div>` positioned behind columns with `color: rgba(255, 255, 255, 0.02)`.
- **5-Column Grid**: Brand story (2 cols), Navigation (1 col), Connect (1 col), Legal/SAMRO Registration (1 col).
- **Bottom Bar**: Copyright statement and art direction badge.

---

## 14. COMPONENT 14: `FloatingMusicDock`

### Purpose
Persistent audio companion bar floating at the bottom right (`bottom: 1.25rem; right: 1.25rem; z-index: 90`). Contains a real-time Web Audio synthesizer player (Trap, Drill, Afrobeat engines), play/pause button, time scrubber canvas, and instant licensing triggers.

---

## 15. COMPONENT 15: `Modals`

1. **`#contact-modal`**:
   - Quick Email Copy Box with 1-click clipboard feedback (`COPIED TO CLIPBOARD!`).
   - WhatsApp direct chat link.
   - Anchor button to scroll to full booking form.
2. **`#license-modal`**:
   - 4-Tier Beat Licensing Grid (`MP3 Lease` $35, `WAV Lease` $75, `Trackout Stems` $175 [Featured], `Exclusive Rights` $950).
   - Automated WhatsApp invoice link generation with selected tier and track name.

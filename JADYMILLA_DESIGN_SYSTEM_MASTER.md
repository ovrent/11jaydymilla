# ⚡ JAYDYMILLA MASTER DESIGN SYSTEM & SKILL BLUEPRINT
### Official Specification for the Pure Black Stealth Editorial + 3D Motion Architecture
**Command Trigger:** `/jadymilla` or `/jaydymilla`  
**Architecture:** Senior UI/UX Designer + Creative Technologist + Frontend Architect  
**Version:** 2.0.0 Production Master  

---

## 1. EXECUTIVE SUMMARY & DESIGN PHILOSOPHY

This document serves as the immutable architectural blueprint for the **JayDyMilla Digital Platform**. Whenever the user executes the `/jadymilla` or `/jaydymilla` command, this specification guides the end-to-end generation, styling, and interactive behavior of the website to ensure 100% aesthetic and functional parity.

### 5 Unbreakable Commandments
1. **Pure Black Foundation (`#000000`)**: The canvas is never dark gray, navy, or charcoal. It is absolute pitch black (`#000000`). Elevation and depth are achieved through micro-elevation surfaces (`#050507`, `#0A0A0D`, `#111116`), radial gradients, and hairline borders (`rgba(255, 255, 255, 0.08)`).
2. **Acid-Lime High-Voltage Accent (`#CBFE00`)**: Used exclusively for high-intent conversion moments, status indicators, audio playing states, and primary CTAs.
3. **High-Contrast Readability Rule (Charcoal/Black on Lime)**: Any text placed on a `#CBFE00` background MUST be pitch black (`#000000`) or deep charcoal (`rgba(0, 0, 0, 0.85)`). White text on `#CBFE00` is strictly forbidden.
4. **Architectural Dual Typography**:
   - `Kanit` (Display & Body, geometric neo-grotesk with bold angles, weights 300 to 900).
   - `Instrument Serif` (Italic, used strictly for single emotive soul words inside headlines).
   - `Space Grotesk` (Technical precision, timestamps, coordinates, catalog numbers, LUFS stats).
5. **Intentionally Reduced Button Rounding (`8px`)**: All actionable buttons use `border-radius: 8px` (`6px` for compact buttons). Generic pill buttons (`rounded-full`) are strictly forbidden for action buttons and reserved solely for category chips, metadata tags, and live status dots.

---

## 2. DESIGN TOKENS & PALETTE

```css
:root {
  /* Surface Layers */
  --bg-primary: #000000;          /* 100% Pure Black Canvas */
  --bg-secondary: #050507;        /* Subtle Elevated Section Canvas */
  --bg-card: #0A0A0D;             /* Stealth Card Surface */
  --bg-card-hover: #111116;       /* Card Hover State Elevation */
  --bg-surface-raised: #0F0F12;   /* Dropdown & Modal Surfaces */
  --bg-glass: rgba(10, 10, 13, 0.88);

  /* Signature Accent Colors */
  --color-neon: #CBFE00;          /* High-Voltage Chartreuse */
  --color-neon-hover: #D6FF1A;
  --color-neon-glow: rgba(203, 254, 0, 0.35);
  --color-magenta: #FF007F;       /* Mystic Portal Accent */
  --color-cyan: #00E5FF;          /* Electric Blue Accent */
  --color-amber: #FFB300;         /* Warm Amber Accent */

  /* Hairline Strokes & Borders */
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(255, 255, 255, 0.22);
  --border-neon: rgba(203, 254, 0, 0.40);

  /* Typography */
  --font-kanit: 'Kanit', sans-serif;
  --font-serif-italic: 'Instrument Serif', Georgia, serif;
  --font-space: 'Space Grotesk', monospace;

  /* Strict Border Radius */
  --radius-btn: 8px;
  --radius-btn-compact: 6px;
  --radius-card: 16px;
  --radius-large: 24px;
}
```

---

## 3. MASTER COMPONENT BLUEPRINTS

### Component 01: Top Navigation Header (Hero-Scoped Dynamic)
- **Role**: Minimalist top navigation bar operating under a hero-scoped lifecycle.
- **Behavior**: Remains transparent with subtle backdrop acrylic blur when inside the hero. Smoothly hides (`transform: translateY(-100%)`) when scrolling deeper into content so reading is unobstructed. Slides smoothly back down when returning to the hero.
- **HTML Pattern**:
```html
<header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hero-active">
  <div class="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
    <div class="flex items-center justify-between h-20 sm:h-24">
      <a href="#hero" class="font-kanit font-black text-2xl text-white lowercase">
        brandname<span class="text-[#CBFE00]">.</span>
      </a>
      <nav class="hidden lg:flex items-center gap-8 font-kanit font-semibold text-xs tracking-[0.08em] uppercase">
        <a href="#experience" class="text-white/80 hover:text-white transition-colors">Experience</a>
        <a href="#story" class="text-white/80 hover:text-white transition-colors">Story</a>
        <a href="#releases" class="text-white/80 hover:text-white transition-colors">Releases</a>
        <a href="#booking" class="text-[#CBFE00] hover:text-[#D6FF1A] transition-colors">Booking ↗</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#booking" class="btn-lime hidden sm:inline-flex">STREAM ON SPOTIFY ↗</a>
        <button id="mobile-menu-btn" class="lg:hidden p-2 text-white" aria-label="Open Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </div>
</header>
```

### Component 02: Cinematic Hero with Tri-Vignette & Brushed Chrome Title
- **HTML Pattern**:
```html
<section id="hero" class="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-24 pb-16">
  <!-- Looping Background Video -->
  <div class="absolute inset-0 z-0">
    <video class="w-full h-full object-cover" autoplay muted loop playsinline preload="auto">
      <source src="vides/animo-sphere-wall-720p.mp4" type="video/mp4">
    </video>
  </div>

  <!-- Tri-Vignette Gradients -->
  <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/50 to-transparent z-10 pointer-events-none"></div>
  <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
  <div class="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 z-10 pointer-events-none"></div>

  <!-- Hero Content -->
  <div class="relative z-20 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14">
    <div class="max-w-4xl">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md mb-6">
        <span class="w-2 h-2 rounded-full bg-[#CBFE00] animate-pulse"></span>
        <span class="font-space text-xs text-white/80 tracking-widest uppercase font-semibold">
          LOCATION 📍 • 5-STRING BANJO • CONSCIOUS ROOTS
        </span>
      </div>

      <h1 class="hero-main-title mb-4">
        jaydymilla
      </h1>

      <p class="font-kanit font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight mb-8 max-w-2xl">
        Appalachian banjo meets modern pulse. <span class="font-serif italic font-normal text-white">Transformative</span> songs of raw truth and electric soul.
      </p>

      <div class="flex flex-wrap items-center gap-4 mb-10">
        <a href="#spotify" class="btn-lime">LISTEN ON SPOTIFY ↗</a>
        <a href="#catalog" class="btn-glass">EXPLORE CATALOG ↓</a>
      </div>

      <!-- Authority Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 font-space">
        <div>
          <div class="text-[#CBFE00] font-bold text-xl">8 RELEASES</div>
          <div class="text-white/50 text-[11px] uppercase tracking-wider">Verified 2026 Catalog</div>
        </div>
        <div>
          <div class="text-[#CBFE00] font-bold text-xl">720K+ VIEWS</div>
          <div class="text-white/50 text-[11px] uppercase tracking-wider">Global Dance Reels</div>
        </div>
        <div>
          <div class="text-white font-bold text-xl">JAH KNEE DEE</div>
          <div class="text-white/50 text-[11px] uppercase tracking-wider">Producer Alliance</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Component 03: Scroll-Driven Opposing Dual Marquee
- **Behavior**: Top row moves left, bottom row moves right. Dynamic scroll delta increases velocity during page travel.
```html
<section id="scroll-marquee-section" class="py-10 bg-black overflow-hidden select-none border-y border-white/10">
  <div id="marquee-row-1" class="flex whitespace-nowrap gap-8 text-2xl sm:text-3xl font-kanit font-black tracking-tight uppercase text-white/80 mb-3">
    <div class="flex items-center gap-8">
      <span>5-STRING BANJO</span><span class="w-2 h-2 rounded-full bg-[#CBFE00]"></span>
      <span>ASHEVILLE SOUNDSCAPES</span><span class="w-2 h-2 rounded-full bg-[#CBFE00]"></span>
      <span>SOUL CREATURE</span><span class="w-2 h-2 rounded-full bg-[#CBFE00]"></span>
      <span>MODERN BEATS</span><span class="w-2 h-2 rounded-full bg-[#CBFE00]"></span>
      <span>BY THE WINDOW</span><span class="w-2 h-2 rounded-full bg-[#CBFE00]"></span>
    </div>
  </div>
  <div id="marquee-row-2" class="flex whitespace-nowrap gap-8 text-2xl sm:text-3xl font-kanit font-black tracking-tight uppercase text-white/30">
    <div class="flex items-center gap-8">
      <span>SYNCHRONIZATION LICENSING</span><span class="w-2 h-2 rounded-full bg-white/20"></span>
      <span>JAH KNEE DEE PRODUCTIONS</span><span class="w-2 h-2 rounded-full bg-white/20"></span>
      <span>720K+ VIRAL DANCE VIEWS</span><span class="w-2 h-2 rounded-full bg-white/20"></span>
      <span>NEON LIMELIGHT</span><span class="w-2 h-2 rounded-full bg-white/20"></span>
    </div>
  </div>
</section>
```

### Component 04: Hardware-Accelerated 3D Video Scrubbing Stage
- **Behavior**: Pinned `100vh` sticky stage inside `220vh` container. Video timeline linked to scroll progress.
```html
<section id="cinematic-motion" class="relative h-[220vh] bg-black">
  <div class="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
    <div class="absolute top-12 z-20 text-center px-4">
      <div class="font-space text-xs text-[#CBFE00] uppercase tracking-widest font-bold mb-2">01 / CINEMATIC MOTION</div>
      <h2 class="text-3xl sm:text-5xl font-kanit font-black uppercase text-white">THE VISUAL FREQUENCY</h2>
      <p class="font-kanit text-white/60 text-sm mt-2">Where ancient vibration manifests in <span class="font-serif italic text-white">spatial modern rhythm</span>.</p>
    </div>

    <div class="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
      <video id="cylinder-video-element" class="w-full h-full object-cover" muted playsinline preload="auto">
        <source src="vides/animo-showcase-stream-1280p.mp4" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
    </div>
  </div>
</section>
```

### Component 05: Interactive Audio Catalog & Web Audio Player
- Tracks can be previewed directly from cards using inline play buttons with `data-track-id`.
- Audio player tracks: `by_the_window`, `if_you_miss_me`, `lost_it`, `neon_limelight`, `soul_creature`.

### Component 06: Telemetry Tracking & Real-Time Intelligence
- Automatic ingestion of visitor IP, geolocation (country, city), device, and button click interactions via `navigator.sendBeacon('/api/track')`.
- Unified Master Admin Dashboard at `/admin` displaying real IP addresses, visitor map, and CTR analytics.

---

## 4. HOW TO EXECUTE `/jadymilla`

Whenever this command is triggered:
1. **Load all Google Fonts** (`Kanit`, `Instrument Serif`, `Space Grotesk`) and Tailwind CSS with custom palette.
2. **Apply Pure Black Palette** (`#000000` base, `#CBFE00` acid lime accents, `#0A0A0D` cards).
3. **Format All Action Buttons** with strict `border-radius: 8px` and black text on `#CBFE00`.
4. **Initialize Lenis Smooth Scroll** with custom RequestAnimationFrame loop.
5. **Attach Telemetry Click Listeners** to track user engagement.

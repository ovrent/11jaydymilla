# 🛠️ MASTER BUILD & IMPLEMENTATION GUIDE
### Step-by-Step Engineering Manual for Assembling High-End Client Websites
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Senior Frontend Architect + Technical Director

---

## 1. TECHNICAL STACK ARCHITECTURE

This design system is technology-agnostic and can be deployed in two standardized architectures:

### Architecture A: High-Performance Vanilla Core (Default & Current Production)
- **Structure**: HTML5 Semantic Markup + Custom Design System CSS (`style.css`) + Tailwind CSS Utility Engine + Modular JS (`app.js`).
- **Smooth Scroll**: Lenis 1.1.9 (Global Instance).
- **Performance**: Zero build-step requirement, instant static edge CDN caching, 100/100 Lighthouse performance potential.

### Architecture B: Vite + React / TypeScript / Next.js Framework
- **Bundler**: Vite or Next.js App Router.
- **Styling**: Tailwind CSS v3.4+ configured with `design-tokens.json` + CSS Modules for specialized shaders and canvas animations.
- **Scroll**: `@studio-freight/lenis` or `lenis/react`.

---

## 2. STANDARD PROJECT DIRECTORY LAYOUT

```
new-client-project/
├── index.html                     # Semantic production page structure
├── style.css                      # Design system tokens, clamp typography, component CSS
├── app.js                         # Lenis, 3D Canvas, Dual-Reveal, Accordion & Form engine
├── design-tokens.json             # Machine-readable token dictionary
│
├── animasion/
│   ├── animo-showcase-stream-720p.mp4
│   └── frames/                    # Exactly 180 WebP frames (frame_000.webp to frame_179.webp)
│
├── assets/
│   └── images/
│       ├── hero_producer.png      # Primary focal hero photograph (transparent or dark bg)
│       ├── producer_editorial.png # Dual-reveal base layer
│       ├── producer_real.jpg      # Dual-reveal discovered layer
│       └── plaques.jpg            # Award feature background
│
├── photes/                        # Studio gallery & high-resolution environment imagery
│   ├── control_room.jpg
│   ├── vocal_booth.jpg
│   └── stem_architecture.jpg
│
└── audio/                         # (Optional) Preview MP3s or Web Audio synth configs
```

---

## 3. ASSET LOADING & SCRIPT EXECUTION ORDER

To guarantee zero flash of unstyled content (FOUC), zero layout shift (CLS), and butter-smooth animation initialization, follow this strict loading sequence in `index.html`:

```html
<!DOCTYPE html>
<html lang="en" class="bg-[#000000]">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Client Name | Business Tagline</title>
  
  <!-- 1. PRELOAD CRITICAL ASSETS (Top 3 Image Assets + Frame 0) -->
  <link rel="preload" as="image" href="assets/images/producer_editorial.png">
  <link rel="preload" as="image" href="assets/images/producer_real.jpg">
  <link rel="preload" as="image" href="animasion/frames/frame_000.webp" type="image/webp">

  <!-- 2. GOOGLE FONTS (Preconnect + Exact Weight Coverage) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter+Tight:ital,wght@0,400;0,600;0,800;1,400;1,700&family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">

  <!-- 3. TAILWIND CSS CDN + EXTENDED THEME CONFIG -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            darkBg: '#000000',
            darkSurface: '#050507',
            darkCard: '#0A0A0D',
            darkCardHover: '#0F0F12',
            neon: '#CBFE00',
            'accent-lime': '#CBFE00'
          },
          fontFamily: {
            kanit: ['Kanit', 'sans-serif'],
            serifItalic: ['Instrument Serif', 'Georgia', 'serif'],
            space: ['Space Grotesk', 'monospace']
          }
        }
      }
    }
  </script>

  <!-- 4. LENIS SMOOTH SCROLL ENGINE -->
  <script src="https://unpkg.com/lenis@1.1.9/dist/lenis.min.js"></script>

  <!-- 5. MASTER DESIGN SYSTEM STYLESHEET -->
  <link rel="stylesheet" href="style.css">
</head>

<body class="bg-[#000000] text-[#E2E8F0] font-kanit antialiased relative">
  <!-- Interactive Canvas & Page Elements -->
  
  <!-- 6. MASTER ENGINE SCRIPT (Executed at closing body) -->
  <script src="app.js"></script>
</body>
</html>
```

---

## 4. CRITICAL PERFORMANCE GUARDRAILS

1. **Hardware Acceleration Guardrail**:
   Always apply `will-change: transform` or `transform: translate3d(0,0,0)` to elements scrubbed during scroll (Marquee, Canvas wrapper, Sticky Stack).
2. **Event Listener Optimization**:
   All scroll and resize listeners must be registered with `{ passive: true }`:
   ```javascript
   window.addEventListener('scroll', handleScroll, { passive: true });
   ```
3. **Canvas Clear & Redraw Hygiene**:
   Avoid allocating new variables or objects inside the `requestAnimationFrame` render tick. Reuse global cached instances to prevent garbage collection pauses.
4. **Debounced Settling**:
   Always pair continuous scroll events with a debounce timer (`60ms`) to lock in the final state upon scroll halt.

---

## 5. QUALITY ASSURANCE & PRE-LAUNCH CHECKLIST

Before deploying any client website built with this system, complete this verification protocol:

- [ ] **Canvas Boundary Check**: Verify that `html` and `body` are `width: 100%; max-width: none; background: #000000;`. Ensure readable content is contained within `max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14`.
- [ ] **Ultrawide & 4K Verification**: Test the site at 1920px, 2560px, and 3440px. Confirm that the background spans edge-to-edge without creating a narrow central column.
- [ ] **Mobile Touch Test**: Test on 375px and 390px viewports. Verify that the mobile drawer opens smoothly, navigation links are clickable, and all buttons have a minimum height of 44px.
- [ ] **Contrast Verification**: Inspect all `#CBFE00` backgrounds (active accordion row, primary buttons). Ensure text is pitch black (`#000000`) or deep charcoal (`rgba(0, 0, 0, 0.78)`). Verify zero white text on lime.
- [ ] **3D Canvas Sync**: Scroll through the 3D animation track. Verify zero flickering, zero blank frames, and immediate frame 0 rendering on page load.
- [ ] **Dual-Reveal Interaction**: Move the cursor across `#producer-reveal-container`. Confirm that the feathered mask follows smoothly with a subtle 0.12 lag. On mobile, confirm that touching the container does not block vertical page scrolling.
- [ ] **Booking Form Deep Link**: Fill out the booking form and submit. Verify that the success modal displays and generates the correct pre-filled WhatsApp link.

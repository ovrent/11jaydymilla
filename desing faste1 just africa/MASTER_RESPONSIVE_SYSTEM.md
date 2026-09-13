# 📱 MASTER RESPONSIVE SYSTEM SPECIFICATION
### Cross-Device Adaptive Architecture, Fluid Typography & Breakpoint Rules
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Responsive Design Specialist + Mobile UI/UX Architect

---

## 1. THE FOUNDATIONAL ARCHITECTURAL LESSON

> [!CRITICAL]
> **FULL-WIDTH CANVAS + BOUNDED INNER CONTAINER**:
> During implementation and testing on wide screens, an essential architectural rule was verified:
> 
> ```
> ❌ NEVER DO THIS:
> html, body {
>   max-width: 1440px; /* CATASTROPHIC: Crushes the entire website into a narrow box on 4K/Ultrawide screens */
>   margin: 0 auto;
> }
> 
> ✅ ALWAYS DO THIS:
> html, body {
>   width: 100%;
>   min-width: 0;
>   max-width: none;
>   background-color: #000000;
>   overflow-x: clip; /* Eliminates horizontal scrollbar leaks without breaking position: sticky */
> }
> 
> .inner-content-container {
>   width: 100%;
>   max-width: 1440px;
>   margin-left: auto;
>   margin-right: auto;
>   padding-left: clamp(1.5rem, 3.5vw, 3.5rem);
>   padding-right: clamp(1.5rem, 3.5vw, 3.5rem);
> }
> ```
> This guarantees the immersive black studio canvas bleeds edge-to-edge on 1920px, 2560px, 3440px (ultrawide), and 3840px (4K) monitors, while readable typography and cards remain harmoniously bounded within the 1440px center boundary.

---

## 2. BREAKPOINT BEHAVIOR MATRIX (13 SCREEN SIZES)

```
Screen Width (px)   Device Category              Gutter / Padding    Layout & Typographic State
-------------------------------------------------------------------------------------------------------------------------------------------------
375px               iPhone SE / Mini             px-6 (24px)         1-col stack; Hero title: clamp 2.25rem; Hamburger nav; Full-width dock.
390px               iPhone 14/15/16 Pro          px-6 (24px)         1-col stack; Hero title: 2.5rem; Mobile slide-out drawer active.
430px               iPhone Pro Max / Plus        px-6 (24px)         1-col stack; Hero title: 2.85rem; Touch targets 48px.
768px               iPad Mini / Tablet Portrait  sm:px-10 (40px)     Principles 3-col active; Hero title: clamp 3.6rem; Split header visible.
820px               iPad Air Portrait            sm:px-10 (40px)     Principles 3-col active; Hero 56% width column; 3D canvas scales to 640px.
1024px              iPad Pro / Small Laptop      lg:px-14 (56px)     Desktop navigation reveals; Asymmetric 12-col grid active; Header CTA visible.
1280px              Standard Laptop (MacBook 13) lg:px-14 (56px)     Full editorial layout; Hero title: clamp 5.8rem; Dual reveal cursor active.
1440px              Desktop Master Baseline      lg:px-14 (56px)     Maximum container width reached (1440px); Spacing reaches 100% scale.
1600px              Large Desktop                Auto centered       Canvas expands to 100% full width; Inner content remains locked at 1440px.
1920px              Full HD 1080p Monitor        Auto centered       Full-bleed black background; Zero horizontal clipping; 3D canvas sticky 100vh.
2560px              QHD / 2K Studio Display      Auto centered       Outer ambient glows expand; Typography capped at max clamp values.
3440px              Ultrawide Curved Monitor     Auto centered       Content stays perfectly centered; Background seamlessly black edge-to-edge.
3840px              4K UHD Television / Monitor  Auto centered       Zero layout distortion; Typography scales crisply with SVG/WebP assets.
```

---

## 3. HERO RESPONSIVE COMPOSITION

The Hero section adapts its background image positioning and text column width across breakpoints to ensure the human subject is never obscured by the headline text:

```css
/* Background Image Focal Re-centering */
.hero-bg-photo {
  background-position: 72% 38%; /* Desktop standard */
}

@media (max-width: 1200px) {
  .hero-bg-photo {
    background-position: 72% 35%;
  }
}

@media (max-width: 1024px) {
  .hero-bg-photo {
    background-position: 70% 30%;
  }
  .hero-main-title {
    font-size: clamp(3.6rem, 12vw, 7rem);
  }
}

@media (max-width: 768px) {
  .hero-bg-photo {
    background-position: 68% 22%;
  }
  .hero-main-title {
    font-size: clamp(2.9rem, 12.5vw, 4.4rem);
    line-height: 0.88;
    margin-bottom: 0.45rem;
  }
  .hero-supporting-title {
    font-size: clamp(1.4rem, 5.5vw, 2.1rem);
  }
  .hero-btn-primary,
  .hero-btn-secondary {
    padding: 0.75rem 1.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .hero-bg-photo {
    background-position: 80% 10%; /* Repositions subject away from mobile bottom */
  }
  .hero-vignette-text {
    background: radial-gradient(ellipse at 8% 62%, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.35) 60%, transparent 85%);
  }
  .hero-main-title {
    font-size: clamp(2.25rem, 10.5vw, 2.95rem);
    line-height: 0.92;
    margin-bottom: 0.4rem;
  }
  .hero-supporting-title {
    font-size: 1.25rem;
    line-height: 1.15;
  }
  .hero-description {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  .hero-btn-primary,
  .hero-btn-secondary {
    padding: 0.7rem 1.35rem;
    font-size: 0.72rem;
  }
}
```

---

## 4. MOBILE DRAWER NAVIGATION (`desktop-to-mobile`)

On screens below 768px (`md`), desktop navigation links are replaced by an accessible slide-out mobile drawer:

### Drawer Specifications
- **Width**: `82%` of viewport width, capped at `380px`.
- **Background**: `rgba(8, 8, 10, 0.98)` with `backdrop-filter: blur(28px)`.
- **Border**: Left border `1px solid rgba(255, 255, 255, 0.1)`.
- **Z-Index**: `z-index: 110` (Drawer), `z-index: 105` (Backdrop).
- **Body Lock**: When open, `document.body.style.overflow = 'hidden'` prevents background scrolling.

```css
.mobile-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 82%;
  max-width: 380px;
  background: rgba(8, 8, 10, 0.98);
  backdrop-filter: blur(28px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 110;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 1.75rem;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.9);
}

.mobile-drawer.is-open {
  transform: translateX(0);
}

.mobile-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 105;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.mobile-drawer-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}
```

---

## 5. GRID COLLAPSE & STACKING ARCHITECTURE

```
Component             Desktop (>=1024px)              Tablet (768px - 1023px)         Mobile (<768px)
-----------------------------------------------------------------------------------------------------------------------------
Studio Gallery        12-Col Grid (8 col / 4 col / 12 col) 12-Col Grid (8 col / 4 col / 12 col) 1-Col Stack (full width each)
Principles            3-Column Horizontal Grid         3-Column Horizontal Grid        1-Column Vertical Stack
About Section         Split 6-Col / 6-Col Grid         Split 6-Col / 6-Col Grid        1-Column Vertical Stack
Credits Plaque        Split 5-Col (Image) / 7-Col (Data) 1-Col Stack (Centered Image)   1-Column Vertical Stack
Booking Form          Split 5-Col (Info) / 7-Col (Form) Split 5-Col / 7-Col Grid       1-Column Stack (Form inputs full width)
Services Accordion    Horizontal Flex (Title + Rate + Arrow) Horizontal Flex          Vertical Flex wrap on narrow screens
Footer Columns        5 Columns (2 / 1 / 1 / 1)        2 Columns                       1 Column (Centered / Left aligned)
```

---

## 6. PERSISTENT MUSIC DOCK RESPONSIVE BEHAVIOR

```css
/* Desktop: Floating Compact Bar in Bottom-Right Corner */
.persistent-music-dock {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 90;
  border-radius: 1.25rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Mobile: Full-Width Bottom Floating Bar */
@media (max-width: 640px) {
  .persistent-music-dock {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    justify-content: space-between;
    padding: 0.65rem 1rem;
  }
}
```

---

## 7. TOUCH TARGET ACCESSIBILITY AUDIT

In adherence to the `spacing-audit` and `desktop-to-mobile` skills, every interactive touch element meets or exceeds Apple HIG and Android Material guidelines:

- **Primary & Secondary Buttons**: Height `44px` on mobile, `52px` on desktop.
- **Accordion Clickable Rows**: Padding `py-6` ensuring a massive `80px–110px` touch hit area.
- **Drawer Links**: Padding `py-3` with full-width clickable rows.
- **Input Fields**: Height `48px` with `0.9rem 1.25rem` padding.
- **Close & Hamburger Icons**: Minimum tap target `40px x 40px` with `p-2` surrounding padding.

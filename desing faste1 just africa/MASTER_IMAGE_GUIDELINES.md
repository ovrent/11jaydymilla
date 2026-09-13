# 📷 MASTER IMAGE & ART DIRECTION GUIDELINES
### Photographic Architecture, Image Categories, Overlays & Visual Authenticity
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Senior Art Director + Production Retoucher + Frontend Asset Architect

---

## 1. ART DIRECTION PHILOSOPHY: LOW-KEY CINEMATIC STEALTH

The visual aesthetic of this design system is rooted in **Low-Key Studio Cinematography**. Images are not bright stock photography; they are dark, saturated, authentic captures of creative sanctuary, analog hardware, and human focus.

### The 3 Core Visual Tenets
1. **True Black Shadow Falloff**: Backgrounds in photography must blend smoothly into `#000000`. Shadows are not lifted to gray; they fall off into absolute black, creating seamless integration with the website's canvas.
2. **Atmospheric Rim & Gel Lighting**: Subjects are illuminated by practical rim lighting, analog console indicator LEDs, and subtle colored gels (e.g., cinematic cobalt blue, deep magenta, warm tungsten, or acid-lime).
3. **Physical Authenticity**: Real human effort, authentic rackmount gear (SSL, Neve, Neumann, Genelec), and genuine physical awards anchor client trust. Faked or generic visuals destroy authority.

---

## 2. IMAGE CATEGORIES & TECHNICAL SPECIFICATIONS

```
Category            Aspect Ratio    Object-Fit     Object-Position      Radius        Overlay Recipe                              Loading Strategy
--------------------------------------------------------------------------------------------------------------------------------------------------
HERO COVER          Full Bleed      cover          Desktop: 72% 38%     0 (Full-bleed) Tri-Vignette (Top 25%, Bottom 30%, Text Radial) <link rel="preload">
                                                   Mobile: 80% 10%
DUAL-LAYER BASE     4:5 Portrait    cover          center center        16px (rounded-2xl) Bottom-to-top gradient (black 90% -> trans) <link rel="preload">
DUAL-LAYER REVEAL   4:5 Portrait    cover          center center        16px (rounded-2xl) Feathered organic dynamic cursor mask      <link rel="preload">
3D CANVAS FRAMES    1:1 Square      contain        center center        0             mix-blend-mode: screen; contrast(1.3)        Preloaded batch (6)
CREDITS PLAQUE      4:3 / 16:10     cover          45% 40%              16px (rounded-2xl) Bottom vignette (black 85% -> transparent) Eager loading
STUDIO MAIN (8-COL) 16:9 Landscape  cover          center 55%           24px (rounded-3xl) Bottom vignette (black 95% via 30% -> trans) Lazy loading
STUDIO BOOTH (4-COL) 4:5 Portrait   cover          center 35%           24px (rounded-3xl) Bottom vignette (black 95% via 30% -> trans) Lazy loading
STEM BANNER (12-COL) 21:9 Ultra-wide cover         center 60%           24px (rounded-3xl) Left-to-right horizontal text gradient     Lazy loading
```

---

## 3. DETAILED IMAGE CATEGORY BLUEPRINTS

### 3.1 Hero Cover Image
- **Role**: Primary focal anchor for the entire page. Must establish tone, mood, and creator credibility instantly.
- **Composition**: The subject should occupy the right 40–50% of the desktop frame, leaving the left 50–60% dark and clear for the dominant headline typography.
- **Vignette Architecture**:
  ```css
  /* 1. Top Bar Protection */
  .hero-vignette-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 25%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%);
  }
  /* 2. Bottom Transition */
  .hero-vignette-bottom {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 30%;
    background: linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0.65) 30%, transparent 100%);
  }
  /* 3. Text Legibility Halo */
  .hero-vignette-text {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 18% 55%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 75%);
  }
  ```

---

### 3.2 Dual-Layer Interactive Reveal (Portrait)
- **Role**: Discovered interactive moment that pairs a stylized editorial portrait with a raw, unposed studio photograph.
- **Image 1 (Base Layer)**: Highly styled, color-graded, editorial portrait.
- **Image 2 (Reveal Layer)**: Candid in-session shot (adjusting dials, on the microphone, listening at monitors).
- **Rule**: Both images must be cropped to the exact same aspect ratio (`4:5`) with aligned head/eye levels to make the cursor-driven discovery organic and magical.

---

### 3.3 Studio Environment Gallery (Asymmetric 12-Column Grid)
- **Card 1 (Control Room, 8 Cols)**: Wide angle shot showing dual monitors, mixing console, and studio rack gear. Warm amber/blue console LED glow.
- **Card 2 (Isolation Booth, 4 Cols)**: Vertical macro shot of high-end microphone (Neumann, Telefunken, Shure) with acoustic foam/slat wood background.
- **Card 3 (Stem Architecture, 12 Cols)**: Full-width multitrack banner. Features a dual linear gradient:
  ```css
  /* Vertical mobile falloff + Horizontal desktop text scrim */
  background: linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent);
  @media (min-width: 768px) {
    background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 60%, transparent 100%);
  }
  ```

---

## 4. WHEN TO USE REAL PHOTOS VS GENERATED ART

> [!IMPORTANT]
> **Strict Authenticity Directives**: Brand trust on high-end creative websites is extremely sensitive to visual credibility.

### When to Use Authentic Real Photography
1. **Creator & Team Portraits**: Human faces must be authentic. Never use AI-generated portraits for real creators or team members.
2. **Physical Gear & Workspace**: Authentic studio monitors, mixing consoles, patch bays, and instruments prove the client operates at an elite professional level.
3. **Awards, Plaques & Certificates**: Platinum/Gold plaques, industry certifications, and signed contracts must be authentic.
4. **Client Collaboration Photos**: Candid shots of artists in the live room establish genuine industry relationships.

### When to Use 3D / Cinematic Generated Visuals
1. **Abstract Spatial Scrubbers**: 3D turntable objects, spinning hardware monoliths, floating consoles, or acoustic physics simulations.
2. **Background Textures & Geometry**: Dark topographical contour lines, sub-bass waveform particle fields, ambient smoke/haze layers.
3. **Metaphorical Concepts**: Visual representations of sound waves, architectural acoustics, or futuristic technology.

### When AI-Generated Visuals Are Strictly Prohibited
- ❌ **Fake "Happy Studio People"**: Plastic skin, distorted fingers, incoherent knobs on audio mixers.
- ❌ **Fictional Hardware Consoles**: Nonsensical sliders or impossible equipment layouts that audio professionals immediately recognize as fake.
- ❌ **Generic Corporate Stock Imagery**: People pointing at laptops, handshakes in glass offices, or staged smiles.

---

## 5. OPTIMIZATION & ASSET FORMAT STANDARDS

1. **Format Hierarchy**:
   - **3D Frames / Turntables**: `WebP` (Quality 80–85, zero alpha or clean alpha).
   - **Photographic Backgrounds**: `WebP` or high-efficiency Progressive `JPG`.
   - **Logos & Badges**: Clean inline `SVG` or vector-based data URLs.
2. **Preload Directives**:
   Always place `<link rel="preload">` in the `<head>` for the top 3 critical assets:
   ```html
   <link rel="preload" as="image" href="assets/images/producer_editorial.png">
   <link rel="preload" as="image" href="assets/images/producer_real.jpg">
   <link rel="preload" as="image" href="animasion/frames/frame_000.webp" type="image/webp">
   ```
3. **Async Decoding**:
   All non-critical images must include `loading="lazy"` and `decoding="async"`.

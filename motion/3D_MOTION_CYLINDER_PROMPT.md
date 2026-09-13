# 3D CYLINDER MOTION SHOWCASE — COMPLETE ARCHITECTURE & AI AGENT PROMPT

> **Use Case**: This document explains the exact physics, 3D math, video scrubbing pipeline, and black-level blending used in the **Selected Motion 3D Ring Cylinder Showcase**. It also includes a copy-paste Master Prompt ready to feed into any AI coding assistant for other projects.

---

## 1. Core Architecture Overview (How It Works)

The component consists of **4 distinct layers**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Scroll Track (Height: 250vh)                             │
│    └─ 2. Sticky Frame (Pinned: sticky top-0, height: 100vh) │
│         ├─ 3. Ambient Glow (Radial accent behind cylinder)  │
│         ├─ 4. Typography Header (Stationary, Z-index: 20)   │
│         └─ 5. Visual Stage (Perspective 3D, Z-index: 10)    │
│              └─ Video/Mesh Scrubber (Driven by Scroll)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Deep Dive: Physics & Mechanics

### A. The Scroll-Scrubbing Principle
- **Track Height**: `250vh` (Desktop) / `200vh` (Mobile).
- **Sticky Frame**: `position: sticky; top: 0; height: 100vh;`.
- **Progress Normalization**:
  $$\text{Progress} = \frac{\text{ScrollY} - \text{SectionTop}}{\text{SectionHeight} - \text{ViewportHeight}}$$
  Clamped strictly between `0.0` and `1.0`.

### B. Critically Damped Spring-Mass Physics Model
Instead of simple linear interpolation (`lerp`), a **Critically Damped Harmonic Oscillator** ($\zeta = 1.0, \omega = 22.0$) is used inside `requestAnimationFrame`. This guarantees:
- **Instantaneous reaction** to sudden wheel or touch flicks.
- **Zero overshoot** (the video never vibrates back and forth).
- **Physical inertia & deceleration** when the user stops scrolling.

```javascript
// Master RAF Physics Loop (dt = delta time in seconds)
const omega = 22.0;
const f = 1.0 + 2.0 * dt * omega;
const oo = omega * omega;
const hoo = dt * oo;
const hhoo = dt * hoo;
const detInv = 1.0 / (f + hhoo);
const detDiff = targetProgress - currentProgress;

currentProgress = (f * currentProgress + dt * currentVelocity + hhoo * targetProgress) * detInv;
currentVelocity = (currentVelocity + hoo * detDiff) * detInv;
```

### C. Zero-Race Video Seek Engine (Anti-Lag / Anti-Freeze)
Standard `<video>` scrubbing causes browser freezes if `currentTime` is updated on every single frame while the decoder is busy.
- **Rule 1**: If $\Delta \text{time} < 0.016\text{s}$ (~1 frame at 60fps), skip the seek.
- **Rule 2**: If the browser is currently seeking (`isSeeking === true`), save the latest timestamp in `pendingSeekTime`.
- **Rule 3**: On the `seeked` event, immediately fire `pendingSeekTime`. Stale frames are discarded; newest state always wins.

---

## 3. Pure Black Background Seamless Blending (SVG Filter)

### The Problem
MP4/H.264 video compression transforms deep pitch black (`#000000`) into dark murky gray (`#080808` or `#0e0e0e`). On an OLED / `#000000` website, a visible gray bounding box appears.

### The Solution: SVG Black-Level Hardware Filter
An SVG linear component transfer filter is applied via CSS:

```html
<!-- Inline SVG Filter -->
<svg class="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
  <filter id="video-black-level" color-interpolation-filters="sRGB">
    <feComponentTransfer>
      <feFuncR type="linear" slope="1.09" intercept="-0.082"/>
      <feFuncG type="linear" slope="1.09" intercept="-0.082"/>
      <feFuncB type="linear" slope="1.09" intercept="-0.082"/>
    </feComponentTransfer>
  </filter>
</svg>
```

```css
.motion-ring-video {
  filter: url(#video-black-level);
  /* Truncates gray floor: (Color * 1.09) - 0.082 */
  /* Anything under 0.082 becomes absolute #000000 */
}
```

---

## 4. Lighting & Visual Staging

1. **Ambient Glow**:
   - Position: Centered behind the cylinder (`top: 55%; left: 50%; transform: translate(-50%, -50%)`).
   - Gradient: `radial-gradient(ellipse at center, rgba(203, 254, 0, 0.045) 0%, rgba(203, 254, 0, 0.01) 40%, transparent 70%)`.
   - Result: Gives volumetric depth without overpowering the dark aesthetic.

2. **3D Perspective Stage**:
   - Container has `perspective: 1200px` and `overflow-x: clip; overflow-y: visible;`.
   - Scale multiplier: `transform: scale(1.06)` for grand visual impact.

---

## 5. Alternative: Three.js Real-time 3D Cylinder Math

If building procedural cards (interactive DOM/Canvas) instead of a pre-rendered video:

- **Radius**: $R \approx 450\text{px} - 650\text{px}$.
- **Card Count**: $N = 10 \text{ to } 14$.
- **Card Placement on Cylinder**:
  $$\text{angle}_i = i \times \left(\frac{2\pi}{N}\right) + \text{rotationY}$$
  $$X_i = R \cdot \sin(\text{angle}_i)$$
  $$Z_i = R \cdot \cos(\text{angle}_i) - R$$
  $$\text{RotationY}_i = \text{angle}_i + \pi$$
- **Curvature / Cylinder Bend**: Each card is bent along the cylinder arc using a curved plane geometry or vertex shader.

---

## 6. Ready-To-Use Master Prompt for AI Agents

> **Copy and paste everything inside the box below to any AI Assistant for your new project:**

```markdown
Please build a high-performance 3D Rotating Cylinder Showcase component with scroll-driven scrubbing and smooth physical inertia, following these exact technical specifications:

### 1. Structure & Layout
- Track Container: `position: relative; width: 100%; height: 250vh; background: #000000;`.
- Sticky Viewport Frame: `position: sticky; top: 0; left: 0; width: 100%; height: 100vh; display: flex; flex-direction: column; overflow: visible;`.
- Stationary Header Layer: Fixed at top inside the sticky frame with `z-index: 20` containing section number, title, and subtitle.
- 3D Visual Stage: Flex-1 container with `perspective: 1200px; transform-style: preserve-3d; display: flex; align-items: center; justify-content: center;`.
- Ambient Glow: Centered radial glow behind the cylinder (`rgba(primary_color, 0.05)` fading to transparent) to create volumetric stage depth.

### 2. Physics & Motion Control
- Scroll Tracking: Map the user's scroll across the 250vh track to a normalized progress value `0.0 -> 1.0`.
- Spring Inertia Model: Implement a critically damped spring model inside `requestAnimationFrame` with `omega = 22.0` and `zeta = 1.0`. The motion must feel heavy, physical, instant on user input, and settle gracefully with zero overshoot or oscillation.
- Reduced Motion: Check `window.matchMedia('(prefers-reduced-motion: reduce)')` to disable inertia and snap directly to position.

### 3. Video Scrubbing & Performance (If using Video Cylinder)
- Zero-Race Seek Queue: Implement an asynchronous video seek queue.
  - Skip seeking if change is under 16ms (`Math.abs(currentTime - targetTime) < 0.016`).
  - If a seek is active (`video.seeking === true`), store target in `pendingSeekTime` and trigger it in the `seeked` callback.
  - Video must be strictly paused (`video.pause()`) and never autoplay.
- True Black Integration: Standard MP4 video compression turns `#000000` backgrounds into dark gray `#080808`. Apply an inline SVG filter with `<feFuncR/G/B type="linear" slope="1.09" intercept="-0.082"/>` to crush the near-black background noise down to 100% pure `#000000` so it blends seamlessly with the page.

### 4. Interactive Polish
- Responsive scaling: Scale cylinder down cleanly on mobile screens (`max-height: min(54vh, 460px)`).
- Ensure no scrollbar popping or horizontal overflows (`overflow-x: clip;`).
- Clean separation between typography and the 3D rotating canvas/video.
```

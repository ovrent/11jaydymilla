# ⚡ MASTER MOTION SYSTEM SPECIFICATION
### Motion Choreography, Easing Curves, Physics & Animation Blueprints
**Version**: 1.0.0 (Production Master Blueprint)  
**Standard**: Motion Designer + Frontend Performance Architect

---

## 1. MOTION DESIGN PHILOSOPHY

The motion language of this design system is characterized by **Cinematic Inertia, Zero-Jitter Precision, and Subconscious Feedback**. Motion is never used for decoration; every animation provides spatial orientation, visual hierarchy, or tangible physical weight.

### The 4 Motion Commandments
1. **Never Compete With Native Scroll**: Do not run dual lerp loops. Lenis handles the master scroll inertia. Secondary systems (such as the 3D canvas scrubber) sample the freshest position directly on `requestAnimationFrame` without adding an artificial second lag layer.
2. **Deterministic Settling**: Any continuous scroll animation (marquee, canvas, sticky stack) must cleanly settle onto an exact locked-in frame or position when scrolling stops.
3. **Organic Cursor Lag (`0.12` Lerp)**: Pointer-driven discovery features (like the dual-layer image reveal) use gentle organic smoothing (lerp factor `0.12`) to feel like discovering an underlying photograph with a soft physical lamp.
4. **Hardware Acceleration Guardrails**: All animated properties are restricted to `transform`, `opacity`, and CSS `mask-image`. Animating `width`, `height`, `margin`, or `top/left` directly during scroll is strictly forbidden.

---

## 2. REUSABLE MOTION TOKENS

```css
:root {
  /* Duration Tokens */
  --motion-instant:  100ms;  /* Micro-clicks, active depression states */
  --motion-fast:     200ms;  /* Hover state color swaps, arrow nudges */
  --motion-base:     300ms;  /* Standard UI transitions, modal backdrops */
  --motion-smooth:   500ms;  /* Card tilt returns, drawer slide-outs */
  --motion-slow:     700ms;  /* Hero image zoom on load, image reveals */
  --motion-monument: 1200ms; /* Lenis scroll duration, master page flow */
  --motion-counter:  1400ms; /* Animated number counter ease-out */

  /* Easing Curves */
  --ease-editorial:  cubic-bezier(0.16, 1, 0.3, 1); /* Master Editorial Spring */
  --ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);  /* Natural bilateral ease */
  --ease-out-glare:  cubic-bezier(0.2, 0.8, 0.2, 1); /* Parallax tilt dampener */
  --ease-accordion:  cubic-bezier(0.16, 1, 0.3, 1); /* 0fr to 1fr grid ease */
}
```

---

## 3. LENIS SMOOTH SCROLL INTEGRATION

The master inertia scrolling engine is powered by Lenis, providing luxurious, butter-smooth wheel response while maintaining native touch swipe on mobile devices.

### Engine Configuration
```javascript
let lenisInstance = null;

function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,                                    // 1.2s smooth momentum
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      smoothWheel: true,                                // Desktop mousewheel smoothing
      smoothTouch: false                                // Preserves 100% native mobile touch response
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Intercept anchor clicks for smooth scrolling with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
```

---

## 4. SCROLL-DRIVEN OPPOSING MARQUEE

Translates two opposing text strips horizontally as the user scrolls through the page.

### Architectural Formula
```javascript
function initScrollMarquee() {
  const section = document.getElementById('scroll-marquee-section');
  const row1 = document.getElementById('marquee-row-1');
  const row2 = document.getElementById('marquee-row-2');
  if (!section || !row1 || !row2) return;

  let ticking = false;

  function updateMarquee() {
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    
    // Calculate scroll offset relative to section entrance
    const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.35;

    // Row 1 moves Right, Row 2 moves Left
    row1.style.transform = `translateX(${offset - 250}px)`;
    row2.style.transform = `translateX(${-(offset - 250)}px)`;

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateMarquee);
      ticking = true;
    }
  }, { passive: true });

  updateMarquee();
}
```

---

## 5. 3D PARALLAX TILT WITH SPECULAR GLARE

Applied to milestone cards (e.g., `#plaque-tilt-card`) to create physical depth and metallic light reflections.

### Mathematical Recipe
```javascript
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    const glare = card.querySelector('.tilt-glare');

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 7-degree maximum tilt range
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.setProperty('--glare-x', `${glareX}%`);
        glare.style.setProperty('--glare-y', `${glareY}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}
```

---

## 6. ANIMATED NUMBER COUNTERS

Stat numbers animate from zero to their target value using cubic deceleration upon entering the viewport.

### Implementation
```javascript
function initCounterStats() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-counter'), 10);
        const suffix = target.getAttribute('data-suffix') || '';
        const duration = 1400; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Cubic ease-out: 1 - (1 - t)^3
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeOut * targetVal);

          target.textContent = `${currentVal}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            target.textContent = `${targetVal}${suffix}`;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}
```

---

## 7. STICKY-STACKING CARD SCALING

As cards scroll down the viewport, already stacked cards subtly scale down and deepen their shadows:

```javascript
function initStickyStackingCards() {
  const cards = document.querySelectorAll('.sticky-card-item');
  if (!cards.length) return;

  const totalCards = cards.length;

  function handleStackScroll() {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const stickyThreshold = 80 + index * 24;
      const targetScale = 1 - (totalCards - 1 - index) * 0.025; // 0.95 -> 0.975 -> 1.0

      if (rect.top <= stickyThreshold + 6) {
        card.style.transform = `scale(${targetScale})`;
        card.style.boxShadow = `0 ${20 + index * 10}px 50px rgba(0, 0, 0, 0.95)`;
      } else {
        card.style.transform = 'scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
      }
    });
  }

  window.addEventListener('scroll', handleStackScroll, { passive: true });
}
```

---

## 8. INTERACTIVE DUAL-LAYER IMAGE REVEAL (ORGANIC CURSOR MASK)

Uses a 5-point decaying organic trail with a 0.12 lerp lag to reveal the second layer beneath the cursor.

### Render Loop Equation
```javascript
const render = () => {
  // Cinematic lag interpolation (lerp factor 0.12)
  currentX += (targetX - currentX) * 0.12;
  currentY += (targetY - currentY) * 0.12;

  // Smooth opacity transition
  const opacitySpeed = isHovered || touchActive ? 0.08 : 0.04;
  currentOpacity += (targetOpacity - currentOpacity) * opacitySpeed;

  if (currentOpacity < 0.005) {
    currentOpacity = 0;
    revealLayer.style.opacity = '0';
    trail.length = 0;
  } else {
    revealLayer.style.opacity = currentOpacity.toFixed(3);

    const baseRadius = Math.max(70, Math.min(105, rect.width * 0.20));
    const rx = baseRadius * 0.88;
    const ry = baseRadius * 1.06;

    // Decay trailing points
    for (let i = trail.length - 1; i >= 0; i--) {
      trail[i].alpha -= 0.016;
      if (trail[i].alpha <= 0.02) trail.splice(i, 1);
    }

    const masks = [];
    masks.push(
      `radial-gradient(ellipse ${rx.toFixed(1)}px ${ry.toFixed(1)}px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.72) 30%, rgba(0,0,0,0.22) 65%, transparent 100%)`
    );

    const maskCss = masks.join(', ');
    revealLayer.style.webkitMaskImage = maskCss;
    revealLayer.style.maskImage = maskCss;
  }

  requestAnimationFrame(render);
};
```

---

## 9. PROTECTED 180-FRAME 3D CANVAS SCRUBBING ARCHITECTURE

```
+---------------------------------------------------------------------------------------------------+
|  1. Window Scroll Event (Passive)                                                                 |
|     --> Schedules a single RAF tick: requestAnimationFrame(renderTick)                             |
|     --> Starts debounce settlement timer: setTimeout(settleFinalFrame, 60ms)                      |
+---------------------------------------------------------------------------------------------------+
                                               |
                                               v
+---------------------------------------------------------------------------------------------------+
|  2. Single RAF Render Tick                                                                        |
|     --> Samples freshest getScrollProgress() = -rect.top / (offsetHeight - innerHeight)           |
|     --> Maps progress directly to targetFrame = Math.round(progress * 179)                        |
|     --> Queries findNearestDecodedFrame(targetFrame) to avoid any blank frame flashing            |
|     --> Renders via ctx.drawImage(img, 0, 0, 720, 720) in < 1ms                                   |
+---------------------------------------------------------------------------------------------------+
                                               |
                                               v
+---------------------------------------------------------------------------------------------------+
|  3. 60ms Scroll Settlement                                                                        |
|     --> Fires when user stops scrolling. Locks in the exact target frame to guarantee precision.  |
+---------------------------------------------------------------------------------------------------+
```

---

## 10. CSS ACCORDION EXPANSION (0FR TO 1FR GRID)

Eliminates the legacy `max-height` CSS hack by utilizing modern CSS Grid animation:

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

## 11. ACCESSIBILITY: REDUCED MOTION SPECIFICATION

When a user has requested reduced motion in their operating system, all continuous animations (marquee, 3D canvas autoplay, card tilt) are deactivated or converted into static states:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .scroll-marquee-row {
    transform: none !important;
  }

  .tilt-card {
    transform: none !important;
  }
}
```

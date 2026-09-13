# 🤖 MASTER PROMPT: BUILDING A NEW CLIENT WEBSITE
### Production Directive for AI Coding Agents & Frontend Engineers
**Version**: 1.0.0 (Production Master Prompt)  
**Standard**: Senior Design System Architect + Engineering Lead

---

## HOW TO USE THIS PROMPT
When commissioning another AI coding agent (or human developer) to build a new website for a client, supply them with this exact prompt alongside the client's raw content and assets.

```markdown
========================================================================================
START OF MASTER PROMPT FOR NEW CLIENT WEBSITE
========================================================================================

You are tasked with building an ultra-premium, production-grade website for a new client.

CRITICAL INSTRUCTION:
USE THE ESTABLISHED MASTER DESIGN SYSTEM AS YOUR IMMUTABLE VISUAL FOUNDATION.
DO NOT INVENT A NEW DESIGN LANGUAGE.
DO NOT BRING IN RANDOM GOOGLE FONTS.
DO NOT CREATE PILL-SHAPED ACTION BUTTONS.
DO NOT BOUND THE BODY OR ROOT TO 1440PX.
DO NOT RE-INVENT SPACING, SHADOWS, OR MOTION TOKENS.

Your mission is to replace ONLY client-specific content, brand identity, and visual assets, while strictly preserving:
1. The Typographic Hierarchy (Kanit display/body + Instrument Serif italic accents + Space Grotesk metadata).
2. The 8pt Spacing Rhythm and fluid `site-section-padding`.
3. The Full-Width Page Canvas (`width: 100%; max-width: none; background: #000000; overflow-x: clip;`) with an inner bounded container (`max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14`).
4. The Button Language (`border-radius: 8px` on all action buttons; 6px on compact buttons; NO pill action buttons).
5. The Card Language (`#0A0A0D` background, `1px solid rgba(255, 255, 255, 0.08)` border, 16px–24px radius).
6. The Motion Language (Lenis 1.2s smooth scroll, 0.12 lerp on cursor mask, single RAF render tick, zero competing lerp loops).
7. The Responsive Architecture across all 13 breakpoints (375px to 3840px).
8. The High-Contrast Readability Rule: Text on `#CBFE00` (or active accent) MUST be pitch black (`#000000`) or deep charcoal (`rgba(0,0,0,0.78)`). Never white text on lime.

Follow this 5-Step Execution Workflow strictly:

----------------------------------------------------------------------------------------
STEP 1: INSPECT THE MASTER DESIGN SYSTEM
----------------------------------------------------------------------------------------
Review these core specification files before writing any code:
- `MASTER_DESIGN_SYSTEM.md` (Typography, colors, buttons, spacing, contrast rules)
- `MASTER_COMPONENT_LIBRARY.md` (Markup, classes, and interactions for all 15 components)
- `MASTER_MOTION_SYSTEM.md` (Lenis, marquee, parallax tilt, counter stats, reveal mask)
- `MASTER_RESPONSIVE_SYSTEM.md` (Breakpoints, clamp equations, mobile drawer)
- `MASTER_IMAGE_GUIDELINES.md` (Image categories, vignettes, aspect ratios)
- `design-tokens.json` (Machine-readable token dictionary)

----------------------------------------------------------------------------------------
STEP 2: INSPECT CLIENT CONTENT & ASSETS
----------------------------------------------------------------------------------------
Analyze the client's materials:
- Client Brand Name, Tagline, Location, Established Year.
- Focal Photography: Hero subject, portrait photography, workspace/gallery photos.
- Services & Capabilities: Tier names, descriptions, pricing/rates, deliverables.
- Proof & Authority: Awards, milestones, streaming metrics, client quotes.
- Conversion Channels: WhatsApp number, booking form fields, email endpoints.

----------------------------------------------------------------------------------------
STEP 3: MAP CLIENT CONTENT TO EXISTING COMPONENTS
----------------------------------------------------------------------------------------
Map the client's information directly to the established 15 components:
- `Header`: Client logo + client nav links + direct business CTA (`BOOK A SESSION ↗` / `START A PROJECT ↗`).
- `Hero`: Client photo + lowercase chrome headline + supporting title + primary/secondary 8px buttons.
- `Marquee`: 2 opposing rows of client-specific credentials, hardware, or achievements.
- `3D Canvas Scrubber`: Client 3D product/sanctuary turntable (or preserved 180-frame studio canvas).
- `AboutStory`: Client authority statement + italic serif accent + 3 foundational pillars.
- `ImageReveal`: Dual-layer organic cursor mask (Client editorial photo -> Client raw working photo).
- `Principles`: 3-column cards with monumental numbers (`01`, `02`, `03`).
- `Credits / Milestone Plaque`: 3D parallax tilt award card + 4 animated number counters + release ledger.
- `StudioGallery`: Asymmetric 12-col masonry grid (8-col main, 4-col detail, 12-col full-width banner).
- `ServicesAccordion`: Numbered rows (01-04) with `#CBFE00` active background and black text.
- `Testimonials`: Giant serif quote mark + monumental pull-quote + client switcher tabs.
- `BookingConversion`: Direct conversion section with 6-field form and automated deep link.
- `Footer`: Giant background watermark + 5-column directory + copyright/legal.
- `FloatingMusicDock`: Persistent audio/action dock (configured for audio, portfolio preview, or quick contact).
- `Modals`: One-click contact copy modal & licensing/pricing modal.

----------------------------------------------------------------------------------------
STEP 4: ASSEMBLE & CODE
----------------------------------------------------------------------------------------
- Assemble `index.html`, `style.css`, and `app.js` using the exact code patterns from `MASTER_COMPONENT_LIBRARY.md`.
- Include `<link rel="preload">` in `<head>` for the top 3 image assets.
- Ensure Lenis is initialized and anchored links are smoothly intercepted with a `-70px` header offset.
- Verify that the header hides when scrolling out of the Hero and returns when scrolling back into the Hero.

----------------------------------------------------------------------------------------
STEP 5: RUN COMPREHENSIVE RESPONSIVE & CONTRAST QA
----------------------------------------------------------------------------------------
Verify every item on this checklist before presenting your work:
1. [ ] Desktop (1440px / 1920px): Background bleeds edge-to-edge; content is centered at max 1440px.
2. [ ] Ultrawide (2560px / 3440px / 3840px): Site does NOT collapse into a left-pinned column.
3. [ ] Mobile (375px / 390px): Mobile drawer opens smoothly; touch targets are >= 44px; hero text scales fluidly.
4. [ ] Contrast Audit: All active accordion rows and lime buttons have pitch black or deep charcoal text.
5. [ ] 3D Canvas / Reveal Sync: Zero flicker; nearest decoded frame fallback functions; organic mask follows pointer.

========================================================================================
END OF MASTER PROMPT
========================================================================================
```

# JayDyMilla — Official Artist Digital Platform

A high-performance, editorial digital platform for **JayDyMilla** (Dr. Jay Miller) — Asheville, North Carolina songwriter and 5-string banjo artist fusing Appalachian folk roots, shamanic power songs, and modern rhythmic production.

---

## Architectural Highlights

- **Unified Single-RAF Motion Engine**: Coordinated 60 FPS animation loop managing all dynamic behaviors (smooth scrolling, physics damping, cursor tracking, and ticker marquees) without competing loops.
- **Scroll-Driven 3D Video Scrubber**: Video playback scrubbed to viewport scroll progress via a critically damped harmonic oscillator (`zeta = 1.0, omega = 22.0`) with a zero-race seek queue.
- **Dual-Layer Interactive Image Reveal**: Fine-pointer circular reveal mask with subtle lag damping on desktop, and a dedicated mobile/tablet touch engine utilizing hold-to-explore gesture detection (`PointerCapture`) that leaves native vertical scrolling uninhibited.
- **Persistent Audio Dock & Release Catalog**: Client-side audio player with play/pause toggles, timeline seeking, volume management, and catalog track synchronization.
- **Stealth Editorial Design System**: Pure black foundation (`#000000`), subtle micro-borders, acid-lime accents (`#CBFE00`), and balanced typography (Kanit display, Instrument Serif accents, and Space Grotesk data).
- **Zero-Build Architecture**: Vanilla HTML5, modern CSS3 custom properties, and native ES6 JavaScript. No compilation or heavyweight build steps required.

---

## Directory Structure

```text
11jaydymilla/
├── audio/                      # Master audio preview releases (MP3)
│   ├── by_the_window.mp3
│   ├── if_you_miss_me.mp3
│   ├── lost_it.mp3
│   ├── neon_limelight.mp3
│   └── soul_creature.mp3
├── photes/                     # Photography and visual artwork assets
│   ├── image_0ca22.JPG         # Hero portrait with 5-string banjo
│   └── ...
├── vides/                      # High-definition showcase media & video posters
│   ├── animo-sphere-wall-720p.mp4
│   ├── animo-showcase-stream-1280p.mp4
│   ├── hero-poster.jpg
│   └── cylinder-poster.jpg
├── desing faste1 just africa/  # Master design system & component specifications
├── motion/                     # Motion physics specifications
├── CLIENT_RESEARCH_REPORT.md   # Artist background & creative research documentation
├── dev_server.py               # Lightweight multithreaded server with HTTP 206 Range support
├── index.html                  # Main application markup
├── style.css                   # Custom design system tokens & specialized layouts
├── app.js                      # Core application lifecycle & interaction logic
└── README.md                   # Technical documentation
```

---

## Getting Started

### Local Development

To run the platform locally with support for HTTP Range requests (required for smooth video seeking and audio streaming):

```bash
# Start the local development server (port 8080 by default)
python dev_server.py 8080
```

Open [http://localhost:8080](http://localhost:8080) in any modern web browser.

### Deployment

Because the project is built with static assets, it can be hosted on any static hosting platform or CDN (e.g., Cloudflare Pages, Vercel, Netlify, GitHub Pages, or AWS S3/CloudFront).

Ensure the web server is configured to send `Accept-Ranges: bytes` headers for MP4 video and MP3 audio assets.

---

## Browser & Device Support

- **Desktop**: Modern Chrome, Safari, Firefox, Edge.
- **Mobile & Tablet**: iOS Safari 15+, Android Chrome.
- **Reduced Motion**: Honored via `@media (prefers-reduced-motion: reduce)`.

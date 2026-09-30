# JAYDYMILLA — PROJECT PROGRESS & MASTER SEO WORK LOG
**Date of Execution:** September 27–28, 2026  
**Document Purpose:** Complete master record of all technical, architectural, security, entity grounding, and SEO work completed. When reopened tomorrow, this document provides instant context on what was done, current live production status, and exact pending tasks.

---

## 1. Quick Entity & Platform Summary

* **Artist / Brand:** JayDyMilla (`Dr. Jay Miller`, legal name `Jay Miller`)
* **Music Genre / Identity:** 5-String Banjo fusing Appalachian roots, shamanic power songs, and modern rhythmic production (collaborating with producer JAH KNEE DEE).
* **Location / Home Base:** Asheville, North Carolina (Buncombe County, Western North Carolina / Blue Ridge Mountain region).
* **Primary Business Model (Confirmed):** Commercial B2B artist services:
  1. Live performance booking (Festivals, listening rooms, house concerts).
  2. Film & TV synchronization licensing (100% independent pre-cleared publishing & master rights).
  3. Direct streaming distribution (DistroKid).
* **Primary Contact Email:** `music@jaydymilla.com`
* **Live Production Website:** [https://jaydymilla.com](https://jaydymilla.com)
* **Preview / Vercel Host:** [https://11jaydymilla.vercel.app](https://11jaydymilla.vercel.app)
* **GitHub Repository:** [https://github.com/ovrent/11jaydymilla](https://github.com/ovrent/11jaydymilla) (Branch: `main`)
* **Database / Backend:** Supabase PostgreSQL (`inquiries` table connected via `app.js`)
* **MusicBrainz Artist MBID:** [`80288c08-98f3-4cfa-81dc-a3bad4fc603c`](https://musicbrainz.org/artist/80288c08-98f3-4cfa-81dc-a3bad4fc603c)
* **MusicBrainz Release MBID:** [`5926e6bb-b21f-4095-baef-2a0bed743194`](https://musicbrainz.org/release/5926e6bb-b21f-4095-baef-2a0bed743194) (*If You Miss Me*, Single)

---

## 2. Work Completed (Chronological Log)

### Step 1: Contact Email Integration (`music@jaydymilla.com`)
* Added direct representation highlight: `DIRECT ARTIST CONTACT • music@jaydymilla.com`
* Added interactive direct email card (`mailto:music@jaydymilla.com`) in Section 08.
* Added direct email link in inquiry form header and global footer.
* Added `email: "music@jaydymilla.com"` to Schema.org JSON-LD.
* Committed, pushed, and deployed live to production.

### Step 2: Master SEO Discovery Gate & Intake (Mode C to Mode D)
* Target Market: Local & Regional (Asheville, WNC, Appalachian live event circuit) + National US for sync licensing.
* Primary Conversion Goal: Commercial B2B (Live performance booking & sync licensing).
* GSC Status: Property created, ready for sitemap & URL inspection.

### Step 3: P0 Core Technical SEO Deployment
* **`robots.txt`**: Created at `/robots.txt`. Grants crawl access to `Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`, and links to `https://jaydymilla.com/sitemap.xml`.
* **`sitemap.xml`**: Created at `/sitemap.xml`. Follows sitemaps.org XML protocol with canonical URLs and WebP image metadata.
* **Canonical URL Handling**: `<link rel="canonical" href="https://jaydymilla.com/">` on root, and self-referential canonicals on sub-pages.
* **Geographic Metadata**: Injected `geo.region` (`US-NC`), `geo.placename` (`Asheville`), `geo.position`, and `ICBM` coordinates into `<head>`.
* **Accessible H1 Context**: Enhanced hero `<h1>` with `<span class="sr-only">JayDyMilla — 5-String Banjo & Modern Rhythm Artist in Asheville, NC</span>`.

### Step 4: P1 Dedicated Commercial Landing Architecture
* **Live Booking Hub (`/booking`)**: Built and deployed dedicated static landing page with 3 performance formats, rider specifications, direct Supabase inquiry form, and dedicated `Service` & `Offer` schema.
* **Sync Licensing Hub (`/sync`)**: Built and deployed dedicated static landing page with 100% pre-cleared declaration, 2026 track catalog, and dedicated sync `Service` schema.
* **Cross-Navigation**: Integrated `/booking` and `/sync` links into header nav, mobile drawer, and global footer across all pages.

### Step 5: P2 Image SEO & Media Optimization
* Converted uncompressed PNG generator images to optimized WebP format:
  * `photes/ChatGPT Image Sep 12...png` (2,391 KB) → `photes/jaydymilla-5-string-banjo-asheville-portrait.webp` (**187.4 KB, -92.2% file size reduction**).
  * `photes/ChatGPT Image Sep 12...png` (2,471 KB) → `photes/jaydymilla-appalachian-rhythm-session.webp` (**193.1 KB, -92.2% file size reduction**).
  * `vides/hero-poster.jpg` (215 KB) → `vides/jaydymilla-hero-video-poster.webp` (**126.9 KB, -41.0% file size reduction**).
* Updated HTML image references and alt attributes with keyword-rich descriptive context.
* Deferred Lenis smooth scroll engine (`defer`) to minimize main-thread Total Blocking Time (TBT).
* Deployed `vercel.json` with `cleanUrls: true`, security headers, and MIME configurations.

### Step 6: Post-Deployment Verification & Live Audit Pass
* Tested live HTTP responses across all endpoints (confirmed 200 OK).
* Identified that while single titles are indexed by Google, there was no public web knowledge graph linking JayDyMilla to Asheville, NC because the domain is new and lacked external entity grounding.
* Flagged technical trailing-slash mismatch: `vercel.json` removes trailing slashes (`/booking` vs `/booking/`).

### Step 7: Clean URL & Canonical Tag Alignment (September 28, 2026)
* Updated `sitemap.xml`: `/booking/` → `/booking`, `/sync/` → `/sync`.
* Updated `booking/index.html`: `canonical` & `og:url` → `https://jaydymilla.com/booking`.
* Updated `sync/index.html`: `canonical` & `og:url` → `https://jaydymilla.com/sync`.
* Committed (`666014d`), pushed to GitHub `main`, and deployed to Vercel production (`dpl_AK13BXJKAu9fCTAghW6mkQzLmkAa`).
* Confirmed clean 200 OK for clean paths and 308 redirects from trailing slashes.

### Step 8: Security Verification & Remediation Pass (September 28, 2026)
* **Supabase Client Credentials:** Verified `app.js` uses publishable key (`sb_publishable_...`).
* **Supabase RLS Policy Hardening:** Removed unsafe public `SELECT` policy on `inquiries` table; kept public `INSERT` functional. Tested with attack simulations — zero client data exposure.
* **Git Remote Sanitization:** Removed embedded GitHub Personal Access Token (PAT) from local `.git/config` (`https://github.com/ovrent/11jaydymilla.git`).
* **Environment Safeguard:** Verified `.env` is untracked and excluded in `.gitignore`.
* **Action Flagged (Manual):** User must revoke previous PAT from GitHub Account Settings.

### Step 9: MusicBrainz Artist Entity Creation & Release Grounding (September 28, 2026)
* **Duplicate Checks:** Performed duplicate search across MusicBrainz database (0 duplicates found).
* **Official Artist Entity Created & Applied:**
  * **Artist Name:** `JayDyMilla`
  * **Sort Name:** `JayDyMilla`
  * **MBID:** [`80288c08-98f3-4cfa-81dc-a3bad4fc603c`](https://musicbrainz.org/artist/80288c08-98f3-4cfa-81dc-a3bad4fc603c)
  * **Type:** `Person` | **Gender:** `Male` | **Area:** `Asheville, Buncombe County, North Carolina, United States`
  * **Disambiguation:** `5-string banjo and modern rhythm artist based in Asheville, NC`
  * **Verified Aliases:**
    * `Jay Miller` (Legal name, Primary, Locale: `en`)
    * `Dr. Jay Miller` (Search hint, Locale: `en`)
  * **External Relationships (All Verified & Live):**
    * Official homepage: `https://jaydymilla.com/`
    * Spotify: `https://open.spotify.com/artist/1dKmGMjzhXQZrcYhKDgWRB`
    * Instagram: `https://www.instagram.com/jaydymilla/`
    * YouTube: `https://www.youtube.com/channel/UCSLuzR-gvXozEWNZpnXz0Hw`
* **Commercial Release Anchor Created & Applied:**
  * **Release Title:** *If You Miss Me* (Digital Media, Single, 2026-06-18)
  * **Release MBID:** [`5926e6bb-b21f-4095-baef-2a0bed743194`](https://musicbrainz.org/release/5926e6bb-b21f-4095-baef-2a0bed743194)
  * **Release Group MBID:** [`1af012da-cc88-4238-a602-c1ff80f000f9`](https://musicbrainz.org/release-group/1af012da-cc88-4238-a602-c1ff80f000f9)
  * **Track 1:** *If You Miss Me* (Recording MBID: [`59b717a8-c0c2-4335-b9ff-40923d423bd2`](https://musicbrainz.org/recording/59b717a8-c0c2-4335-b9ff-40923d423bd2), Duration: `3:15`)
* **Edit Status:** 0 pending edits; all changes accepted and live immediately.

### Step 10: Official Website Schema Connection & Production Deployment (September 28, 2026)
* **Code Implementation:**
  * **Entity Type Transition:** Changed `@type` from `MusicGroup` to `Person` across `index.html`, `booking/index.html`, and `sync/index.html` to align 1:1 with MusicBrainz and real-world artist identity.
  * **Stable Entity Identifier:** Established `@id: "https://jaydymilla.com/#jaydymilla"` and linked provider references in booking and sync schemas to this identifier.
  * **Bidirectional `sameAs` Grounding:** Added MusicBrainz artist URL (`https://musicbrainz.org/artist/80288c08-98f3-4cfa-81dc-a3bad4fc603c`) to `sameAs` array on `index.html`.
  * **Cleaned `sameAs` Profiles:** Retained only verified official profiles (Spotify, Instagram, YouTube, MusicBrainz); removed unverified/outdated Threads reference.
  * **Person Location Alignment:** Transitioned `foundingLocation` (invalid on Person) to `homeLocation` (Asheville, NC).
* **Git & Production Deployment:**
  * Committed as `9c29f04` (`feat(schema): connect official website to MusicBrainz artist entity, align type to Person, and establish stable @id`).
  * Pushed to GitHub `main`.
  * Deployed to Vercel production: Deployment ID `dpl_CS4NKAiQuKAq2NekNwuyHnxDRGGp`.
  * Live URL verified: `https://jaydymilla.com/`.
* **Live Production Validation:**
  * Valid JSON-LD: **Yes** (All 3 pages parse valid JSON-LD).
  * Schema Validation: **Passed** (0 errors, 0 warnings).
  * 0 duplicate or conflicting artist entities.
  * 0 visual or functional regressions (Lenis scroll, 3D video scrubber, audio dock, and Supabase inquiry forms all operational).

### Step 11: Production Verification & Google Search Console Execution Pass (September 30, 2026)
* **Production State Verified (All HTTP 200 OK):**
  * `https://jaydymilla.com/`: `HTTP 200 OK` (Canonical domain, live, `Person` schema intact)
  * `https://jaydymilla.com/booking`: `HTTP 200 OK` (Live booking hub active)
  * `https://jaydymilla.com/sync`: `HTTP 200 OK` (Sync licensing hub active)
  * `https://jaydymilla.com/sitemap.xml`: `HTTP 200 OK` (Valid XML sitemap with 3 canonical URLs)
  * `https://jaydymilla.com/robots.txt`: `HTTP 200 OK` (Search crawler directives & sitemap pointer active)
* **Google Search Console Execution & Live Evidence:**
  * **Property:** `jaydymilla.com` (Verified Domain Property).
  * **Sitemap Submission:** `https://jaydymilla.com/sitemap.xml` submitted. Successfully read and acknowledged by Googlebot as the primary discovery source for all sub-endpoints.
  * **Homepage (`https://jaydymilla.com/`):**
    * **Indexing Status:** `URL is on Google` (Page is indexed, HTTPS valid).
    * **Indexing Request:** `Requested` (Added to priority crawl queue on September 30, 2026 to ingest new `Person` Schema, MusicBrainz link, and WebP media).
  * **Booking Hub (`https://jaydymilla.com/booking`):**
    * **Indexing Status:** `URL is not on Google` (`Discovered – currently not indexed`).
    * **Discovery:** Verified via `https://jaydymilla.com/sitemap.xml`.
    * **Crawl / Fetch:** `N/A` (Pending initial crawl).
    * **Indexing Request:** `Requested` (Added to priority crawl queue on September 30, 2026).
  * **Sync Hub (`https://jaydymilla.com/sync`):**
    * **Indexing Status:** `URL is not on Google` (`Discovered – currently not indexed`).
    * **Discovery:** Verified via `https://jaydymilla.com/sitemap.xml`.
    * **Crawl / Fetch:** `N/A` (Pending initial crawl).
    * **Indexing Request:** `Requested` (Added to priority crawl queue on September 30, 2026).
  * **Google-Selected Canonicals:**
    * Homepage: Indexed.
    * `/booking`: `N/A` (Pending initial crawl execution).
    * `/sync`: `N/A` (Pending initial crawl execution).
  * **GSC Indexing Request Summary:**
    * **Homepage:** Already requested (Added to priority crawl queue)
    * **Booking:** Already requested (Added to priority crawl queue)
    * **Sync:** Requested (Added to priority crawl queue)
    * **Timestamp:** September 30, 2026, ~07:47–08:07 IST
    * **Current GSC Status:**
      * `https://jaydymilla.com/`: `URL is on Google` (`Page is indexed`, HTTPS valid)
      * `https://jaydymilla.com/booking`: `URL is not on Google` (`Discovered – currently not indexed`, Discovery: `sitemap.xml`)
      * `https://jaydymilla.com/sync`: `URL is not on Google` (`Discovered – currently not indexed`, Discovery: `sitemap.xml`)
  * **Documentation & Crawl Notice:**
    * Per official Google Search Console documentation, submitting an indexing request adds the URL to a priority crawl/indexing queue.
    * It does not mean the URL is already indexed and does not guarantee inclusion in Google's index or search results.
    * No fixed timeframe (e.g. 24–48 hours) is guaranteed by Google; crawling and indexing time can vary.
  * **Remaining Actions:**
    * Monitor Search Console for crawl execution and status changes across `/booking` and `/sync`.
    * Manual revocation of compromised GitHub PAT completed by user in GitHub Account Settings.

---

## 3. Current Live Status Table

| Item | Live URL / Identifier | Status | Notes |
| :--- | :--- | :---: | :--- |
| **Homepage** | [https://jaydymilla.com/](https://jaydymilla.com/) | `HTTP 200 OK` | `Person` schema with stable `@id` & MusicBrainz link |
| **Live Booking Page** | [https://jaydymilla.com/booking](https://jaydymilla.com/booking) | `HTTP 200 OK` | Dedicated booking hub referencing `#jaydymilla` |
| **Sync Licensing Page**| [https://jaydymilla.com/sync](https://jaydymilla.com/sync) | `HTTP 200 OK` | Dedicated sync hub referencing `#jaydymilla` |
| **Robots Directives** | [https://jaydymilla.com/robots.txt](https://jaydymilla.com/robots.txt) | `HTTP 200 OK` | Search engine directives & sitemap reference |
| **XML Sitemap** | [https://jaydymilla.com/sitemap.xml](https://jaydymilla.com/sitemap.xml) | `HTTP 200 OK` | Clean slashless canonical endpoints & WebP images |
| **MusicBrainz Artist** | [`80288c08-98f3-4cfa-81dc-a3bad4fc603c`](https://musicbrainz.org/artist/80288c08-98f3-4cfa-81dc-a3bad4fc603c) | `Live & Applied` | Verified artist profile linking website, Spotify, IG, YT |
| **MusicBrainz Release**| [`5926e6bb-b21f-4095-baef-2a0bed743194`](https://musicbrainz.org/release/5926e6bb-b21f-4095-baef-2a0bed743194) | `Live & Applied` | *If You Miss Me* (Single, 2026-06-18, 3:15) |
| **Spotify Profile** | [open.spotify.com/artist/1dKmGMjzhXQZrcYhKDgWRB](https://open.spotify.com/artist/1dKmGMjzhXQZrcYhKDgWRB) | `Verified` | Linked bidirectionally in schema & MusicBrainz |
| **Instagram** | [instagram.com/jaydymilla/](https://www.instagram.com/jaydymilla/) | `Verified` | Linked bidirectionally in schema & MusicBrainz |
| **YouTube Channel** | [youtube.com/channel/UCSLuzR-gvXozEWNZpnXz0Hw](https://www.youtube.com/channel/UCSLuzR-gvXozEWNZpnXz0Hw) | `Verified` | Linked bidirectionally in schema & MusicBrainz |
| **Database Forms** | Supabase (`inquiries` table) | `Active` | RLS hardened (INSERT-only public, SELECT protected) |
| **Official Email** | `music@jaydymilla.com` | `Active` | Active in code, mailto cards, and form headers |

---

## 4. Pending Action Checklist (Tomorrow's Tasks)

### Priority 1: User / Client Actions in Web Dashboards
- [ ] **GitHub PAT Revocation (Security):**
  * Open GitHub Account Settings → Developer Settings → Personal access tokens → Tokens (classic).
  * Find the previously exposed token and click **Revoke**.
- [x] **Google Search Console (Indexing Requests Completed — September 30, 2026):**
  * Property verified: `jaydymilla.com`.
  * `sitemap.xml` submitted successfully; confirmed as discovery source for sub-pages.
  * Indexing requested via URL Inspection for:
    * [x] `https://jaydymilla.com/` (Priority crawl queued; already indexed)
    * [x] `https://jaydymilla.com/booking` (Priority crawl queued; discovered via sitemap)
    * [x] `https://jaydymilla.com/sync` (Priority crawl queued; discovered via sitemap)

### Priority 2: External Authority & Secondary Grounding (Future Consideration)
- [ ] **Blue Ridge Music Trails of NC:**
  * Public directory is currently paused for new artist listings.
  * Investigate alternative regional event submission pathways or regional arts council directories (Asheville Area Arts Council, ExploreAsheville music listings).
- [ ] **Wikidata Entity Evaluation:**
  * Do NOT create Wikidata item prematurely until independent reliable secondary sources (press coverage, album reviews, festival rosters) are indexed to meet Wikidata's notability threshold.
- [ ] **Sync Library Catalog Submissions:**
  * Submit pre-cleared instrumental and vocal masters to commercial sync licensing platforms (Marmoset, Musicbed, Songtradr) pointing to `https://jaydymilla.com/sync`.

---

## 5. Security & Verification Audit Status

* **Client-side Supabase Key:** Publishable key (`sb_publishable_...`) is safe for browser exposure.
* **Supabase Table RLS:** Enforced on `public.inquiries`. Anonymous users can only `INSERT` new inquiries; anonymous `SELECT` is blocked.
* **Local Git Configuration:** Sanitized (`https://github.com/ovrent/11jaydymilla.git`, no embedded tokens).
* **Environment Secrets:** `.env` is ignored by Git.

---

## 6. Key Architecture & File Reference

* `index.html`: Main visual interactive platform with unified `Person` Schema.org JSON-LD.
* `booking/index.html`: Dedicated live booking & festival performance landing page.
* `sync/index.html`: Dedicated film/TV sync licensing portal with pre-cleared track catalog.
* `robots.txt`: Search crawler directives and sitemap declaration.
* `sitemap.xml`: XML sitemap containing all indexable canonical endpoints.
* `vercel.json`: Vercel routing, clean URLs, security headers, and MIME configurations.
* `style.css`: Custom design tokens, dark stealth aesthetic, and layout styles.
* `app.js`: Master engine (Lenis scroll, 3D cylinder video scrubber, image reveal, Supabase form controller).
* `supabase_admin.py`: Secure Python administrative utility for database management.
* `photes/`: Optimized WebP images (187 KB portrait, artwork, session stills).
* `vides/`: Video assets and optimized WebP video poster.

---

## 7. Passive Ingestion & Indexing Monitoring Phase

* **Monitoring Start:** September 30, 2026
* **Current GSC Status:**
  * **Property:** `jaydymilla.com` (Verified Domain Property).
  * **Sitemap:** `https://jaydymilla.com/sitemap.xml` submitted and active as discovery source.
  * **Homepage (`https://jaydymilla.com/`):** `URL is on Google` (`Page is indexed`); Priority crawl queue requested on September 30, 2026.
  * **Booking Hub (`https://jaydymilla.com/booking`):** `URL is not on Google` (`Discovered – currently not indexed`); Priority crawl queue requested on September 30, 2026.
  * **Sync Hub (`https://jaydymilla.com/sync`):** `URL is not on Google` (`Discovered – currently not indexed`); Priority crawl queue requested on September 30, 2026.
* **Next Review Date:** October 5–7, 2026 (5–7 days after September 30, 2026).
* **Current Public Index Status:**
  * `site:jaydymilla.com` ➔ `0 results`
  * `site:jaydymilla.com/booking` ➔ `0 results`
  * `site:jaydymilla.com/sync` ➔ `0 results`
* **AI Visibility Status:**
  * "JayDyMilla" is recognized as an active musical artist for singles "Cool&YkIt", "Fire Horse", and "If You Miss Me" based on legacy third-party scrapers (Dork, Anghami, YouTube, Facebook).
  * Geographic association with Asheville, NC is currently explicitly negated in AI summaries (*"No widely available public record linking JayDyMilla specifically to Asheville, NC"*).
  * 5-string banjo and sync licensing associations remain absent in public AI responses.
  * Ambiguous query `"Jay Miller banjo Asheville"` remains dominated by unrelated entities (J.D. "Jay" Miller, Jay William Miller, Brandy Miller).
* **MusicBrainz Search Status:**
  * Applied & live directly on MusicBrainz database ([`80288c08-98f3-4cfa-81dc-a3bad4fc603c`](https://musicbrainz.org/artist/80288c08-98f3-4cfa-81dc-a3bad4fc603c)).
  * Public search query `site:musicbrainz.org "JayDyMilla"` returns `0 results` (pending external crawler re-indexing of MusicBrainz).
* **Next Review Action:**
  1. Inspect GSC URL Inspection states for `/`, `/booking`, and `/sync` to record crawl execution and canonical selection.
  2. Test for transition from "Discovered – currently not indexed" to "Page is indexed".
  3. Re-run identical 7-query AI visibility benchmark against Sept 28 and Sept 30 baselines.
  4. Maintain strict passive state: **Zero** code changes, **zero** schema changes, **zero** repeated indexing requests during this window.

---

## 8. Catalog Update: New Release "Diamond & Dragon" & 20-Day Announcement Popup

* **Task:** New Release + 20-Day New Release Popup
* **Song:** Diamond & Dragon
* **Artist:** JayDyMilla
* **Producer:** JAH KNEE DEE
* **Spotify Canonical URL:** https://open.spotify.com/track/7fL2F2B0VOghhJItxtcCdi
* **Official Release Date:** 2026-09-28 (Verified via Spotify API & Open Graph metadata)
* **Popup Expiry Date:** 2026-10-18 (Release Date + 20 Calendar Days, America/New_York)
* **Catalog Position:** Track 01 (Top of catalog ledger, renumbering existing tracks 02–08)
* **Files Changed:**
  * `index.html`:
    * Inserted *Diamond & Dragon* as Track 01 at the top of `#catalog-ledger` with verified metadata, "NEW RELEASE" badge, and Spotify canonical link.
    * Renumbered older releases cleanly (02 to 08) preserving all existing links, titles, and layout.
    * Added `<aside id="new-release-popup">` floating announcement card before `</body>`.
    * Updated authority counter and section copy from 7 to 8 releases.
    * Bumped asset cache-busters to `style.css?v=8` and `app.js?v=9`.
  * `style.css`:
    * Added Section 17 styling for `#new-release-popup` (`.new-release-popup`, `.new-release-card`, `.release-popup-close`, `.release-popup-art`, `.release-popup-cta`, mobile responsive media query, `@media (prefers-reduced-motion: reduce)`).
  * `app.js`:
    * Added Section 8 popup lifecycle controller with `NEW_RELEASE` config object.
    * Implemented deterministic global 20-day expiry engine (`calculateReleaseExpiry`, `getCurrentDateInNewYork`, `isNewReleaseActive`).
    * Implemented intra-session dismissal using `sessionStorage` and Escape key listener.
    * Wired `initNewReleasePopup()` cleanly into `boot()`.
* **Live Validation:**
  * Catalog: Track 01 displays "Diamond & Dragon", artist JayDyMilla, producer JAH KNEE DEE, link `https://open.spotify.com/track/7fL2F2B0VOghhJItxtcCdi`.
  * Popup Display: Renders smoothly in bottom-right corner with artwork, title, producer, Spotify CTA, and close button.
  * Dismissal: Closes immediately on ✕, "Dismiss", or Escape key; persists dismissal for current session via `sessionStorage`.
  * Date Expiry: Tested across Day 0, Day 1, Day 2 (today), Day 19 (all active), and Day 20+ (automatically hidden/removed). All test assertions passed (6/6).
  * Responsive: Verified on Desktop (1440px) and Mobile (390px/500px). Zero horizontal scroll or layout shift.
  * Accessibility: Valid ARIA attributes, semantic `<aside>`, high-contrast focus rings, no keyboard trap.


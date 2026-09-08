# Frontend — rg-web

**What:** MVP landing of the RadarGTA platform with a countdown to launch, affiliate hardware guide and crew directory.
**Why:** the business depends on organic traffic; server-side SEO, $0 cost and a DOM prepared for Fase 2 animations are required.
**Where:** `rg-web/` (App Router).
**How to verify:** `npm run lint` + `npm run build` in `rg-web` (both green) and the verify contract below.

## Stack

- Next.js **16.3.4** (App Router) + React **19.2.8** + TypeScript **5** + Tailwind **v4**.
- **Zero runtime dependencies in Fase 1:** only `next`, `react`, `react-dom` (ADR 0002).
- **Exception (ADR 0009):** `gsap` (3.15.0) + `gsap/ScrollTrigger` + `lenis` (1.3.26) allowed for the hero scroll mask ONLY, inside the single client component `HeroScrollFx`. Installed in PR2. Any other use of these imports is a violation.

## Motion architecture (two tracks)

The landing motion is split into two tracks so the zero-dep guarantee and the cinematic centerpiece coexist:

| Track | Tech | Scope | Ships |
|---|---|---|---|
| 1 — CSS scroll-driven (zero-dep) | `animation-timeline: view()/scroll()` utilities in `app/globals.css`, guarded by `@supports (animation-timeline: scroll())` | Section reveals (`[data-reveal]`), parallax (`[data-parallax]`), gradient sweep (`.heading-sweep`), countdown digit tick (`digit-tick`), grain/vignette overlays (`.fx-grain`/`.fx-vignette`), hero wash (`.hero-wash`), text-clip mask base (`.mask-base`) | Always; unsupported browsers get the static final state (visible, untransformed) |
| 2 — GSAP/Lenis scrub | `HeroScrollFx` (client) + ADR 0009 deps | Hero scroll mask choreography (P0 mask overfill → P1 counter-zoom → P2 wash + headline → P3 parallax-out) | PR2; bails out entirely under `prefers-reduced-motion: reduce` (static final state, native scroll, no Lenis) |

### Track 1 utilities (`app/globals.css`)

- `[data-reveal]` — fade + rise once via `view()` timeline (`animation-range: entry 0% cover 40%`); `[data-parallax]` — `translateY` via `scroll(root)`, transform-only (compositor). Both live inside `@supports (animation-timeline: scroll())`; reduced-motion kill-switch sets `animation: none` on them explicitly (scroll-driven animations ignore `animation-duration`).
- `.heading-sweep` — 8s alternate gradient sweep on section headings; falls back to the static `.text-vice-gradient` (component applies it) when unsupported or reduced-motion.
- `digit-tick` keyframe — transform/opacity only (no width change → no CLS); replays via key remount (`key={`${cell.key}-${values[cell.key]}`}`) in `Countdown.tsx`; reduced-motion = instant swap (existing behavior preserved).
- `.fx-grain` — feTurbulence data-URI static overlay, `opacity: 0.05` (≤ 0.06), `pointer-events: none`, rendered div carries `aria-hidden="true"`. MUST NOT animate.
- `.fx-vignette` — radial transparent → void overlay; replaces the removed `background-attachment: fixed` on `body` (iOS perf/behavior risk).
- `.hero-wash` — dedicated layer (z 30) for the P2 wash; opacity 0 by default, GSAP tweens `autoAlpha` in PR2.
- `.mask-base` — text-clip mask base (`background-clip: text` + `background-size: var(--bg-zoom, 100%)`). **Deliberate deviation from the spec's SVG-mask wording:** an SVG data-URI mask cannot load the Anton webfont (letter shapes would fall back wrong), so the mask is text-clip instead; `-webkit-background-clip: text` provides the Safari prefix. PR1 lays the utility only; PR2 applies it to the hero.
- Mobile GPU gating: `background-attachment: fixed` removed from `body`; orb blur ≤ 40px by default, 90px only inside `(min-width: 768px) and (prefers-reduced-motion: no-preference)`.
- `.eyebrow` bumped to `0.78rem / 700` for ≥ 4.5:1 contrast.

### Track 2 (PR2) — HeroScrollFx + hero art

- `HeroScrollFx.tsx` is the ONLY consumer of `gsap`/`lenis`. Pattern: `gsap.context(..., "#hero")` + revert, Lenis with `anchors: true`, `prefers-reduced-motion` bailout. Scrubs a normalized 1.0 timeline: P0 overfill (scale 1.3, `--bg-zoom` 130%) → P1 lockstep 1.3→1.0 (0–40%) → P2 wash + headline (40–70%) → P3 content parallax-out + cue fade (0.15–0.30 / 70–100%).
- **Lenis anchors note (verify):** anchor navigation to `#crews`, `#crews-form`, `#hardware` MUST keep working with Lenis active — `anchors: true` + native scrollbar, no focus trap, keyboard Tab/PageDown intact.
- **LCP art (deliberate deviation):** the hero cityscape uses a raw `<picture>` (AVIF + WebP, art-directed 9:16 crop for mobile) + media-scoped `ReactDOM.preload(..., { as: "image", imageSrcSet, imageSizes, media, fetchPriority: "high" })` — NOT `next/image`'s `preload` prop. Rationale: `priority` is **deprecated** in Next 16 (v16.0.0, replaced by `preload`), and the `preload` prop cannot art-direct crops or carry a `media` attribute. The `<img>` carries `fetchpriority="high"`; container `aspect-[16/9]` reserves space (CLS-safe). No `priority` prop anywhere.
- **Mask mechanism (deliberate deviation):** text-clip via `.mask-base` (`background-clip: text` + `background-image: var(--mask-art)`) — NOT the spec's SVG mask (an SVG data-URI mask cannot load the Anton webfont). GSAP tweens the CSS var `--bg-zoom` (130% → 100%) in lockstep with the art transform. The "6" span gradient was removed — the full "GTA 6" wordmark is the window.
- **Asset integration gate:** `HERO_CITYSCAPE_READY` in `Hero.tsx` is `true` (assets generated + encoded 2026-09-07, prompt contract + provenance in [`docs/technical/hero-cityscape-prompt.md`](hero-cityscape-prompt.md)). With the flag on: `#hero-art` renders the `<picture>` (AVIF + WebP, art-directed 9:16 for mobile), `.mask-base` clips the 16:9 art via `--mask-art`, and two media-scoped preload `<link>`s are emitted. Flipping the flag back to `false` restores the dusk-gradient fallback (`.hero-art-fallback`, intentional) + `--mask-art-fallback` wordmark (no broken image, no transparent text).

## Asset provenance

Original AI art only (ADR 0008 — no Rockstar/Take-Two trademarks, characters, logos, or Vice City art likeness; explicit negative prompt). Dusk palette pinned to tokens: `void #0a0910`, `neon-pink #ff2fb3`, `cyan #00e5ff`, `sunset #ffd27b`. Recorded per asset (tool, model + version, date, full prompt, negative prompt, seed, post-processing):

| Asset | Status | Provenance |
|---|---|---|
| `public/hero/cityscape-16x9` (+ 9:16 art, AVIF/WebP, srcset 640/1280/1920/2400w) | **Generated 2026-09-07** (integrated, `HERO_CITYSCAPE_READY = true`) | User-generated (tool unknown — no EXIF tag), encoded with sharp 0.35.4 (one-off, not a runtime dep). 16:9 source 2752×1536, 9:16 source 1536×2752 (separate native portrait, NOT a crop — deviation). AVIF q70/q66, WebP q80. Full record: [`hero-cityscape-prompt.md`](hero-cityscape-prompt.md) §Generation record. |
| `public/og-image.png` (1200×630, ≤ ~200 KB, "RADAR GTA" text) | Generated in PR3 | tool/model/date/prompt/negative/seed/post to be recorded here at generation time |

Encode with sharp: AVIF q70 (+ WebP fallback); 9:16 = art-directed crop of the SAME 16:9 generation (skyline consistency). Integration gate: `HERO_CITYSCAPE_READY` in `components/Hero.tsx` (flips to `true` once the files land).

## Components

### Server components (SEO)

| Path                            | Role                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| `app/page.tsx`                  | Landing composition.                                                      |
| `app/layout.tsx`                | Root layout: `lang="es"`, metadata, fonts (Anton + Geist), JSON-LD Event. |
| `components/Hero.tsx`           | Hero with the countdown.                                                  |
| `components/HardwareGuide.tsx`  | Affiliate hardware guide (Amazon/MercadoLibre).                           |
| `components/DiscordCTA.tsx`     | Retention CTA to Discord.                                                 |
| `components/SectionHeading.tsx` | Reusable section heading.                                                 |
| `components/Footer.tsx`         | Page footer.                                                              |

### Client components (interactivity)

| Path                       | Role                                           |
| -------------------------- | ---------------------------------------------- |
| `components/HeroScrollFx.tsx` | Hero scrub choreography (GSAP/ScrollTrigger/Lenis — ADR 0009, Track 2). |
| `components/Countdown.tsx` | Countdown to the `LAUNCH_DATE`.                |
| `components/CrewForm.tsx`  | Crew registration form (POST to `/api/crews`). |
| `components/CrewGrid.tsx`  | Crew grid (consumes `seedCrews` in Fase 1).    |

`components/CrewCard.tsx` is the unit card used by `CrewGrid`.

## lib/

| File                | Contents                                                                                                                                                                                                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/config.ts`     | `SITE_NAME`, `SITE_TAGLINE`, `LAUNCH_DATE="2026-11-19T00:00:00Z"` (official Rockstar date), `DISCORD_URL`, `CREWS_API_URL` (default `http://localhost:8000/api/crews`, override with `CREWS_API_URL` env), `HARDWARE` (6 affiliate items with placeholder URLs). |
| `lib/types.ts`      | Constants/enums `Platform` (`PS5`/`XBOX_SERIES`/`CROSSPLAY`), `Region` (`LATAM`/`ESPANA`/`INTERNACIONAL`), `Playstyle` (`COMPETITIVO`/`HEISTS_GOLPES`/`CASUAL`/`ROLEPLAY`), labels and the `Crew` and `HardwareItem` interfaces.                                 |
| `lib/data/crews.ts` | Seed of **9 crews** (`seedCrews`) used by the grid in Fase 1.                                                                                                                                                                                                    |

## Design system — Vice City / Leonida

- **Palette:** background `void #0a0910`, `neon-pink #ff2fb3`, `magenta #df3a93`, `cyan #00e5ff`, `sunset #ffd27b`, `cobalt #1d2fa0`, `purple-deep #5c1663`.
- **Typography:** **Anton** (condensed display, equivalent to Rockstar's Art Deco) + **Geist** (sans) via `next/font/google`.
- **CSS utilities (`app/globals.css`):**
  - `.text-vice-gradient` — radial gradient `#ffd27b → #ff2fb3 → #df3a93 → #5c1663`.
  - `.mask-base` — text-clip mask base (hero wordmark window, PR2).
  - `.heading-sweep` — animated gradient sweep (falls back to `.text-vice-gradient`).
  - `.neon-glow-pink` / `.neon-glow-cyan` — neon glow.
  - `.glass-card` — glass-style card.
  - `.btn-primary` / `.btn-ghost` — buttons.
  - `.fx-grain` / `.fx-vignette` — cinematic overlays (static grain + ambient vignette).
  - `.hero-wash` — P2 wash layer (opacity 0 default, GSAP-tweened in PR2).
  - `[data-reveal]` / `[data-parallax]` — scroll-driven motion (Track 1, `@supports`-guarded).
  - `digit-tick` — countdown digit change animation (transform/opacity only).
  - `@keyframes neon-pulse` / `float-glow` / `digit-pulse` / `colon-pulse` / `digit-tick` / `heading-sweep` / `reveal-rise` / `parallax-drift` — micro-interactions and tracks.
  - `@media (prefers-reduced-motion: reduce)` block that disables animations (incl. explicit kill of scroll-driven utilities).

## Verify contract (no test runner — grep + manual checklist)

Run from `rg-web/` (all must pass before commit):

### Grep assertions

| # | Assertion | Command (from `rg-web/`) | Applies |
|---|---|---|
| 1 | Zero `PLACEHOLDER` in built HTML | `npm run build` then `rg "PLACEHOLDER" .next` → zero matches | PR3 (affiliates) |
| 2 | Hero image preload links + `fetchpriority="high"` present | `rg "rel=\"preload\"" .next` (expect 2, media-scoped) + `rg "fetchpriority" .next` | PR2+, once `HERO_CITYSCAPE_READY = true` (asset generated) |
| 3 | No `priority` prop used | `rg "priority" app components` → zero matches (deprecated in Next 16) | PR2+ |
| 4 | Affiliate links carry `rel="noopener noreferrer sponsored"` | `rg "noopener noreferrer sponsored" components` | PR3 |
| 5 | `gsap`/`lenis` imports ONLY in `HeroScrollFx` | `rg 'from "(gsap|lenis)"' components` → only `components/HeroScrollFx.tsx` | PR2+ |
| 6 | Track 1 utilities present in `globals.css` | `rg "fx-grain\|fx-vignette\|hero-wash\|heading-sweep\|digit-tick\|mask-base\|data-reveal\|data-parallax" app/globals.css` | PR1 |
| 7 | Scroll-driven track guarded | `rg "@supports (animation-timeline: scroll())" app/globals.css` | PR1 |
| 8 | No `background-attachment: fixed` | `rg "background-attachment" app/globals.css` → zero matches | PR1 |
| 9 | Grain opacity ≤ 0.06 | `rg "opacity: 0.0[0-6]" app/globals.css` (`.fx-grain`) | PR1 |
| 10 | Orb blur gated (≤40px default, 90px desktop-only) | `rg "blur\\(40px\\)\|blur\\(90px\\)" app/globals.css` + `@media (min-width: 768px)` | PR1 |
| 11 | Lenis anchors configured | `rg "anchors: true" components/HeroScrollFx.tsx` | PR2+ |
| 12 | Hero scrub targets present (ids) | `rg "hero-title-mask\|hero-art\|hero-wash\|hero-content\|hero-cue" components/Hero.tsx` | PR2+ |
| 13 | Mask var fallback guards invisible wordmark | `rg "mask-art-fallback" app/globals.css` | PR2+ |
| 14 | Lint + build green | `npm run lint` && `npm run build` | Every PR |
| 15 | Lenis neutralizes CSS smooth-scroll (no double-smooth / jitter on anchors) | `rg "lenis.lenis-smooth|scroll-behavior: auto !important" app/globals.css` (rules present) | PR2+ (review fix) |

### Manual browser checklist

- [ ] Safari (18+/26): hero mask visible via `-webkit-background-clip: text` — the cityscape art shows through the "GTA 6" wordmark (PR2; asset generated 2026-09-07).
- [ ] `prefers-reduced-motion: reduce`: hero static final state, native scroll, no Lenis interception, digit swap instant, no scroll-driven motion (PR2).
- [ ] Track 1 unsupported browser (e.g. older Safari): all `[data-reveal]`/`[data-parallax]` elements render visible and untransformed; page fully usable.
- [ ] LCP ≤ 2.5s / CLS ≤ 0.1 (hero image preloaded, aspect-reserved) — cityscape AVIF integrated (2026-09-07); verify in browser/DevTools.
- [ ] Keyboard + scrollbar with Lenis active: Tab/PageDown leave the hero normally, scrollbar visible, no focus trap; **anchors `#crews`, `#crews-form`, `#hardware` still navigate** (PR2; smooth-scroll conflict neutralized in globals.css — review fix).
- [ ] Scrub choreography: mask + art overfill at 1.3 at top, lockstep 1.3→1.0 on scroll, wash fades 40–70%, content parallax-out 70–100%, cue fades 0.15–0.30 (PR2; verify in browser).
- [ ] Hero with cityscape: `#hero-art` shows the AVIF art, wordmark "GTA 6" clips it (`.mask-base` + `--mask-art`), no broken-image icon (PR2; fallback only if `HERO_CITYSCAPE_READY = false`).
- [ ] Grain overlay: `pointer-events` pass through, `aria-hidden` on the div, computed opacity ≤ 0.06 (PR3 application).
- [ ] Countdown digit change animates transform/opacity only (DevTools inspect during tick); no width change → no CLS (PR3).
- [ ] Mobile/iOS viewport: no `background-attachment: fixed`, orbs ≤ 40px blur.
- [ ] Disclosure copy visible next to the hardware selector, contrast ≥ 4.5:1 (PR3).

## i18n

All string-bearing files modified by this change are flagged in the i18n inventory (explore §6) for Fase 1.5 extraction. **No extraction in this change** (ADR 0007); strings remain Spanish and unchanged.

## SEO

- `lang="es"` on `<html>`.
- Full metadata in `layout.tsx` (title, description, Open Graph).
- JSON-LD of type `Event` with the release date.
- A single `h1` and `header/main/section/footer` semantics.

## Note

The implementation files were generated in the current session and are validated with `npm run build` in `rg-web`. Database writes and affiliate tracking arrive in Fase 1.5 (`rg-api` + PostgreSQL, see `docs/technical/database.md` and `docs/technical/api-rg-api.md`).

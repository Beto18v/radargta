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
- **Mask mechanism (deliberate deviation, adapted in the hero redesign → PR4 HUD):** text-clip via `.mask-base` (`background-clip: text` + `background-image: var(--mask-art)`) — NOT the spec's SVG mask (an SVG data-URI mask cannot load the Anton webfont). GSAP tweens the CSS var `--bg-zoom` (130% → 100%) in lockstep with the art transform. `--mask-art` carries the solid Vice gradient (`HERO_WORDMARK_GRADIENT`, gold→magenta) instead of the art URL — the wordmark is no longer a window onto the cityscape (user report: "no se notan las letras"); the art stays as the full-bleed `#hero-art` background and the scroll-mask choreography is untouched. **PR4 HUD (delta):** the single `h1` inside `#hero-title-mask` now reads **`GTA VI`** (roman VI scoped to the hero block; `GTA 6`/`Grand Theft Auto 6` kept everywhere else incl. JSON-LD for SEO), preceded by the non-h1 `.hero-eyebrow` **`RADAR`** (≥ `0.875rem`, ≥ 4.5:1 on the scrim band). The Option-C `.hero-badge`/`.hero-tagline` were removed; the telemetry HUD (`.hud-panel` with `LANZAMIENTO GTA VI` label + countdown + `FECHA`/`UBICACIÓN` rows in Geist Mono) and the decorative radar dial (`#hero-radar`, aria-hidden) live inside `#hero-content` — both scrub targets unchanged, so `HeroScrollFx.tsx` needed zero code changes.
- **Asset integration gate:** `HERO_CITYSCAPE_READY` in `Hero.tsx` is `true` (assets generated 2026-09-07, **regenerated 2026-09-08 Nano Banana Pro** + clean JPEG→AVIF re-encode — prompt contract + provenance in [`docs/technical/hero-cityscape-prompt.md`](hero-cityscape-prompt.md)). With the flag on: `#hero-art` renders the `<picture>` (AVIF + WebP parity, art-directed 9:16 for mobile) as the full-bleed background, the wordmark fills with the Vice gradient via `--mask-art`, and two media-scoped preload `<link>`s are emitted. PR4 ladder: 16:9 q82 AVIF at 640/1280/1920/2400/**2560w** (WebP q80 twin at every width), 9:16 q82/q78 at 640/1280/1920w; 16:9 `sizes="130vw"` so FHD serves the 2560w rung (9:16 keeps `100vw` — deviation G, mobile LCP budget). Raw JPEG masters were relocated OUT of `public/` to the gitignored `rg-web/.src-assets/hero/` (never web-served). Flipping the flag back to `false` restores the dusk-gradient fallback (`.hero-art-fallback`, intentional) + the `.mask-base` `--mask-art-fallback` wordmark gradient (no broken image, no transparent text).
- **Hero background video (PR4, marketing verdict — video only in Hero; DiscordCTA later):** a decorative `<video>` overlays the `<picture>` still inside `#hero-art` (both are children, so the GSAP scroll-mask scale 1.3→1.0 applies to the moving art). Pattern: `autoplay muted loop playsInline preload="none" poster="/hero/cityscape-16x9-2560.avif"` — the **AVIF poster IS the LCP** (preloaded via the two `<link>`s), the video loads after and never blocks LCP. Sources per breakpoint: `<source media="(min-width: 768px)" src="/hero/hero-16x9.mp4">` (1920×1080) / `<source media="(max-width: 767px)" src="/hero/hero-9x16.mp4">` (720×1280, object-cover fills). `aria-hidden="true"` + `tabIndex={-1}` (decorative, never focused, `#hero-art` is pointer-events none). **Reduced-motion:** CSS-only kill — under `prefers-reduced-motion: reduce` the `.hero-video` layer is `display: none`, so the still `<picture>` shows (no autoplay attempt, no JS check). Weight budgets: ≤4MB desktop / ≤2MB mobile (hero-16x9.mp4 = 3.13MB, hero-9x16.mp4 = 1.03MB — H.264, no audio track). Encode is a one-off ffmpeg step (CRF 26/30, no audio) — NOT a runtime dependency. Generation: **Veo 3.1 image-to-video** from the cityscape (8s/1080p, boomerang loop, start frame exported PNG/WebP — Veo input cannot be AVIF). Full record: [`hero-cityscape-prompt.md`](hero-cityscape-prompt.md) §Video record.

## Asset provenance

Original AI art only (ADR 0008 — no Rockstar/Take-Two trademarks, characters, logos, or Vice City art likeness; explicit negative prompt). Dusk palette pinned to tokens: `void #0b0710`, `neon-pink #ff2fb3`, `cyan #00e5ff`, `sunset #ffd27b`. Recorded per asset (tool, model + version, date, full prompt, negative prompt, seed, post-processing):

| Asset | Status | Provenance |
|---|---|---|
| `public/hero/cityscape-16x9` (+ 9:16 art, AVIF/WebP, srcset 640/1280/1920/2400/2560w) | **Generated 2026-09-07; REGENERATED 2026-09-08 (Nano Banana Pro) + re-encoded (PR4)** (integrated, `HERO_CITYSCAPE_READY = true`) | PR2: user-generated (tool unknown — no EXIF tag), encoded sharp 0.35.4. 16:9 source 2752×1536, 9:16 source 1536×2752 (separate native portrait, NOT a crop — deviation). **PR4 regeneration 2026-09-08:** Nano Banana Pro (Gemini 3 Pro Image) per the radargta-business contract — same scene prompt + style-ref 16:9→9:16, very subtle grain (the CSS dither overlay adds the rest); masters archived gitignored at `.src-assets/hero/` (`pc.jpeg` 2752×1536 ~3.08MB, `movil.jpeg` 1536×2752 ~2.98MB). Re-encode (no AVIF→AVIF): AVIF q82 (16:9 all rungs; 9:16 640/1280) / q78 (9:16 1920), effort 9, `blur(0.35)`; WebP q80 every width; 2560w rung. **Note:** the 9:16 "1920w" rung is natively 1536×2752 (no pointless upscale — srcset label kept at 1920w). Full record: [`hero-cityscape-prompt.md`](hero-cityscape-prompt.md) §PR4 re-encode + regeneration records. |
| `public/hero/hero-16x9.mp4` (1920×1080, 8s, 24fps, H.264, no audio, 3.13MB) | **Generated 2026-09-08 (Veo 3.1) + ffmpeg re-encode (PR4)** (integrated — video hero, see Track 2) | **Veo 3.1** (`veo-3.1-generate-preview`, Quality 1080p) image-to-video from the cityscape (16:9 + 9:16 separate clips), 8s (Veo 3.1 image-to-video only supports 8s), no audio, boomerang loop; start frame exported PNG/WebP (Veo input cannot be AVIF). One-off **ffmpeg** re-encode: H.264 CRF 26 (16:9) / CRF 30 (9:16), no audio, 24fps — NOT a runtime dep. Budgets ≤4MB desktop / ≤2MB mobile (3.13MB / 1.03MB ✓). Full record: [`hero-cityscape-prompt.md`](hero-cityscape-prompt.md) §Video record. |
| `public/og-image.png` (1200×630, ≤ ~200 KB, "RADAR GTA" text) | Generated in PR3 | tool/model/date/prompt/negative/seed/post to be recorded here at generation time |

Encode with sharp (current contract — PR4, supersedes the PR2 q70/q66 record): clean **JPEG→AVIF** from the regenerated `.src-assets/hero/{pc,movil}.jpeg`, AVIF `effort: 9`, q82 (16:9 all rungs + 9:16 640/1280) / q78 (9:16 1920), WebP q80 effort 6 at EVERY served width, 16:9 ladder 640/1280/1920/2400/2560w + 9:16 640/1280/1920w, `sizes="130vw"` on 16:9 (9:16 `100vw` — deviation G). Raw JPEGs must never be served or committed (masters live in the gitignored `.src-assets/hero/`). Video: ffmpeg H.264 CRF 23–30 no-audio (one-off, not a runtime dep).

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

- **Palette:** background `void #0b0710`, `neon-pink #ff2fb3`, `magenta #df3a93`, `cyan #00e5ff`, `sunset #ffd27b`, `cobalt #1d2fa0`, `purple-deep #5c1663`.
- **Typography:** **Anton** (condensed display, equivalent to Rockstar's Art Deco) + **Geist** (sans) via `next/font/google`.
- **CSS utilities (`app/globals.css`):**
  - `.text-vice-gradient` — radial gradient `#ffd27b → #ff2fb3 → #df3a93 → #5c1663`.
  - `.mask-base` — text-clip mask base (hero wordmark, PR2; fills via `--mask-art`, now the Vice gradient — hero redesign).
  - `.hero-eyebrow` — non-h1 "RADAR" brand line (PR4 HUD, ≥ `0.875rem` tracked caps, mist).
  - `.hud-panel` / `.hud-label` / `.hud-rows` / `.hud-row` / `.hud-key` / `.hud-value` — HUD telemetry panel (hairline frame + cyan corner brackets; mono values via `--font-mono`).
  - `.hero-radar` / `.hero-radar-sweep` + `@keyframes radar-sweep` — decorative radar dial, plain keyframes (NOT `@supports`-gated), reduced-motion freeze.
  - `.hud-status` — belonging micro-status (marketing winner, "▸ Tu crew ya se está formando aquí."): HUD label language (small caps + wide tracking), real sentence-case text + CSS uppercase (a11y).
  - `.hero-video` — hero background video overlay (absolute inset-0, object-cover, above the `<picture>` still inside `#hero-art`); `display: none` under `prefers-reduced-motion: reduce` (still picture shows, no autoplay).
  - `.heading-sweep` — animated gradient sweep (falls back to `.text-vice-gradient`).
  - `.neon-glow-pink` / `.neon-glow-cyan` — neon glow.
  - `.glass-card` — glass-style card.
  - `.btn-primary` / `.btn-ghost` — buttons.
  - `.fx-grain` / `.fx-vignette` — cinematic overlays (static grain + ambient vignette).
  - `.hero-wash` — P2 wash layer (opacity 0 default, GSAP-tweened in PR2).
  - `[data-reveal]` / `[data-parallax]` — scroll-driven motion (Track 1, `@supports`-guarded).
  - `digit-tick` — countdown digit change animation (transform/opacity only).
  - `@keyframes neon-pulse` / `float-glow` / `digit-pulse` / `colon-pulse` / `digit-tick` / `heading-sweep` / `radar-sweep` / `reveal-rise` / `parallax-drift` — micro-interactions and tracks.
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
| 16 | PR3 polish applied: countdown tick key remount + DiscordCTA sheen + muted token | `rg "cell.key\}-\\\$\{values\[cell.key\]" components/Countdown.tsx` (key present) + `rg "sheen-border" components/DiscordCTA.tsx app/globals.css` + `rg "color-muted: #bcb6d8" app/globals.css` | PR3 (polish slice) |
| 17 | HUD hero (PR4) applied: single h1 "GTA VI" + RADAR eyebrow + telemetry panel + radar dial; Option-C badge/tagline gone | `rg "GTA VI" components/Hero.tsx` (h1 text) + `rg "hero-eyebrow" components/Hero.tsx app/globals.css` (≥ `0.875rem`, see #18) + `rg "hud-panel\|hud-label\|hud-row\|hud-value" components/Hero.tsx app/globals.css` + `rg "hero-radar\|radar-sweep" components app` | PR4 (HUD hero) |
| 18 | Built HTML has exactly ONE `h1` containing "GTA VI" | `npm run build` then `rg "<h1" .next` → 1 match, containing `GTA VI` | PR4 |
| 19 | Option-C copy removed from the hero components; VI scoped to the hero block; JSON-LD/SEO kept | `rg "LA COMUNIDAD HISPANA DE GTA 6\|LA ESCENA SE ORGANIZA\|LANZAMIENTO GTA 6" components` → zero matches; `rg "GTA 6" components/Hero.tsx components/Countdown.tsx` → zero; `rg "Grand Theft Auto 6" components/Hero.tsx` (JSON-LD kept) + `rg "GTA 6" lib/config.ts` (SITE_TAGLINE SEO kept) | PR4 |
| 20 | Telemetry copy present | `rg "LANZAMIENTO GTA VI\|19 NOV 2026\|LEONIDA // VICE CITY" components/Hero.tsx` | PR4 |
| 21 | Radar dial is decorative (aria-hidden, nothing focusable) | `rg "id=\"hero-radar\"\|aria-hidden" components/Hero.tsx` (`#hero-radar` carries `aria-hidden="true"`) + `rg "pointer-events-none" components/Hero.tsx` | PR4 |
| 22 | Asset ladder re-encoded: 2560w rung + `sizes="130vw"` (16:9), zero `.jpeg` served | `rg "2560w\|130vw" components/Hero.tsx` (srcset + preload `imageSizes`) + `rg "\.jpe?g" .next` → zero + `public/hero/` contains no `.jpeg` (masters relocated to gitignored `.src-assets/hero/`) | PR4 |
| 23 | Lint + build green | `npm run lint` && `npm run build` | Every PR |
| 24 | Hero background video present: `<video>` element + AVIF poster + per-breakpoint sources | `rg "hero-video\|poster=\"\/hero\/cityscape-16x9-2560.avif\"" components/Hero.tsx app/globals.css` + `rg "hero-16x9.mp4\|hero-9x16.mp4" components/Hero.tsx` (sources with `media` per breakpoint) | PR4 |
| 25 | Video is decorative + never blocks LCP (preload=none, aria-hidden, tabIndex -1, muted/loop/playsinline) | `rg "preload=\"none\"\|autoPlay\|playsInline\|tabIndex=\{-1\}" components/Hero.tsx` | PR4 |
| 26 | Reduced-motion: video hidden → still picture shows (CSS-only kill) | `rg "hero-video" app/globals.css` inside the `prefers-reduced-motion: reduce` block (`display: none`) + `rg "prefers-reduced-motion" app/globals.css` | PR4 |
| 27 | Belonging message present (marketing winner) | `rg "Tu crew ya se está formando aquí" components/Hero.tsx` + `rg "hud-status" components/Hero.tsx app/globals.css` | PR4 |

### Manual browser checklist

- [ ] Safari (18+/26): hero title mask renders via `-webkit-background-clip: text` — the "GTA VI" wordmark shows the Vice gradient fill (gold→magenta) with clean letterforms (PR4 HUD; art re-encoded 2026-09-08).
- [ ] `prefers-reduced-motion: reduce`: hero static final state, native scroll, no Lenis interception, digit swap instant, no scroll-driven motion, radar dial VISIBLE with the sweep FROZEN (PR2 + PR4).
- [ ] Track 1 unsupported browser (e.g. older Safari): all `[data-reveal]`/`[data-parallax]` elements render visible and untransformed; page fully usable.
- [ ] LCP ≤ 2.5s / CLS ≤ 0.1 (hero image preloaded, aspect-reserved) — cityscape AVIF re-encoded 2026-09-08 (PR4). DevTools Network at 1920 FHD must serve ≥ **2560w** (`sizes=130vw`); mobile 390 DPR1 → 1280w, DPR≥3 → 1920w max (`100vw` — deviation G); zero `.jpeg` requests; verify in browser/DevTools.
- [ ] Keyboard + scrollbar with Lenis active: Tab/PageDown leave the hero normally, scrollbar visible, no focus trap; **anchors `#crews`, `#crews-form`, `#hardware` still navigate** (PR2; smooth-scroll conflict neutralized in globals.css — review fix).
- [ ] Scrub choreography: mask + art overfill at 1.3 at top, lockstep 1.3→1.0 on scroll, wash fades 40–70%, content parallax-out 70–100%, cue fades 0.15–0.30 (PR2; verify in browser).
- [ ] Hero with cityscape: `#hero-art` shows the AVIF art as the full-bleed background, wordmark "GTA VI" renders the solid Vice gradient (`.mask-base` + `--mask-art` gradient, no cityscape text-fill — legibility), RADAR eyebrow + scrim band behind the text block, no broken-image icon (PR4 HUD; fallback only if `HERO_CITYSCAPE_READY = false`).
- [ ] Grain overlay: `pointer-events` pass through, `aria-hidden` on the div, computed opacity ≤ 0.06 (applied PR3 polish — `.fx-grain` + `.fx-vignette` rendered in `app/layout.tsx`).
- [ ] HUD hero (PR4): reading/visual order = RADAR eyebrow → "GTA VI" (one line, gradient, scrub intact) → `.hud-panel` with "LANZAMIENTO GTA VI" label + countdown in **Geist Mono** + rows "FECHA / 19 NOV 2026" and "UBICACIÓN / LEONIDA // VICE CITY"; hairline frame + cyan corner brackets visible; radar dial sits beside the panel (wraps centered under it on mobile) with the sweep rotating ~4s; **no horizontal overflow at 390px**; eyebrow ≥ 14px and ≥ 4.5:1 on the scrim band; Option-C badge/tagline/label/date classes gone; belonging message "▸ TU CREW YA SE ESTÁ FORMANDO AQUÍ." (CSS-uppercased) sits between the panel and the CTAs, centered, no collision with the radar dial (bottom-right) or the CTA row.
- [ ] Hero background video (PR4): **desktop 16:9** plays the muted loop (`hero-16x9.mp4`) with the AVIF poster visible before load; **mobile 9:16** plays `hero-9x16.mp4` object-covered (720×1280); no double-image flash between the `<picture>` still and the video start (same art family); the video scales with the art under the GSAP scrub (inside `#hero-art`); Network shows the AVIF poster/preload as LCP and the mp4 loading after (`preload="none"`); **no audio track** in either mp4 (ffprobe `-select_streams a` = empty); **reduced-motion**: video `display: none`, still `<picture>` shows, zero autoplay attempt; LCP still ≤ 2.5s on throttled 4G (video never blocks LCP).
- [ ] Visual polish (PR3 polish slice + PR4 HUD): hero wordmark "GTA VI" fits on ONE line at every breakpoint (no wrap/clip — `clamp(4rem,14vw,12rem)` + `whitespace-nowrap` + `tracking-tight`); letters legible via the solid Vice gradient fill — NO text-stroke/shadow (`.wordmark-legibility` utility exists but is NOT applied; official GTA landing uses zero shadows); `#hero-scrim` (center band + edge vignette + top/bottom darkening) keeps the text block readable over the art; hero cue renders as a ~3rem horizontal bar (not a 1px collapsed hairline); section headings use the `.heading-sweep` gradient + `data-reveal` (`.text-vice-gradient` static fallback class applied alongside); body glows on the desaturated sunset→magenta→purple-deep axis; DiscordCTA border sheen animates (`border-sheen` on the `p-px` wrapper, `data-reveal` moved to the inner panel so the two animations don't collide).
- [ ] Countdown digit change animates transform/opacity only (DevTools inspect during tick — `key={`${cell.key}-${values[cell.key]}`}` remount replays `digit-tick`); no width change → no CLS; digits + separators render in **Geist Mono** (PR3 + PR4 D3).
- [ ] Mobile/iOS viewport: no `background-attachment: fixed`, orbs ≤ 40px blur.
- [ ] Disclosure copy visible next to the hardware selector, contrast ≥ 4.5:1 (applied in hero-redesign batch — "Si compras a través de estos enlaces, Radar GTA recibe una comisión sin coste extra para ti."; affiliate anchors carry `rel="noopener noreferrer sponsored"`; URLs remain PLACEHOLDER until the commercial session).

## i18n

All string-bearing files modified by this change are flagged in the i18n inventory (explore §6) for Fase 1.5 extraction. **No extraction in this change** (ADR 0007); strings remain Spanish and unchanged.

## SEO

- `lang="es"` on `<html>`.
- Full metadata in `layout.tsx` (title, description, Open Graph).
- JSON-LD of type `Event` with the release date.
- A single `h1` and `header/main/section/footer` semantics.

## Note

The implementation files were generated in the current session and are validated with `npm run build` in `rg-web`. Database writes and affiliate tracking arrive in Fase 1.5 (`rg-api` + PostgreSQL, see `docs/technical/database.md` and `docs/technical/api-rg-api.md`).

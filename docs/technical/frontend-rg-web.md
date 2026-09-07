# Frontend — rg-web

**What:** MVP landing of the RadarGTA platform with a countdown to launch, affiliate hardware guide and crew directory.
**Why:** the business depends on organic traffic; server-side SEO, $0 cost and a DOM prepared for Fase 2 animations are required.
**Where:** `rg-web/` (App Router).
**How to verify:** `npm run build` in `rg-web` (no errors) and `npm run dev` for visual review.

## Stack

- Next.js **16.3.4** (App Router) + React **19.2.8** + TypeScript **5** + Tailwind **v4**.
- **Zero runtime dependencies in Fase 1:** only `next`, `react`, `react-dom`.

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
  - `.neon-glow-pink` / `.neon-glow-cyan` — neon glow.
  - `.glass-card` — glass-style card.
  - `.btn-primary` / `.btn-ghost` — buttons.
  - `@keyframes neon-pulse` / `float-glow` — micro-interactions.
  - `@media (prefers-reduced-motion: reduce)` block that disables animations.

## SEO

- `lang="es"` on `<html>`.
- Full metadata in `layout.tsx` (title, description, Open Graph).
- JSON-LD of type `Event` with the release date.
- A single `h1` and `header/main/section/footer` semantics.

## Note

The implementation files were generated in the current session and are validated with `npm run build` in `rg-web`. Database writes and affiliate tracking arrive in Fase 1.5 (`rg-api` + PostgreSQL, see `docs/technical/database.md` and `docs/technical/api-rg-api.md`).

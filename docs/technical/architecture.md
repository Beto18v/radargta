# General Architecture of the radargta Monorepo

## Repositories

| Repo              | Role                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `radargta` (root) | Orchestration and business; not a git repo; contains the two child repos. |
| `rg-web`          | Next.js frontend (App Router).                                            |
| `rg-api`          | FastAPI backend (skeleton in Fase 1; implementation in Fase 1.5).         |

## Data flow

```
User
   │
   ▼
rg-web (Next.js)
   Server Components (SEO)  +  Client Components (interactivity)
   │
   ▼
app/api/crews (Route Handler — validation seam)
   │  HTTP POST/GET (JSON)
   ▼
rg-api (FastAPI — Fase 1.5)
   │
   ▼
PostgreSQL (existing Hetzner VPS or free Supabase)
```

The user interacts with `rg-web`; server components deliver SEO-indexable HTML and client components handle interactivity (countdown, form, grid). The crew form does not write directly to the database: it goes through the `app/api/crews/route.ts` route handler (seam), which validates the data on the frontend and forwards it to `rg-api` via `CREWS_API_URL` (default `http://localhost:8000/api/crews`).

## Principles

1. **Server-side SEO:** all indexable content is rendered on the server (Server Components + JSON-LD).
2. **$0 cost:** deployment on Vercel free tier; database on the existing Hetzner VPS or free Supabase; the only fixed expense is the domain (~$10 USD/year).
3. **Zero runtime dependencies in Fase 1:** only `next`, `react`, `react-dom` in production; animations are added in Fase 2.
4. **DOM prepared for Fase 2 animations:** the landing is structured for the Rockstar-style scroll mask — `CSS mask-image` + `mask-size` with `clamp()` + GSAP/ScrollTrigger/Lenis — without coupling it yet.

## Roadmap

| Phase        | Scope                                                                                | Status          |
| ------------ | ------------------------------------------------------------------------------------ | --------------- |
| **Fase 1**   | MVP landing (countdown, affiliate hardware, crew registration/form, grid with seed). | **In progress** |
| **Fase 1.5** | `rg-api` (FastAPI) + PostgreSQL + affiliate tracking (`hardware_clicks`).            | Pending         |
| **Fase 2**   | Video pipeline (Python/FFmpeg, TTS, subtitles) + advanced scroll animations.         | Pending         |
| **Fase 3**   | Interactive map + AI copilot (semantic cache + pgvector + LLM).                      | Pending         |

## Contract between repos

- `rg-api` will expose `POST/GET /api/crews` (see `docs/technical/api-rg-api.md`).
- `rg-web` forwards via its `/api/crews` route handler (validation seam) to `rg-api`.

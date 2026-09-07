# ADR 0002 — Fase 1 frontend stack

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The business depends on organic traffic, so server-side SEO is a non-negotiable requirement.
- Alternatives evaluated:
  - **Vite SPA:** good DX but **poor SEO** (client-side rendering), unacceptable for a project that lives off organic discovery.
  - **Astro:** good SEO, but **less suited to the project's future interactivity** (crew directory, interactive map, AI copilot).
  - **Remix:** viable, but with no advantage over Next.js for this already-started stack.
- `rg-web` had already started development with Next.js 16 App Router.

## Decision

- Continue with **Next.js 16 App Router + React 19 + Tailwind v4** (already started in `rg-web`).
- **Zero runtime dependencies in Fase 1** (only `next`, `react`, `react-dom`).
- **Fase 2** will add GSAP/ScrollTrigger/Lenis for the Rockstar-style scroll mask (`CSS mask-image` + `mask-size` with `clamp()`), without coupling it in Fase 1.

## Consequences

- **Native server-side SEO** (Server Components + JSON-LD).
- **Vercel free tier deployment** ($0 cost).
- **Reasonable build latency** on the MVP.
- **Zero debt when scaling to Fases 2-3**: the landing DOM is already prepared for the animations and for the directory/map/AI without rewrites.

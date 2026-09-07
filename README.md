# Radar GTA — GTA 6 Community Platform

**Spanish-first community hub and crew recruitment directory for GTA 6** — live countdown to launch, a filterable crew registry, hardware preparation guides, and Discord community onboarding.

> Status: Fase 1 (MVP) — landing implemented and validated (`npm run build` clean). Backend in progress.

## What's inside

| Directory | Description |
|---|---|
| `rg-web/` | Next.js 16 (App Router) + React 19 + Tailwind CSS v4 — server-rendered landing with a client-side countdown, crew registration form + filterable grid, hardware affiliate cards, SEO metadata + JSON-LD. |
| `rg-api/` | FastAPI backend (in progress) — crew registration + directory API, PostgreSQL. |
| `docs/` | Technical documentation and Architecture Decision Records (ADRs). |

## Highlights

- **SEO-first**: server components, Spanish metadata, JSON-LD Event for the launch date, semantic HTML.
- **Zero-dependency MVP**: countdown, filters and UI effects with React + CSS only; GSAP/ScrollTrigger planned for scroll-mask animations (Rockstar-style) in Fase 2.
- **Clean seams**: the frontend submits crews through a validated route handler that forwards to the backend — swap the transport without touching the UI.
- **Design system**: Vice City / Leonida neon palette on an ultra-dark background, condensed display type (Anton), gradient text and glow utilities.
- **Documented decisions**: every architectural choice is recorded as an ADR in `docs/decisions/`.

## Getting started

```bash
cd rg-web
npm install
npm run dev
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · FastAPI (planned) · PostgreSQL (planned)

## Disclaimer

Fan project — not affiliated with Rockstar Games or Take-Two Interactive.
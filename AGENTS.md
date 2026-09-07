# AGENTS.md — Radar GTA (radargta)

Instructions for AI agents working in this monorepo.

## Project

Radar GTA: Spanish-first GTA 6 community platform (landing + crew directory + content pipeline). Monorepo:

- `rg-web/` — Next.js 16 (App Router) + React 19 + Tailwind v4 (public).
- `rg-api/` — FastAPI backend, in progress (public).
- `docs/` — technical docs + ADRs (public, English).

## Repositories & visibility

- `radargta` — **public**. Code + technical docs + ADRs. Language: **English**.
- `radargta-business` — **private**. Business strategy in **Spanish** (`vision.md`, `business/`). Never push business content to the public repo. See ADR 0008.

## Memory (Engram)

- Every observation is saved under the single project **`radargta`** (`.engram/config.json` pins it in every repo, including `radargta-business`).
- topic_key format: `<repo>/<category>/<slug>` where repo ∈ `rg-web | rg-api | docs | root | business`.
- Content must include the `Repo:` field. Save proactively after decisions, fixes, and discoveries.

## Documentation

- Every decision → ADR in `docs/decisions/XXXX-title.md` (Status / Context / Decision / Consequences), sequential numbering.
- Every implementation → `docs/technical/<repo>.md` (what / why / where / how to verify).
- Public docs in English; the private business repo (vision, funnel, monetization) stays in Spanish.

## Git

- **Conventional Commits only** (ADR 0004): `type(scope): description`.
  - Types: `feat | fix | docs | refactor | perf | test | build | ci | chore | revert`.
  - Scopes: `rg-web | rg-api | docs | root | business`.
- One commit = one work unit with its tests/docs. No `Co-Authored-By`, no AI attribution, no emojis.
- Never commit secrets or `.env`.

## Quality gates

- Before committing, always run the service checks and confirm they pass:
  - `rg-web`: `npm run lint` and `npm run build` (run from `rg-web/`).
  - `rg-api`: `uv run pytest` (once tests exist, Fase 1.5).
- Never commit code that fails lint or build. If a lint rule is a false positive, justify it with an inline `eslint-disable` comment.

## Stack notes

- `rg-web` runs **Next.js 16 with breaking changes** — read the local guides in `node_modules/next/dist/docs/` before writing code (see `rg-web/AGENTS.md`).
- Zero-dependency policy for Fase 1 runtime (`next`, `react`, `react-dom` only).
- `rg-api` targets FastAPI + SQLAlchemy + Alembic + PostgreSQL (contract: `docs/technical/api-rg-api.md`).

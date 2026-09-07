# RadarGTA — Documentation

Master index of the **radargta** monorepo: a Spanish-first GTA 6 community platform (web hub + crew recruitment directory + content pipeline).

> **Business strategy lives in the private repository `radargta-business`** (Spanish): product vision, funnel, monetization. This public repo contains code + technical documentation only.

## Structure of docs/

| Path | Description |
|---|---|
| `technical/` | Implementation and architecture documentation per repository. |
| `decisions/` | Architecture Decision Records (ADRs), sequentially numbered. |

### technical/

| File | Description |
|---|---|
| `architecture.md` | General monorepo architecture, data flow, principles and roadmap. |
| `frontend-rg-web.md` | `rg-web` (Next.js) implementation: stack, components, lib/, design system and SEO. |
| `database.md` | PostgreSQL schema (Fase 1.5): full DDL and design decisions. |
| `api-rg-api.md` | Planned `rg-api` API contract (FastAPI, Fase 1.5). |

### decisions/

| File | Description |
|---|---|
| `0001-project-memory-radargta.md` | Engram configured as shared memory under the "radargta" project. |
| `0002-frontend-stack-fase1.md` | Next.js 16 App Router + React 19 + Tailwind v4 chosen for the frontend. |
| `0003-docs-organization.md` | Mandatory documentation structure under `/docs`. |
| `0004-commit-convention.md` | Conventional Commits: types, scopes and commit message rules. |
| `0005-semantic-release-versioning.md` | Semantic-release versioning for rg-api (Fase 1.5+). |
| `0006-project-language-english.md` | Project language: English for docs & code (with private-repo exception). |
| `0007-community-i18n-strategy.md` | Community & i18n strategy: Spanish-first, i18n-ready. |
| `0008-public-repo-content-policy.md` | What is public vs private; business docs live in `radargta-business`. |

## Conventions

1. **Every technical or business decision** is recorded as an ADR in `docs/decisions/XXXX-title.md` with `Status / Context / Decision / Consequences` and sequential numbering.
2. **Every implementation** is documented in `docs/technical/<repository>.md` following the **what / why / where / how to verify** convention.
3. **Documentation language:** English for this public repo. `docs/` is tracked in the monorepo (not ignored).
4. **Business strategy is private**: vision, funnel and monetization live in the private `radargta-business` repo (Spanish) and are kept in sync from the `radargta` umbrella (see ADR 0008).
5. **Monorepo repositories:**
   - `rg-web` — frontend (Next.js).
   - `rg-api` — backend (FastAPI).
   - `radargta` (root) — orchestration, code and technical docs (public).
   - `radargta-business` — business strategy (private, Spanish).
6. **Current status:** Fase 1 MVP in progress (`rg-web` landing implemented and validated with `npm run build`).
7. **Quality gates:** `npm run lint` and `npm run build` must pass in `rg-web` before committing (equivalent checks for `rg-api` once tests exist). Never commit failing code.

## How to add a decision

1. Copy the format from an existing ADR.
2. Number the file sequentially after the latest ADR (`XXXX-title.md`).
3. Fill in `Status`, `Context`, `Decision` and `Consequences`.
4. Add a row to the `decisions/` table in this index.
# ADR 0003 — Documentation organization

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The user asked that **every implementation and every decision be documented** in `/docs`, both technical and business.
- Goal: scale the project (Fases 1.5, 2 and 3) **without accumulating technical debt or loss of context** for future agents/sessions.

## Decision

- Create the `docs/` structure with:
  - `business/` — business topics (funnel, monetization).
  - `technical/` — per-repository implementations (`<repository>.md`) with the **what / why / where / how to verify** convention.
  - `decisions/` — sequentially numbered ADRs (`XXXX-title.md`) with the **Status / Context / Decision / Consequences** format.
- The **original vision lives in `gta6.md` and is NOT modified**; refinements go in `business/` and `technical/`.
- **Documentation language: Spanish.**

## Consequences

- **Full traceability** of business and software (decisions traceable to their ADR).
- **Fast onboarding** for future agents/sessions via `docs/README.md` (index + conventions).
- Immutable rule: the original vision (`gta6.md`) stays intact as the initial source of truth.

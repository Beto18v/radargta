# ADR 0005 — Semantic-release versioning for rg-api

- **Status:** Accepted (implementation deferred to Fase 1.5)
- **Date:** 2026-09-06

## Context

- The project aims to automate as much as possible. Conventional Commits (ADR 0004) are already the commit convention.
- `rg-web` deploys on every push via Vercel — per-commit deploys make repo-level versioning unnecessary for the frontend.
- `rg-api` will expose a public contract (`docs/technical/api-rg-api.md`). Once the frontend consumes it, consumers need SemVer guarantees.

## Decision

- Adopt **semantic-release** (or release-please as a lighter alternative) for `rg-api` when the API contract reaches a stable point (target: Fase 1.5+).
- Start at **v0.1.0** during contract development; jump to **v1.0.0** when the contract is declared stable.
- `rg-web` stays unversioned (Vercel deploys by commit).
- Until then: no tooling added — Conventional Commits keep the door open.

## Consequences

- Automated changelog, tags, and GitHub releases driven by Conventional Commits (push to `main` → release).
- Zero manual versioning overhead when the API ships.
- No added complexity during Fase 1.

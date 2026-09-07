# ADR 0004 — Commit convention (Conventional Commits)

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The project uses git and needs a readable, auditable history traceable to decisions (`docs/decisions/`) and issues.
- The user already uses Conventional Commits (`feat`, `fix`, etc.) and wants the convention formally documented.
- The project's `AGENTS.md` requires: conventional commits only and **no** `Co-Authored-By` or AI attribution in commits.

## Decision

- **Format:** `type(scope): description` — description in English, imperative, ≤ 72 characters.
- **Types:** `feat` | `fix` | `docs` | `refactor` | `perf` | `test` | `build` | `ci` | `chore` | `revert`.
- **Scopes:** `rg-web` | `rg-api` | `docs` | `root` (or functional domain: `crews`, `hardware`, etc.).
- **One commit = one deliverable work unit** (work-unit commits), with its tests and docs included in the same commit when applicable.
- **Body** when the _why_ is not obvious; **footer** for references (`Closes #N`).
- **Forbidden:** emojis in the subject, `Co-Authored-By`, AI attribution, empty commits.
- **`BREAKING CHANGE`** is marked in the commit footer when the change breaks contracts.
- **Quality gate:** `npm run lint` + `npm run build` (`rg-web`) must pass before committing; inline `eslint-disable` only with justification.

## Consequences

- Readable, auditable history, traceable to ADRs and issues.
- Enables **automated changelog and semver versioning** (`semantic-release`) in the future, once `rg-api` has a stable API.
- Cost: initial discipline when writing commit messages.

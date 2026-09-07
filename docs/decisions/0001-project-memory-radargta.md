# ADR 0001 — Shared memory of the radargta project

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The `radargta` root is not a git repo and contains two repos that touch each other: `rg-web` (frontend) and `rg-api` (backend).
- Orchestration is done from the root, but the session can be opened from any `cwd` (root, `rg-web` or `rg-api`).
- The user requested **shared memory under the "radargta" project** with an identifier per repo, so that observations from all repos stay under one umbrella project and are traceable by origin repo.

## Decision

- Create `.engram/config.json` with `{"project_name": "radargta"}` in **three locations**: root, `rg-web` and `rg-api`.
- Every Engram observation is saved under the **radargta** project, with the repo identifier in `topic_key` in the `<repo>/<category>/<slug>` format, where `repo ∈ { rg-web | rg-api | docs | root }`, and a `Repo` field in the observation's `content`.

## Consequences

- **Shared memory** between repos: any session opened from the root, `rg-web` or `rg-api` resolves to the same project.
- **Per-repo traceability** thanks to the `topic_key` and the `Repo` field on each observation.
- **`.engram/` is added to `.gitignore`** of both repos so the local configuration is not versioned.
- **Deterministic project detection** from any `cwd` in the monorepo.

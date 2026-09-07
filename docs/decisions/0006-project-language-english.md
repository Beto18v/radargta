# ADR 0006 — Project language: English (docs & code)

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- Docs and code were initially written in Spanish. The user decided all documentation and code should be in English.
- The only Spanish-facing surface is the **UI text**, which will be handled by an i18n layer (Spanish + English) — see pending ADR for the community language strategy.

## Decision

- All documentation (`docs/`), code, and code comments in **English**. Exception: the private business repo `radargta-business` stays in **Spanish** for fast reading (see ADR 0008).
- UI text stays **Spanish** for the MVP (channel language) but must be centralized/extracted for i18n before adding English.
- The original vision document was moved to the private repo `radargta-business` and renamed **`vision.md`** (Spanish) — see ADR 0008.

## Consequences

- Consistent, globally readable docs and code; faster onboarding for collaborators and agents.
- One translation pass for docs (in progress).
- UI i18n migration later becomes a mechanical task instead of a rewrite.

# ADR 0008 — Public repository content policy

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The `radargta` repo is **public** — its portfolio value is engineering quality (architecture, ADRs, technical docs).
- The business blueprint (vision, funnel, monetization figures, channel strategy, pricing of future paid features) is competitive information that must not be public.
- The user confirmed the split, and that the private business repo should be written in **Spanish** for faster reading.

## Decision

- **Public (`radargta`)**: code (`rg-web`, `rg-api`), `docs/technical/`, `docs/decisions/`, root `README.md` (public overview), root `AGENTS.md` — language **English**.
- **Private (`radargta-business`)**: product vision (`vision.md`), `business/` (funnel, monetization), any future strategy/metrics — language **Spanish** (fast reading).
- **Rule**: sensitive business content is never pushed to the public repo. The private repo is the single source for business docs.
- **Sync**: Engram memory stays under the single `radargta` project; business observations use the `business` repo identifier (`topic_key = business/<category>/<slug>`) so both sides stay in sync.
- Repo visibility: `radargta` **public**, `radargta-business` **private** (GitHub).

## Consequences

- Portfolio value without leaking business strategy.
- Business docs remain versioned and backed up in the private repo.
- Language split: public English, private Spanish — consistent and readable on each side.

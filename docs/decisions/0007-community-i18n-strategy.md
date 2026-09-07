# ADR 0007 — Community & i18n strategy (Spanish-first)

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

- The acquisition funnel (TikTok / YouTube Shorts) is produced in **Spanish**.
- The first monetization phase targets LATAM / Spain affiliates (MercadoLibre).
- The English GTA market is saturated; Spanish SEO has far less competition.
- The product is a Spanish-language community platform; the user confirmed Spanish-first.

## Decision

- **Product / UI language: Spanish-first** for the MVP; the acquisition channel is Spanish.
- **i18n-ready architecture**: UI strings must be centralized (extracted from components) so adding English (or PT-BR) later is a content task, not a refactor.
- **Do NOT implement a full i18n framework in Fase 1** (YAGNI); extract strings into a single dictionary during Fase 1.5.
- **English / general community is a future expansion phase** requiring an English content pipeline — not planned for Fase 1.

## Consequences

- Conversion matches the Spanish funnel; early SEO wins in the less competitive Spanish market.
- i18n migration later is mechanical instead of a rewrite.
- English expansion is deferred until the Spanish channel validates and revenue starts.

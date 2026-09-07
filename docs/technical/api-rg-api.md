# API — rg-api (FastAPI)

**What:** planned contract of the `rg-api` backend.
**Why:** persist crews in PostgreSQL and expose the public listing/detail with moderation.
**Where:** `rg-api/` ("hello world" `main.py` skeleton); **implementation is Fase 1.5** — this document is the target contract, not yet implemented.
**How to verify:** once implemented, `uv run uvicorn main:app` and HTTP tests against the endpoints.

## POST /api/crews

- **Payload:** `name`, `tagline`, `logoUrl`, `platform`, `region`, `playstyle`, `discordUrl`, `whatsappUrl`, `memberCount`.
- The **`slug` is generated server-side** from `name` (normalized, without accents, hyphenated).
- **Response:** `201` with the created crew (`status: PENDING`).
- **Errors:** `400`/`422` with `{ ok: false, error }`.

## GET /api/crews

- **Query params:** `platform`, `region`, `playstyle`, `q` (name search via `pg_trgm`), `limit`, `offset`.
- **Paginated listing**, only `status = 'APPROVED'` rows, ordered by `created_at DESC`.

## GET /api/crews/{slug}

- Public detail of a crew by slug.

## Error format

All errors follow the same contract:

```json
{ "ok": false, "error": "string" }
```

## Note on the `rg-web` seam

`rg-web` already has `app/api/crews/route.ts` (seam): it validates the payload on the frontend (name 3-80 chars, http/https URLs, enums, `memberCount` 1-10000, local slug) and forwards to `CREWS_API_URL` (default `http://localhost:8000/api/crews`). If `rg-api` does not respond, the route handler returns `503 { ok:false, error:"SERVICIO_NO_DISPONIBLE" }`.

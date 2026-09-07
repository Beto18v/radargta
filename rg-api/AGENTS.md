# AGENTS.md — rg-api (FastAPI)

Instructions for AI agents working in this service.

## Service

`rg-api` — FastAPI backend for the Radar GTA platform. Currently a skeleton (`main.py` hello world). Target (Fase 1.5): crew registration + directory API, SQLAlchemy + Alembic + PostgreSQL. Contract: `docs/technical/api-rg-api.md` in the parent repo.

## Rules

- Python 3.12+, managed with **uv** (see `pyproject.toml` + `uv.lock`).
- Endpoints: `POST /api/crews`, `GET /api/crews` (filters, paginated), `GET /api/crews/{slug}`. Errors: `{ ok: false, error }`.
- Conventional Commits with scope `rg-api` (see root AGENTS.md).
- Memory (Engram): everything lives under the `radargta` project; topic_key `rg-api/<category>/<slug>`.
- **Never** import or reference business content from the private `radargta-business` repo into this public repo.
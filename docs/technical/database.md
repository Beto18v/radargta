# Database — PostgreSQL Schema

**What:** data model for the crew directory and affiliate metrics.
**Why:** persist crews with pre-launch moderation and measure affiliate clicks to validate monetization.
**Where:** implementation in **Fase 1.5**, when `rg-api` has a database (PostgreSQL on the existing Hetzner VPS or free Supabase).
**How to verify:** run the DDL on a PostgreSQL instance (applies with `rg-api` in Fase 1.5).

## Full DDL

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$ BEGIN CREATE TYPE crew_platform AS ENUM ('PS5','XBOX_SERIES','CROSSPLAY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE crew_region AS ENUM ('LATAM','ESPANA','INTERNACIONAL'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE crew_playstyle AS ENUM ('COMPETITIVO','HEISTS_GOLPES','CASUAL','ROLEPLAY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE crew_status AS ENUM ('PENDING','APPROVED','REJECTED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  tagline VARCHAR(160),
  description TEXT,
  logo_url VARCHAR(500),
  platform crew_platform NOT NULL,
  region crew_region NOT NULL DEFAULT 'LATAM',
  language VARCHAR(2) NOT NULL DEFAULT 'es',
  playstyle crew_playstyle NOT NULL,
  discord_url VARCHAR(500),
  whatsapp_url VARCHAR(500),
  member_count_estimated INTEGER NOT NULL DEFAULT 1 CHECK (member_count_estimated BETWEEN 1 AND 10000),
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status crew_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crews_platform ON crews (platform);
CREATE INDEX IF NOT EXISTS idx_crews_region ON crews (region);
CREATE INDEX IF NOT EXISTS idx_crews_playstyle ON crews (playstyle);
CREATE INDEX IF NOT EXISTS idx_crews_status ON crews (status) WHERE status = 'APPROVED';
CREATE INDEX IF NOT EXISTS idx_crews_featured ON crews (is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_crews_created ON crews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crews_name_trgm ON crews USING gin (name gin_trgm_ops);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_crews_updated ON crews;
CREATE TRIGGER trg_crews_updated BEFORE UPDATE ON crews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS hardware_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_key VARCHAR(80) NOT NULL,
  item_name VARCHAR(120) NOT NULL,
  target_url TEXT NOT NULL,
  referrer VARCHAR(120),
  session_id VARCHAR(64),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hw_clicks_item ON hardware_clicks (item_key, clicked_at DESC);
```

## Design decisions

- **Enums for integrity:** `platform`, `region`, `playstyle` and `status` use ENUM types to prevent invalid values at the database level (not just at the API level).
- **UNIQUE `slug`:** guarantees clean, stable public routes in `/crews/[slug]`; the slug is generated server-side from `name`.
- **Pre-launch moderation:** `status` with `PENDING`/`APPROVED`/`REJECTED` values. New crews are born `PENDING` and **the public grid only shows `APPROVED`** (the partial index `idx_crews_status` supports that filter). `is_featured` and `is_verified` are independent featured/verified flags.
- **Filtering indexes:** indexes on `platform`, `region`, `playstyle` (listing filters), `created_at DESC` (ordering) and partial indexes for `status='APPROVED'` and `is_featured`.
- **Name search with `pg_trgm`:** GIN trigram index on `name` for the fuzzy search `q` parameter.
- **`hardware_clicks`:** affiliate metrics table (item, target URL, referrer and `session_id`); enables measuring clicks per item and per session without third-party cookies.
- **`updated_at` trigger:** `set_updated_at()` keeps `updated_at` automatically updated on every UPDATE.

## Supabase alternative

Same relational model + **RLS (Row Level Security)**: anonymous read only for `status = 'APPROVED'` rows; write/read restricted by admin/moderation role. Advantage: auth and moderation panel ready to use; disadvantage: less hosting control compared to the existing Hetzner VPS.

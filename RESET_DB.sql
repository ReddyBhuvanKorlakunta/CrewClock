-- ============================================================
-- CrewClock — RESET DATABASE
-- Run this in Neon SQL Editor ONCE to wipe old tables.
-- Then run: pnpm --filter @crewclock/db push
-- ============================================================

-- Step 1: Enable pgvector (required for AI embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Drop all tables and enums cleanly
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
  FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace) LOOP
    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
  END LOOP;
END $$;

-- Step 3: Verify (should return 0 rows)
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

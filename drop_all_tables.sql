-- Run this in Neon SQL Editor to reset the database
-- Then re-run: pnpm --filter @crewclock/db push

DO $$ DECLARE
  r RECORD;
BEGIN
  -- Drop all tables in the public schema
  FOR r IN (
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  ) LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;

  -- Drop all enums
  FOR r IN (
    SELECT typname FROM pg_type
    WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace
  ) LOOP
    EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
  END LOOP;
END $$;

-- Confirm everything is gone
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

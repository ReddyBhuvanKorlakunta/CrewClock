-- Custom SQL migration file, put your code below! --

-- ─── Cross-schema FK to Supabase Auth ─────────────────────────────────────────
-- Drizzle's schema DSL can't express a FK into a schema it doesn't own
-- (auth.users lives in Supabase's own "auth" schema). This is a safety net,
-- not the primary delete path — our own soft-delete flow (users.account_status)
-- is what normally handles account deletion, not deleting the auth.users row.
ALTER TABLE "users" ADD CONSTRAINT "users_auth_user_id_auth_users_fk"
  FOREIGN KEY ("auth_user_id") REFERENCES auth.users(id) ON DELETE CASCADE;

-- ─── Emergency contact reachability check ─────────────────────────────────────
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "contact_has_reachable"
  CHECK (phone IS NOT NULL OR email IS NOT NULL);

-- ─── Row Level Security ────────────────────────────────────────────────────────
-- Enabled on every table per SYSTEM_DESIGN.md §6.1, as defense-in-depth for
-- Supabase's PostgREST/Realtime layer. This app talks to Postgres directly via
-- Drizzle using the database's own connection role (bypasses RLS if that role
-- is a superuser/service role) — verify which role DATABASE_URL connects as
-- before assuming these policies are either a real gate or a no-op.
--
-- Only a blanket service-role-bypass policy is added here. Fine-grained
-- per-tenant isolation policies (e.g. "members can only see rows for their own
-- tenant_id") are NOT included in this migration — they're a follow-up task,
-- not implied as done by enabling RLS alone.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'tenants', 'tenant_memberships', 'users', 'availability', 'employee_skills',
    'employees', 'roles', 'skill_definitions', 'locations', 'open_shift_enrollments',
    'shift_assignments', 'shift_swaps', 'shifts', 'clock_events', 'pay_periods',
    'payroll_runs', 'timecards', 'leave_categories', 'leave_requests',
    'channel_members', 'channels', 'messages', 'notification_preferences',
    'ai_conversations', 'ai_documents', 'ai_embeddings', 'ai_messages',
    'audit_logs', 'alert_events', 'check_in_logs', 'emergency_contacts',
    'user_preferences'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format(
      'CREATE POLICY "service_role_bypass" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;

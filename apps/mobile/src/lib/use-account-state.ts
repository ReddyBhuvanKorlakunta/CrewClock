import { useAuth } from "./auth-context";
import { trpc } from "./trpc";

// The single source of truth for account-lifecycle routing (mirrors the web
// middleware's gating) — no session, unverified, soft_deleted, active-without-
// onboarding, and active-with-onboarding are the only states callers need.
export function useAccountState() {
  const { session, loading: sessionLoading } = useAuth();
  const { data: user, isLoading: userLoading } = trpc.account.getCurrent.useQuery(undefined, {
    enabled: !!session,
  });

  return {
    loading: sessionLoading || (!!session && userLoading),
    session,
    accountStatus: user?.accountStatus ?? null,
    onboardingCompleted: user?.onboardingCompleted ?? false,
  };
}

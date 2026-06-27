/**
 * tRPC client setup for use in non-React contexts (e.g. server actions, scripts).
 * React apps should use the trpc-provider instead.
 */
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "./index";

export function createApiClient(baseUrl: string) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        transformer: superjson,
      }),
    ],
  });
}

export type { AppRouter };

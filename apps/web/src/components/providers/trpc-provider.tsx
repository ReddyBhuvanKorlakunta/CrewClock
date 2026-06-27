"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "@crewclock/api";

// ReturnType annotation prevents "inferred type cannot be named" TS error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpc = createTRPCReact<AppRouter>() as ReturnType<typeof createTRPCReact<AppRouter>>;

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({ enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error) }),
        httpBatchStreamLink({ url: "/api/trpc", transformer: superjson }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

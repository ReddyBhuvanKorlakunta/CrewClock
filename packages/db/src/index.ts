import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// ─── Lazy initialization ────────────────────────────────────────────────────
// postgres() opens a connection lazily on first query, but we still defer
// construction until first use to avoid crashing Next.js during its build-time
// "Collecting page data" phase if DATABASE_URL is undefined at that point.
// Proxies defer initialization until the first real DB query at runtime.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: { sql: any; db: any } | undefined;

function getInstance() {
  if (!_instance) {
    // prepare: false is required when connecting through Supabase's pooled
    // (pgbouncer, transaction-mode) connection string — prepared statements
    // aren't supported in that mode.
    const client = postgres(process.env.DATABASE_URL!, { prepare: false });
    _instance = { sql: client, db: drizzle(client, { schema }) };
  }
  return _instance;
}

// Typed aliases for callers
type PostgresSql = ReturnType<typeof postgres>;
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

// db proxy — all property accesses delegate to the lazy drizzle instance
export const db = new Proxy({} as DrizzleDb, {
  get(_t, prop, receiver) {
    return Reflect.get(getInstance().db, prop, receiver);
  },
});

// sql proxy — postgres-js tagged template literal is callable + has properties
const _sqlFn = ((...args: Parameters<PostgresSql>) => getInstance().sql(...args)) as PostgresSql;
export const sql: PostgresSql = new Proxy(_sqlFn, {
  get(_t, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return prop in _t ? (_t as any)[prop] : (getInstance().sql as any)[prop];
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply(_t, thisArg, args) { return getInstance().sql.apply(thisArg, args as any); },
});

export * from "./schema";
export type { DB } from "./types";

// Re-export drizzle-orm helpers so other packages don't need drizzle-orm as a direct dep
export { eq, and, or, desc, asc, gte, lte, gt, lt, ne, inArray, isNull, isNotNull, sql as sqlExpr } from "drizzle-orm";

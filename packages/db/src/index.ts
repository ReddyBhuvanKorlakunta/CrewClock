import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// ─── Lazy initialization ────────────────────────────────────────────────────
// neon() throws immediately if DATABASE_URL is undefined, crashing Next.js
// during its build-time "Collecting page data" phase.
// Proxies defer initialization until the first real DB query at runtime.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: { sql: any; db: any } | undefined;

function getInstance() {
  if (!_instance) {
    const neonSql = neon(process.env.DATABASE_URL!);
    _instance = { sql: neonSql, db: drizzle(neonSql, { schema }) };
  }
  return _instance;
}

// Typed aliases for callers
type NeonSql = ReturnType<typeof neon>;
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

// db proxy — all property accesses delegate to the lazy drizzle instance
export const db = new Proxy({} as DrizzleDb, {
  get(_t, prop, receiver) {
    return Reflect.get(getInstance().db, prop, receiver);
  },
});

// sql proxy — neon tagged template literal is callable + has properties
const _sqlFn = ((...args: Parameters<NeonSql>) => getInstance().sql(...args)) as NeonSql;
export const sql: NeonSql = new Proxy(_sqlFn, {
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

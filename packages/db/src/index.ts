import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });

export * from "./schema";
export type { DB } from "./types";

// Re-export drizzle-orm helpers so apps don't need drizzle-orm as a direct dependency
export { eq, and, or, desc, asc, gte, lte, gt, lt, ne, inArray, isNull, isNotNull, sql as sqlExpr } from "drizzle-orm";

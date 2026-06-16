import postgres from "postgres";

const url = process.env.SUPABASE_DB_URL;
if (!url) throw new Error("SUPABASE_DB_URL is not set");

export const SCHEMA = process.env.DB_SCHEMA || "preg_companion";

// Reuse a single connection across hot reloads in dev.
const globalForDb = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };

export const sql =
  globalForDb._sql ??
  postgres(url, {
    // All app tables live in our dedicated schema, isolated from other apps on this instance.
    connection: { search_path: SCHEMA },
    ssl: "prefer",
    prepare: false,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb._sql = sql;

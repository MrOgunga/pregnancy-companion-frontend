import postgres from "postgres";

const url = process.env.SUPABASE_DB_URL;
if (!url) throw new Error("SUPABASE_DB_URL is not set");

export const SCHEMA = process.env.DB_SCHEMA || "preg_companion";

// Reuse a single connection across hot reloads in dev.
const globalForDb = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };

export const sql =
  globalForDb._sql ??
  postgres(url, {
    // App tables live in our dedicated schema (first). public + extensions are included
    // so the pgvector `vector` type resolves wherever the extension was installed.
    connection: { search_path: `${SCHEMA}, public, extensions` },
    ssl: "prefer",
    prepare: false,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForDb._sql = sql;

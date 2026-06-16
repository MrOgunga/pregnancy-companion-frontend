// Applies db/schema.sql to the configured Postgres. Run: npm run db:setup
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import postgres from "postgres";

// Load .env.local manually (no framework here).
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
try {
  const env = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL missing");
  process.exit(1);
}

const sql = postgres(url, { ssl: "prefer", prepare: false, max: 1 });
const ddl = readFileSync(join(root, "db", "schema.sql"), "utf8");

try {
  await sql.unsafe(ddl);
  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = ${process.env.DB_SCHEMA || "preg_companion"} order by table_name`;
  console.log("✓ Schema applied. Tables:", tables.map((t) => t.table_name).join(", "));
} catch (e) {
  console.error("✗ Setup failed:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}

import { sql } from "./db";
import { embed, embedOne, embeddingsConfigured, EMBED_DIM } from "./embeddings";

// Format a JS number[] as a pgvector literal.
function vec(nums: number[]): string {
  return `[${nums.join(",")}]`;
}

export async function ensureKb(): Promise<void> {
  await sql.unsafe(`create extension if not exists vector`);
  await sql.unsafe(
    `create table if not exists kb_chunks (
       id uuid primary key default gen_random_uuid(),
       title text, source text, content text not null,
       embedding vector(${EMBED_DIM}),
       created_at timestamptz not null default now()
     )`
  );
}

export type KbHit = { title: string | null; source: string | null; content: string; distance: number };

export async function retrieve(query: string, k = 4): Promise<KbHit[]> {
  if (!embeddingsConfigured()) return [];
  const e = vec(await embedOne(query, "query"));
  return sql<KbHit[]>`
    select title, source, content, (embedding <=> ${e}::vector) as distance
    from kb_chunks
    order by embedding <=> ${e}::vector
    limit ${k}`;
}

// Retrieval as a ready-to-inject grounding block (only keeps reasonably-close hits).
export async function groundingBlock(query: string, k = 4): Promise<string> {
  try {
    const hits = (await retrieve(query, k)).filter((h) => h.distance < 0.65);
    if (hits.length === 0) return "";
    return hits.map((h) => `- ${h.content}${h.source ? ` (${h.source})` : ""}`).join("\n");
  } catch {
    return "";
  }
}

export async function ingest(items: { title?: string; source?: string; content: string }[]): Promise<number> {
  if (items.length === 0) return 0;
  const embs = await embed(items.map((i) => i.content), "passage");
  for (let i = 0; i < items.length; i++) {
    await sql`insert into kb_chunks (title, source, content, embedding)
      values (${items[i].title ?? null}, ${items[i].source ?? null}, ${items[i].content}, ${vec(embs[i])}::vector)`;
  }
  return items.length;
}

export async function kbCount(): Promise<number> {
  const r = await sql<{ c: string }[]>`select count(*)::text as c from kb_chunks`;
  return Number(r[0]?.c || 0);
}

export async function clearKb(): Promise<void> {
  await sql.unsafe(`truncate table kb_chunks`);
}

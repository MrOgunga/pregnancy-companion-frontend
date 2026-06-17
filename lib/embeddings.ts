// NVIDIA NIM embeddings (OpenAI-compatible host, but called via fetch so we can pass
// NVIDIA's required `input_type`). nv-embedqa-e5-v5 → 1024-dim.
const BASE = (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/+$/, "");
const KEY = process.env.NVIDIA_API_KEY || "";
export const EMBED_MODEL = process.env.NVIDIA_EMBED_MODEL || "nvidia/nv-embedqa-e5-v5";
export const EMBED_DIM = 1024;

export function embeddingsConfigured(): boolean {
  return !!KEY;
}

export async function embed(texts: string[], inputType: "query" | "passage"): Promise<number[][]> {
  const res = await fetch(`${BASE}/embeddings`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: texts, model: EMBED_MODEL, input_type: inputType, encoding_format: "float", truncate: "END" }),
  });
  if (!res.ok) throw new Error(`embeddings HTTP ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data.map((d) => d.embedding);
}

export async function embedOne(text: string, inputType: "query" | "passage"): Promise<number[]> {
  return (await embed([text], inputType))[0];
}

// Hugging Face Inference — NLLB-200 translation to/from Nigerian languages.
// Used to translate the vetted KB so Library (Meili) search works in local languages.
const TOKEN = (process.env.HF_TOKEN || "").trim();
const MODEL = process.env.HF_TRANSLATE_MODEL || "facebook/nllb-200-distilled-600M";
// HF retired api-inference.huggingface.co; the router proxies the serverless providers.
// Override with HF_TRANSLATE_URL to point at a dedicated Inference Endpoint.
const BASE = (process.env.HF_TRANSLATE_URL || `https://router.huggingface.co/hf-inference/models/${MODEL}`).replace(/\/+$/, "");

export function hfConfigured(): boolean {
  return !!TOKEN;
}

// App language code → NLLB FLORES-200 code.
const NLLB: Record<string, string> = {
  en: "eng_Latn",
  yo: "yor_Latn",
  ha: "hau_Latn",
  ig: "ibo_Latn",
  pcm: "pcm_Latn",
};

export async function hfTranslate(text: string, target: string, source = "en"): Promise<string> {
  if (!hfConfigured() || !text.trim()) return text;
  const tgt = NLLB[target];
  const src = NLLB[source] || "eng_Latn";
  if (!tgt || tgt === src) return text;

  const res = await fetch(BASE, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: text, parameters: { src_lang: src, tgt_lang: tgt }, options: { wait_for_model: true } }),
  });
  if (!res.ok) throw new Error(`HF ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const data = (await res.json()) as Array<{ translation_text?: string }> | { translation_text?: string };
  if (Array.isArray(data)) return data[0]?.translation_text || text;
  return data.translation_text || text;
}

import type { Mother } from "./queries";

export type Prefs = { tone?: "warm" | "concise" | "detailed"; focus?: string[]; about?: string };

// Topics a mom can opt into (stored values are English; UI labels are translated).
export const FOCUS_TOPICS = [
  "Nutrition & meals",
  "Mental health",
  "Exercise & movement",
  "Baby development",
  "Labour & birth",
  "Money & budgeting",
  "Faith & culture",
  "Relationship & partner",
  "First-time worries",
];

export function getPrefs(m: Pick<Mother, "preferences">): Prefs {
  return (m.preferences || {}) as Prefs;
}

// Prompt snippet that personalises the AI to her stated preferences.
export function preferencesBlock(m: Pick<Mother, "preferences">): string {
  const p = getPrefs(m);
  const parts: string[] = [];
  if (p.about && p.about.trim()) parts.push(`What she told you about herself: ${p.about.trim()}`);
  if (p.focus && p.focus.length) parts.push(`Topics she cares most about: ${p.focus.join(", ")} — weave these in when relevant.`);
  if (p.tone === "concise") parts.push("She prefers very short, to-the-point answers.");
  else if (p.tone === "detailed") parts.push("She likes thorough, detailed explanations.");
  return parts.length ? `\nHER PREFERENCES (personalise for her, never override safety guidance):\n${parts.map((x) => `- ${x}`).join("\n")}` : "";
}

// Let her tone preference nudge response length.
export function toneMaxTokens(m: Pick<Mother, "preferences">, base: number): number {
  const tone = getPrefs(m).tone;
  if (tone === "concise") return Math.min(base, 300);
  if (tone === "detailed") return base + 350;
  return base;
}

// Sanitise incoming preferences before saving.
export function cleanPrefs(input: unknown): Prefs {
  const b = (input || {}) as Record<string, unknown>;
  const tone = ["warm", "concise", "detailed"].includes(String(b.tone)) ? (b.tone as Prefs["tone"]) : "warm";
  const focus = Array.isArray(b.focus) ? b.focus.map(String).filter((f) => FOCUS_TOPICS.includes(f)).slice(0, 9) : [];
  const about = String(b.about || "").trim().slice(0, 400);
  return { tone, focus, about };
}

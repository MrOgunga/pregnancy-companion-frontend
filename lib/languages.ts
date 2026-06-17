// Supported languages for Bumply (Nigeria-first). `pcm` = Nigerian Pidgin.
export type LangCode = "en" | "pcm" | "yo" | "ha" | "ig";

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "pcm", label: "Pidgin", native: "Pidgin" },
  { code: "yo", label: "Yoruba", native: "Yorùbá" },
  { code: "ha", label: "Hausa", native: "Hausa" },
  { code: "ig", label: "Igbo", native: "Igbo" },
];

export function isLang(x: unknown): x is LangCode {
  return typeof x === "string" && LANGUAGES.some((l) => l.code === x);
}

export function normalizeLang(x: unknown): LangCode {
  return isLang(x) ? x : "en";
}

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label || "English";
}

// Appended to AI prompts so the model replies in the mother's chosen language.
export function languageInstruction(code: string): string {
  switch (code) {
    case "pcm":
      return "IMPORTANT: Reply entirely in warm, natural Nigerian Pidgin English.";
    case "yo":
      return "IMPORTANT: Reply entirely in Yorùbá with correct tone marks. You may keep medical terms in English where there is no common Yorùbá word.";
    case "ha":
      return "IMPORTANT: Reply entirely in Hausa. You may keep medical terms in English where there is no common Hausa word.";
    case "ig":
      return "IMPORTANT: Reply entirely in Igbo. You may keep medical terms in English where there is no common Igbo word.";
    default:
      return "Reply in clear, warm English.";
  }
}

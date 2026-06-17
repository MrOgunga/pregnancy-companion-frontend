import { cookies } from "next/headers";
import { normalizeLang, type LangCode } from "./languages";

export const LANG_COOKIE = "bumply_lang";

// UI language for the current request — works for logged-out visitors too.
export async function getUiLang(): Promise<LangCode> {
  const c = await cookies();
  return normalizeLang(c.get(LANG_COOKIE)?.value);
}

import type { LangCode } from "./languages";

// UI string dictionary. Falls back to English for any missing translation, so
// partial coverage never shows blanks. Extend freely — AI-generated content
// (chat, weekly, WhatsApp) is already fully multilingual via languageInstruction().
type Dict = Record<string, Partial<Record<LangCode, string>> & { en: string }>;

const STRINGS: Dict = {
  // Nav
  "nav.dashboard": { en: "Home", pcm: "Home", yo: "Ilé", ha: "Gida", ig: "Ụlọ" },
  "nav.journal": { en: "Journal", pcm: "Journal", yo: "Ìwé Ìrántí", ha: "Littafi", ig: "Akwụkwọ" },
  "nav.tools": { en: "Tools", pcm: "Tools", yo: "Irinṣẹ́", ha: "Kayan Aiki", ig: "Ngwa" },
  "nav.chat": { en: "Chat", pcm: "Chat", yo: "Ìbánisọ̀rọ̀", ha: "Hira", ig: "Nkata" },
  "nav.account": { en: "Account", pcm: "Account", yo: "Àkántì", ha: "Asusu", ig: "Akaụntụ" },
  "nav.signout": { en: "Sign out", pcm: "Comot", yo: "Jáde", ha: "Fita", ig: "Pụọ" },

  // Dashboard
  "dash.journey": { en: "Your journey", pcm: "Your journey", yo: "Ìrìnàjò rẹ", ha: "Tafiyarki", ig: "Njem gị" },
  "dash.hello": { en: "Hello", pcm: "How far", yo: "Báwo", ha: "Sannu", ig: "Ndewo" },
  "dash.youarein": { en: "You're in", pcm: "You dey for", yo: "O wà ní", ha: "Kina cikin", ig: "Ị nọ na" },
  "dash.week": { en: "week", pcm: "week", yo: "ọ̀sẹ̀", ha: "mako", ig: "izu" },
  "dash.trimester": { en: "trimester", pcm: "trimester", yo: "ìpín", ha: "kashi", ig: "akụkụ" },
  "dash.weekstogo": { en: "weeks to go", pcm: "weeks remain", yo: "ọ̀sẹ̀ tó kù", ha: "makonni sun rage", ig: "izu fọdụrụ" },
  "dash.anyday": { en: "any day now! 🎉", pcm: "e fit be any day now! 🎉", yo: "ó lè jẹ́ ọjọ́ kankan báyìí! 🎉", ha: "kowace rana yanzu! 🎉", ig: "ọ bụla ụbọchị ugbu a! 🎉" },
  "dash.thisweek": { en: "This week", pcm: "This week", yo: "Ọ̀sẹ̀ yìí", ha: "Wannan makon", ig: "Izu a" },
  "dash.yourbabyis": { en: "Your baby is", pcm: "Your baby be", yo: "Ọmọ rẹ jẹ́", ha: "Jaririnki yana", ig: "Nwa gị bụ" },
  "dash.length": { en: "Length", pcm: "Length", yo: "Gígùn", ha: "Tsawo", ig: "Ogologo" },
  "dash.weight": { en: "Weight", pcm: "Weight", yo: "Ìwúwo", ha: "Nauyi", ig: "Ịdị arọ" },
  "dash.yourweeks": { en: "Your weeks", pcm: "Your weeks", yo: "Àwọn ọ̀sẹ̀ rẹ", ha: "Makonninki", ig: "Izu gị" },
  "dash.feeling": { en: "How are you feeling today?", pcm: "How you dey feel today?", yo: "Báwo lo ṣe rí lónìí?", ha: "Yaya kike ji yau?", ig: "Kedu ka ị na-eche taa?" },

  // Account / common
  "account.title": { en: "Account", pcm: "Account", yo: "Àkántì", ha: "Asusu", ig: "Akaụntụ" },
  "account.language": { en: "Language", pcm: "Language", yo: "Èdè", ha: "Harshe", ig: "Asụsụ" },
  "account.languageHelp": {
    en: "Bumply will chat and write to you in this language.",
    pcm: "Bumply go talk and write give you for dis language.",
    yo: "Bumply yóò bá ọ sọ̀rọ̀ yóò sì kọ̀wé sí ọ ní èdè yìí.",
    ha: "Bumply zai yi maki magana da rubutu da wannan harshe.",
    ig: "Bumply ga-akpọrọ gị ma deere gị n'asụsụ a.",
  },
  "common.save": { en: "Save", pcm: "Save", yo: "Fipamọ́", ha: "Ajiye", ig: "Chekwaa" },
  "common.saved": { en: "Saved", pcm: "Saved", yo: "A ti fipamọ́", ha: "An ajiye", ig: "Echekwala" },
};

export function t(key: string, lang: LangCode = "en"): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}

// Convenience: bind a language once -> tt("nav.chat")
export function translator(lang: LangCode) {
  return (key: string) => t(key, lang);
}

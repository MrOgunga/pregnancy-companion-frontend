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

  // Dashboard — extra strings
  "dash.openfull": { en: "Open full weekly page →", pcm: "Open full weekly page →", yo: "Ṣí ojú-ìwé ọ̀sẹ̀ kíkún →", ha: "Buɗe cikakken shafin mako →", ig: "Mepee peeji izu zuru ezu →" },
  "dash.askabout": { en: "Ask Bumply about this week", pcm: "Ask Bumply about dis week", yo: "Bi Bumply nípa ọ̀sẹ̀ yìí", ha: "Tambayi Bumply game da wannan makon", ig: "Jụọ Bumply maka izu a" },
  "dash.unlock": { en: "🔒 Unlock your full week", pcm: "🔒 Unlock your full week", yo: "🔒 Ṣí ọ̀sẹ̀ rẹ kíkún", ha: "🔒 Buɗe cikakken makonki", ig: "🔒 Mepee izu gị zuru ezu" },
  "dash.unlockDesc": { en: "Your 7-day meal plan, partner notes and one-on-one chat with Bumply are part of premium.", pcm: "Your 7-day meal plan, partner notes and one-on-one chat with Bumply na premium.", yo: "Ètò oúnjẹ ọjọ́ méje, àkọsílẹ̀ alábàákẹ́gbẹ́ àti ìbánisọ̀rọ̀ pẹ̀lú Bumply jẹ́ ara premium.", ha: "Shirin abinci na kwana 7, bayanan abokin tarayya da hira da Bumply suna cikin premium.", ig: "Atụmatụ nri ụbọchị 7, ndetu di na nkata gị na Bumply bụ akụkụ premium." },
  "dash.seeplans": { en: "See plans", pcm: "See plans", yo: "Wo àwọn ètò", ha: "Duba tsare-tsare", ig: "Hụ atụmatụ" },
  "dash.everyupdate": { en: "Every update, kept for you", pcm: "Every update, we keep am for you", yo: "Gbogbo ìròyìn, a tọ́jú rẹ̀ fún ọ", ha: "Kowane sabunta labari, an ajiye miki", ig: "Mmelite ọ bụla, echekwaara gị" },
  "dash.collecthere": { en: "Your weekly pages will collect here as your journey unfolds.", pcm: "Your weekly pages go dey gather here as your journey dey go.", yo: "Àwọn ojú-ìwé ọ̀sẹ̀ rẹ yóò kó síbí bí ìrìnàjò rẹ ṣe ń lọ.", ha: "Shafukanki na mako-mako za su taru a nan yayin tafiyarki.", ig: "Peeji izu gị ga-achịkọta ebe a ka njem gị na-aga." },
  "dash.pregtools": { en: "Pregnancy tools", pcm: "Pregnancy tools", yo: "Irinṣẹ́ oyún", ha: "Kayan aikin ciki", ig: "Ngwa afọ ime" },
  "dash.pregtoolsDesc": { en: "Kick counter & contraction timer for later weeks.", pcm: "Kick counter & contraction timer for later weeks.", yo: "Ìkànnì títa àti aago ìfúnpá fún àwọn ọ̀sẹ̀ tó ń bọ̀.", ha: "Mai ƙidaya harbi da agogon naƙuda na makonni masu zuwa.", ig: "Ihe ọgụgụ ịgba na ihe oge ọmụmụ maka izu ndị na-abịa." },
  "dash.feelingDesc": { en: "Log your mood & symptoms — Bumply remembers.", pcm: "Log your mood & symptoms — Bumply go remember.", yo: "Ṣàkọsílẹ̀ ìmọ̀lára àti àmì àrùn rẹ — Bumply rántí.", ha: "Yi rikodin yanayinki da alamomi — Bumply yana tunawa.", ig: "Dee mmetụta na mgbaàmà gị — Bumply na-echeta." },
  "dash.apptDesc": { en: "Your antenatal visits, scans & tests — with reminders.", pcm: "Your antenatal visits, scans & tests — with reminders.", yo: "Ìbẹ̀wò ìlóyún, àyẹ̀wò àti ìdánwò rẹ — pẹ̀lú ìránnilétí.", ha: "Ziyarce-ziyarcen asibiti, duba da gwaje-gwaje — da tunatarwa.", ig: "Nleta ụlọ ọgwụ, nyocha na ule gị — na ncheta." },
  "dash.appointments": { en: "Appointments", pcm: "Appointments", yo: "Àwọn Ìpàdé", ha: "Alƙawura", ig: "Oge Nzukọ" },

  // Landing / home page
  "home.nav.how": { en: "How It Works", pcm: "How E Dey Work", yo: "Bí Ó Ṣe Ń Ṣiṣẹ́", ha: "Yadda Yake Aiki", ig: "Ka Ọ Si Arụ Ọrụ" },
  "home.nav.features": { en: "Features", pcm: "Features", yo: "Àwọn Ẹ̀yà", ha: "Fasaloli", ig: "Atụmatụ" },
  "home.nav.stories": { en: "Stories", pcm: "Stories", yo: "Àwọn Ìtàn", ha: "Labarai", ig: "Akụkọ" },
  "home.nav.signin": { en: "Sign In", pcm: "Sign In", yo: "Wọlé", ha: "Shiga", ig: "Banye" },
  "home.nav.start": { en: "Start Your Journey", pcm: "Start Your Journey", yo: "Bẹ̀rẹ̀ Ìrìnàjò Rẹ", ha: "Fara Tafiyarki", ig: "Malite Njem Gị" },

  "home.hero.eyebrow": { en: "AI Pregnancy Companion", pcm: "AI Pregnancy Companion", yo: "Alábàákẹ́gbẹ́ Oyún AI", ha: "Abokin Ciki na AI", ig: "Onye Enyi Afọ Ime AI" },
  "home.hero.l1": { en: "Every week,", pcm: "Every week,", yo: "Ọ̀sẹ̀ kọ̀ọ̀kan,", ha: "Kowane mako,", ig: "Izu ọ bụla," },
  "home.hero.l2": { en: "beautifully", pcm: "fine fine", yo: "lẹ́wà", ha: "cikin kyau", ig: "nke ọma" },
  "home.hero.l3": { en: "guided.", pcm: "we dey guide you.", yo: "ìtọ́sọ́nà.", ha: "shiryarwa.", ig: "nduzi." },
  "home.hero.p": {
    en: "Personalised weekly updates, fetal development insights, meal plans and emotional support — delivered to you every week by your AI companion, Bumply.",
    pcm: "Personalised weekly updates, how your baby dey grow, meal plans and care — wey your AI companion Bumply dey send you every week.",
    yo: "Àwọn ìròyìn ọ̀sọ̀ọ̀sẹ̀ tó bá ọ mu, ìdàgbàsókè ọmọ inú, ètò oúnjẹ àti ìtìlẹ́yìn ọkàn — tí Bumply, alábàákẹ́gbẹ́ AI rẹ, ń fi ránṣẹ́ sí ọ lọ́sọ̀ọ̀sẹ̀.",
    ha: "Sabbin labarai na mako-mako, yadda jaririn yake girma, shirye-shiryen abinci da tallafi — wanda abokin AI dinki Bumply ke aiko miki kowane mako.",
    ig: "Mmelite kwa izu, otu nwa si eto, atụmatụ nri na nkwado obi — nke Bumply, onye enyi AI gị, na-ezitere gị kwa izu.",
  },
  "home.hero.cta1": { en: "Begin My Journey ✨", pcm: "Make I Start ✨", yo: "Bẹ̀rẹ̀ Ìrìnàjò Mi ✨", ha: "Fara Tafiyata ✨", ig: "Malite Njem M ✨" },
  "home.hero.cta2": { en: "See How It Works", pcm: "See How E Dey Work", yo: "Wo Bí Ó Ṣe Ń Ṣiṣẹ́", ha: "Duba Yadda Yake", ig: "Hụ Ka Ọ Si Arụ Ọrụ" },
  "home.hero.t1": { en: "Personalised to your week", pcm: "Personalised to your week", yo: "Tó bá ọ̀sẹ̀ rẹ mu", ha: "Daidai da makonki", ig: "Dabara maka izu gị" },
  "home.hero.t2": { en: "Weekly meal plans", pcm: "Weekly meal plans", yo: "Ètò oúnjẹ ọ̀sọ̀ọ̀sẹ̀", ha: "Shirin abinci na mako", ig: "Atụmatụ nri kwa izu" },
  "home.hero.t3": { en: "Partner notes included", pcm: "Partner notes dey inside", yo: "Àkọsílẹ̀ alábàákẹ́gbẹ́", ha: "Da bayanan abokin tarayya", ig: "Ndetu di gụnyere" },

  "home.how.title": { en: "Simple, beautiful care", pcm: "Simple, fine care", yo: "Ìtọ́jú tó rọrùn, tó sì lẹ́wà", ha: "Kulawa mai sauƙi, mai kyau", ig: "Nlekọta dị mfe, mara mma" },
  "home.how.sub": { en: "From registration to weekly updates — here's exactly how Bumply walks with you through every week of your journey.", pcm: "From registration to weekly updates — na so Bumply dey waka with you through every week of your journey.", yo: "Láti ìforúkọsílẹ̀ dé ìròyìn ọ̀sọ̀ọ̀sẹ̀ — báyìí ni Bumply ṣe ń bá ọ rìn ní ọ̀sẹ̀ kọ̀ọ̀kan ìrìnàjò rẹ.", ha: "Daga rajista zuwa sabunta labarai — ga yadda Bumply ke tafiya da ke kowane mako na tafiyarki.", ig: "Site na ndebanye aha ruo mmelite kwa izu — otu a ka Bumply si eso gị na izu ọ bụla nke njem gị." },
  "home.features.label": { en: "What You Get", pcm: "Wetin You Go Get", yo: "Ohun Tí O Máa Rí", ha: "Abin Da Za Ki Samu", ig: "Ihe Ị Ga-enweta" },
  "home.features.title": { en: "Everything for your journey", pcm: "Everything for your journey", yo: "Ohun gbogbo fún ìrìnàjò rẹ", ha: "Komai don tafiyarki", ig: "Ihe niile maka njem gị" },
  "home.feat1.title": { en: "Weekly fetal development", pcm: "Weekly fetal development", yo: "Ìdàgbàsókè ọmọ ní ọ̀sọ̀ọ̀sẹ̀", ha: "Ci gaban jariri na mako", ig: "Mmepe nwa kwa izu" },
  "home.feat2.title": { en: "Personalised 7-day meal plan", pcm: "Personalised 7-day meal plan", yo: "Ètò oúnjẹ ọjọ́ méje tó bá ọ mu", ha: "Shirin abinci na kwana 7", ig: "Atụmatụ nri ụbọchị 7" },
  "home.feat3.title": { en: "Partner notes", pcm: "Partner notes", yo: "Àkọsílẹ̀ alábàákẹ́gbẹ́", ha: "Bayanan abokin tarayya", ig: "Ndetu di" },
  "home.feat4.title": { en: "Milestone celebrations", pcm: "Milestone celebrations", yo: "Àjọyọ̀ àwọn àmì pàtàkì", ha: "Bukukuwan muhimman lokuta", ig: "Mmemme oke ihe ngosi" },
  "home.grow.label": { en: "Real development", pcm: "Real development", yo: "Ìdàgbàsókè gidi", ha: "Ci gaba na gaske", ig: "Mmepe n'ezie" },
  "home.grow.title": { en: "Watch your baby grow", pcm: "Watch your baby dey grow", yo: "Wo bí ọmọ rẹ ṣe ń dàgbà", ha: "Kalli yadda jaririnki ke girma", ig: "Lelee ka nwa gị si eto" },
  "home.grow.sub": { en: "From a single cell to a fully formed little one — a real image of your baby's stage, week by week.", pcm: "From one cell to full baby — real image of your baby stage, week by week.", yo: "Láti sẹ́ẹ̀lì kan ṣoṣo dé ọmọ kékeré tó dàgbà ní kíkún — àwòrán gidi ti ipele ọmọ rẹ, ní ọ̀sẹ̀ dé ọ̀sẹ̀.", ha: "Daga ƙwaya guda zuwa cikakken jariri — hoto na gaske na matakin jaririnki, mako zuwa mako.", ig: "Site na otu sel ruo nwa zuru ezu — onyonyo n'ezie nke ọkwa nwa gị, izu na izu." },
  "home.reg.label": { en: "Join Bumply", pcm: "Join Bumply", yo: "Darapọ̀ mọ́ Bumply", ha: "Shiga Bumply", ig: "Sonye Bumply" },
  "home.reg.p": { en: "Register once and Bumply delivers a beautifully personalised pregnancy update — in your dashboard and your inbox — every week of your journey.", pcm: "Register once and Bumply go dey send you fine personalised pregnancy update — for your dashboard and inbox — every week.", yo: "Forúkọsílẹ̀ ẹ̀ẹ̀kan, Bumply yóò sì máa fún ọ ní ìròyìn oyún tó lẹ́wà — nínú dashboard àti inbox rẹ — ní ọ̀sẹ̀ kọ̀ọ̀kan.", ha: "Yi rajista sau ɗaya, Bumply zai aiko miki sabunta labarin ciki mai kyau — a dashboard da inbox dinki — kowane mako.", ig: "Debanye aha otu ugboro, Bumply ga-enyeghachi gị mmelite afọ ime mara mma — na dashboard na inbox gị — kwa izu." },
  "home.stories.label": { en: "Mama Stories", pcm: "Mama Stories", yo: "Ìtàn Àwọn Ìyá", ha: "Labaran Iyaye Mata", ig: "Akụkọ Ụmụnne" },
  "home.stories.title": { en: "From the mamas themselves", pcm: "From the mamas themselves", yo: "Láti ọ̀dọ̀ àwọn ìyá fúnra wọn", ha: "Daga iyaye mata kansu", ig: "Site n'aka ndị nne n'onwe ha" },
  "home.foot.desc": { en: "AI-powered pregnancy companion delivering personalised weekly care to mamas across Nigeria and beyond.", pcm: "AI pregnancy companion wey dey give mamas personalised weekly care across Nigeria and beyond.", yo: "Alábàákẹ́gbẹ́ oyún AI tó ń pèsè ìtọ́jú ọ̀sọ̀ọ̀sẹ̀ fún àwọn ìyá ní Nàìjíríà àti jù bẹ́ẹ̀ lọ.", ha: "Abokin ciki na AI da ke ba iyaye mata kulawa ta mako-mako a Najeriya da bayanta.", ig: "Onye enyi afọ ime AI na-enye ndị nne nlekọta kwa izu na Naịjịrịa na karịa." },
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

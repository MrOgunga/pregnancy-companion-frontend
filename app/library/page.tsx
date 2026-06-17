import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMotherById } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { normalizeLang } from "@/lib/languages";
import { t } from "@/lib/i18n";
import AppHeader from "../_components/AppHeader";
import LibraryClient from "../_components/LibraryClient";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const mother = await getMotherById(session.sub);
  if (!mother) redirect("/login");

  const settings = await getSettings();
  const features = { journal: settings.journal_enabled, tools: settings.tools_enabled, chat: settings.chat_enabled };
  const L = normalizeLang(mother.language);
  const suggestions = ["morning sickness", "danger signs", "what to eat", "signs of labour"];

  return (
    <>
      <AppHeader plan={mother.plan} lang={mother.language} active="library" features={features} />
      <div className="app-shell" style={{ maxWidth: 720 }}>
        <p className="s-label">{t("nav.library", L)}</p>
        <h1 className="s-title" style={{ marginBottom: 6 }}>{t("library.title", L)}</h1>
        <p className="muted" style={{ marginBottom: 24 }}>{t("library.sub", L)}</p>
        <LibraryClient placeholder={t("library.placeholder", L)} suggestions={suggestions} />
      </div>
    </>
  );
}

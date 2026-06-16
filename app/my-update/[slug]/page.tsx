import { notFound } from "next/navigation";
import { getWeeklyUpdateBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Renders a stored weekly update page (replaces the old static update.html + lookup webhook).
export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = await getWeeklyUpdateBySlug(slug);
  if (!update || !update.html_content) notFound();

  return (
    <iframe
      title={update.subject || "Bumply Weekly Update"}
      srcDoc={update.html_content}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none", background: "#fffaf6" }}
    />
  );
}

import { ai, AI_MODEL } from "@/lib/ai";
import { resolveModel } from "@/lib/settings";
import { getSession } from "@/lib/session";
import { getMotherById, getWeeklyUpdateByWeek, recentChat, saveChat, recentJournalSummary } from "@/lib/queries";
import { currentWeekFrom, trimesterFor } from "@/lib/babyData";
import { languageInstruction } from "@/lib/languages";

function textResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return textResponse("Please sign in to chat with Bumply.", 401);

  const mother = await getMotherById(session.sub);
  if (!mother) return textResponse("Account not found.", 404);

  if (mother.plan !== "premium") {
    return textResponse(
      "Chatting with me one-on-one is a premium feature, mama 🌸 Upgrade your plan and I'll be here any time, day or night, with answers tailored to exactly where you are."
    );
  }

  const body = await req.json().catch(() => ({}));
  const incoming: { role: string; content: string }[] = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...incoming].reverse().find((m) => m.role === "user")?.content?.trim() || "";

  const week = currentWeekFrom({ dueDate: mother.due_date, enteredWeek: mother.current_week, createdAt: mother.created_at });
  const update = await getWeeklyUpdateByWeek(mother.id, week);
  const context = update ? `This week's focus: ${update.baby_development || ""}. Affirmation: ${update.affirmation || ""}.` : "";
  const journal = await recentJournalSummary(mother.id, 5);
  const journalBlock = journal ? `\nHer recent journal check-ins (reference these naturally if relevant):\n${journal}` : "";

  const system = `You are Bumply, a warm, caring AI pregnancy companion.
You are speaking with ${mother.full_name}, currently in week ${week} (${trimesterFor(week)} trimester)${
    mother.due_date ? `, due ${mother.due_date}` : ""
  }. First pregnancy: ${mother.first_pregnancy ? "yes" : "no"}. Dietary notes: ${mother.dietary_restrictions || "none"}. ${context}${journalBlock}
Be warm, brief and reassuring. Use her name occasionally. Give practical, trimester-appropriate guidance.
BE CONCISE: reply in 2–4 short sentences, plain everyday words, no preamble or filler. Use at most a couple of short bullet points only if it genuinely helps.
You are NOT a doctor: for any warning signs (heavy bleeding, severe or persistent pain, reduced fetal movement, fever, vision changes, severe swelling), gently and clearly urge her to contact her healthcare provider or go to a clinic. Never diagnose or prescribe.
${languageInstruction(mother.language || "en")}`;

  const history = await recentChat(mother.id, 16);

  const model = await resolveModel(AI_MODEL);
  let stream;
  try {
    stream = await ai.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 600,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
        { role: "user", content: lastUser },
      ],
    });
  } catch (e) {
    console.error("chat start error:", e);
    return textResponse("I couldn't reach my thoughts just now — please try again in a moment. 🌸");
  }

  const encoder = new TextEncoder();
  const rs = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const part of stream) {
          const tok = part.choices?.[0]?.delta?.content || "";
          if (tok) {
            full += tok;
            controller.enqueue(encoder.encode(tok));
          }
        }
      } catch (e) {
        console.error("chat stream error:", e);
        controller.enqueue(encoder.encode("\n\n(Sorry mama, I lost my train of thought — please try again. 🌸)"));
      }
      controller.close();
      try {
        if (lastUser) await saveChat(mother.id, "user", lastUser, week);
        if (full.trim()) await saveChat(mother.id, "assistant", full, week);
      } catch (e) {
        console.error("chat save error:", e);
      }
    },
  });

  return new Response(rs, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPanel({
  name,
  initial,
  suggestions,
}: {
  name: string;
  initial: Msg[];
  suggestions: string[];
}) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [msgs, busy]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      // Stream tokens into a single growing assistant message.
      setMsgs((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body?.getReader();
      if (!reader) {
        const fallback = await res.text();
        setMsgs((m) => replaceLast(m, fallback));
      } else {
        const dec = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setMsgs((m) => replaceLast(m, acc));
        }
      }
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't reach my thoughts just now — try again. 🌸" }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "68vh" }}>
      <div ref={boxRef} className="np-messages" style={{ flex: 1, height: "auto" }}>
        {msgs.map((m, i) => (
          <div key={i} className={"np-msg " + (m.role === "user" ? "user" : "nerve")} style={{ maxWidth: "80%" }}>
            {m.content || "…"}
          </div>
        ))}
        {busy && msgs[msgs.length - 1]?.role === "user" && (
          <div className="np-typing"><span /><span /><span /></div>
        )}
      </div>

      {msgs.length <= 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 16px 0" }}>
          {suggestions.map((s) => (
            <button key={s} className="chip" style={{ cursor: "pointer", background: "var(--cream)" }} onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="np-input-area">
        <input
          className="np-input"
          placeholder={`Ask Bumply anything, ${name}…`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={busy}
        />
        <button className="np-send" onClick={() => send()} aria-label="Send" disabled={busy}>→</button>
      </div>
    </div>
  );
}

function replaceLast(m: Msg[], content: string): Msg[] {
  const copy = [...m];
  copy[copy.length - 1] = { role: "assistant", content };
  return copy;
}

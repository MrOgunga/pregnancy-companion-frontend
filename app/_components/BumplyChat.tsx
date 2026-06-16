"use client";
import { useRef, useState } from "react";

type Msg = { who: "nerve" | "user"; text: string };

const CANNED = [
  "Hello mama! 🌸 I'm Bumply, your pregnancy companion. How are you feeling today?",
  "Your baby is growing so beautifully right now. What would you like to know about this week?",
  "Every week is a milestone. You're doing an incredible job. 💕",
  "I can help with symptoms, meal ideas, or what your baby is developing this week. What's on your mind?",
  "Remember — every feeling you have is valid. Growing a human being is extraordinary work. 🌿",
  "Would you like to hear about your baby's development this week? I can walk you through it.",
  "You're not alone on this journey. I'm here every step of the way. 💌",
];

/**
 * Bumply chat bubble.
 * - live=false (default): canned teaser used on the public landing page.
 * - live=true: talks to /api/chat, grounded in the signed-in mother's week + profile.
 */
export default function BumplyChat({ live = false }: { live?: boolean }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cannedIdx, setCannedIdx] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const scroll = () =>
    requestAnimationFrame(() => {
      if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
    });

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && msgs.length === 0) {
      setTimeout(() => {
        setMsgs([{ who: "nerve", text: CANNED[0] }]);
        scroll();
      }, 350);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    const history = [...msgs, { who: "user", text } as Msg];
    setMsgs(history);
    setInput("");
    setTyping(true);
    scroll();

    if (!live) {
      setTimeout(() => {
        const idx = (cannedIdx + 1) % CANNED.length;
        setCannedIdx(idx);
        setTyping(false);
        setMsgs((m) => [...m, { who: "nerve", text: CANNED[idx] }]);
        scroll();
      }, 1100 + Math.random() * 700);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.who === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { who: "nerve", text: data.reply || "I'm having trouble responding right now, mama. Try again in a moment. 💕" },
      ]);
      scroll();
    } catch {
      setTyping(false);
      setMsgs((m) => [...m, { who: "nerve", text: "I couldn't reach my brain just now — please try again. 🌸" }]);
      scroll();
    }
  }

  return (
    <div className="nerve-bubble">
      <div className={"nerve-popup" + (open ? " open" : "")}>
        <div className="np-header">
          <div className="np-avatar">🌸</div>
          <div>
            <div className="np-name">Bumply</div>
            <div className="np-status">
              <div className="np-status-dot" />
              {live ? "Online · Your pregnancy companion" : "Online · Sign in for personalised chat"}
            </div>
          </div>
          <button className="np-close" onClick={toggle} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="np-messages" ref={boxRef}>
          {msgs.map((m, i) => (
            <div key={i} className={"np-msg " + m.who}>
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="np-typing">
              <span /><span /><span />
            </div>
          )}
        </div>
        <div className="np-input-area">
          <input
            className="np-input"
            placeholder="Ask Bumply anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button className="np-send" onClick={send} aria-label="Send">
            →
          </button>
        </div>
      </div>
      <button className="nerve-btn" onClick={toggle} aria-label="Open Bumply chat">
        🌸
        <div className="nerve-online" />
      </button>
    </div>
  );
}

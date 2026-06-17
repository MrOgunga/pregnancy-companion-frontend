import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { z } from "zod";

export const weekRecapSchema = z.object({
  week: z.number(),
  name: z.string(),
  babySize: z.string(),
  stage: z.string(),
  image: z.string(), // path under /public, e.g. "baby/dev-06.jpg"
  affirmation: z.string(),
  trimester: z.string(),
});

export type WeekRecapProps = z.infer<typeof weekRecapSchema>;

const C = {
  bgA: "#F6E9E1",
  bgB: "#EDF1E7",
  terracotta: "#C97B5A",
  sage: "#9CAF88",
  gold: "#E8B96F",
  ink: "#2E2620",
  muted: "#6b5a4d",
};

// Fade + rise helper
const rise = (frame: number, start: number, fps: number) => {
  const o = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const y = interpolate(o, [0, 1], [24, 0]);
  return { opacity: o, transform: `translateY(${y}px)` };
};

export const WeekRecap: React.FC<WeekRecapProps> = ({ week, name, babySize, stage, image, affirmation, trimester }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 14, mass: 0.8 } });
  const ringRotate = interpolate(frame, [0, 180], [0, 12]);
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "'DM Sans', system-ui, -apple-system, Arial, sans-serif";

  return (
    <AbsoluteFill style={{ background: `linear-gradient(140deg, ${C.bgA}, ${C.bgB})`, fontFamily: sans, color: C.ink }}>
      {/* soft accent blobs */}
      <AbsoluteFill style={{ opacity: 0.5 }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 460, height: 460, borderRadius: "50%", background: "#F2D9C7", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: -140, left: -120, width: 420, height: 420, borderRadius: "50%", background: "#DCE6D2", filter: "blur(60px)" }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", padding: 80, textAlign: "center" }}>
        {/* Brand */}
        <Sequence layout="none">
          <div style={{ ...rise(frame, 0, fps), display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: C.terracotta }} />
            <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: 1 }}>Bumply</span>
          </div>
        </Sequence>

        {/* Eyebrow */}
        <div style={{ ...rise(frame, 0.4 * fps, fps), marginTop: 30, fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: C.terracotta, fontWeight: 700 }}>
          Week {week} · {trimester} trimester
        </div>

        {/* Baby image in a ring */}
        <div style={{ marginTop: 40, transform: `scale(${imgScale})` }}>
          <div
            style={{
              width: 440,
              height: 440,
              borderRadius: "50%",
              padding: 14,
              background: `conic-gradient(from ${ringRotate}deg, ${C.terracotta}, ${C.gold}, ${C.sage}, ${C.terracotta})`,
              boxShadow: "0 30px 80px rgba(201,123,90,0.30)",
            }}
          >
            <Img
              src={staticFile(image)}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", border: "10px solid #fff" }}
            />
          </div>
        </div>

        {/* Stage */}
        <div style={{ ...rise(frame, 1.1 * fps, fps), marginTop: 28, fontSize: 28, color: C.muted, letterSpacing: 1 }}>{stage}</div>

        {/* Size headline */}
        <div style={{ ...rise(frame, 1.4 * fps, fps), marginTop: 14, fontFamily: serif, fontSize: 62, lineHeight: 1.1, maxWidth: 820 }}>
          {name}, your baby is {babySize}
        </div>

        {/* Affirmation */}
        <div style={{ ...rise(frame, 2 * fps, fps), marginTop: "auto", fontFamily: serif, fontStyle: "italic", fontSize: 38, color: C.ink, maxWidth: 840 }}>
          “{affirmation}”
        </div>
        <div style={{ ...rise(frame, 2.4 * fps, fps), marginTop: 22, fontSize: 24, color: C.muted }}>bumply · your AI pregnancy companion 🌸</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

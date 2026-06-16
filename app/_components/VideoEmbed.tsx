"use client";
import { useState } from "react";

export default function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-container reveal">
      <div className="video-placeholder" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            src="https://www.youtube.com/embed/sh5qrU1NIQk?autoplay=1&rel=0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <div className="play-btn">▶</div>
            <div className="video-caption">Watch: How Bumply works — full demo</div>
          </>
        )}
      </div>
    </div>
  );
}

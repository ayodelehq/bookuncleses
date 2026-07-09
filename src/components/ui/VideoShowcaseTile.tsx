"use client";

import { useRef, useState } from "react";

export function VideoShowcaseTile({ src, caption }: { src: string; caption?: string }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  return (
    <div className="group relative aspect-3/4 overflow-hidden rounded-2xl bg-black">
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      {!playing ? (
        <button
          type="button"
          onClick={handlePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 pl-1 text-2xl text-ink shadow-lg transition-transform group-hover:scale-105">
            ▶
          </span>
        </button>
      ) : null}
      {caption && !playing ? (
        <span className="font-accent absolute bottom-6 left-6 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";

export default function ReadAloudButton({ storyId }: { storyId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleClick() {
    if (state === "playing") {
      audioRef.current?.pause();
      setState("paused");
      return;
    }

    if (state === "paused") {
      audioRef.current?.play();
      setState("playing");
      return;
    }

    // idle or after ended — fetch and play
    setState("loading");
    try {
      const res = await fetch(`/api/tts?story_id=${storyId}`);
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setState("idle");
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => setState("idle");
      await audio.play();
      setState("playing");
    } catch {
      setState("idle");
    }
  }

  const label =
    state === "loading"
      ? "⏳ Loading..."
      : state === "playing"
      ? "⏸ Pause"
      : state === "paused"
      ? "▶️ Resume"
      : "🔊 Read to me";

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="rounded-3xl font-bold text-xl w-full transition-transform hover:scale-105 active:scale-95"
      style={{
        background:
          state === "playing"
            ? "linear-gradient(135deg, #302b63 0%, #24243e 100%)"
            : "linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)",
        border: "2px solid rgba(255,215,0,0.4)",
        color: state === "playing" ? "#ffd700" : "#0f0c29",
        minHeight: "64px",
        cursor: state === "loading" ? "wait" : "pointer",
        opacity: state === "loading" ? 0.7 : 1,
      }}
    >
      {label}
    </button>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

const STARS = [
  { top: "3%", left: "7%", size: 2, delay: "0s", slow: false },
  { top: "7%", left: "82%", size: 3, delay: "0.5s", slow: true },
  { top: "14%", left: "34%", size: 2, delay: "1.2s", slow: false },
  { top: "19%", left: "65%", size: 1, delay: "0.3s", slow: false },
  { top: "25%", left: "18%", size: 3, delay: "2s", slow: true },
  { top: "28%", left: "92%", size: 2, delay: "0.8s", slow: false },
  { top: "33%", left: "47%", size: 1, delay: "1.5s", slow: false },
  { top: "38%", left: "73%", size: 2, delay: "0.2s", slow: true },
  { top: "42%", left: "9%", size: 3, delay: "1.8s", slow: false },
  { top: "48%", left: "56%", size: 2, delay: "0.6s", slow: false },
  { top: "53%", left: "29%", size: 1, delay: "1.1s", slow: true },
  { top: "57%", left: "88%", size: 2, delay: "0.4s", slow: false },
  { top: "62%", left: "15%", size: 3, delay: "2.3s", slow: false },
  { top: "66%", left: "61%", size: 1, delay: "0.9s", slow: true },
  { top: "71%", left: "43%", size: 2, delay: "1.6s", slow: false },
  { top: "75%", left: "79%", size: 3, delay: "0.1s", slow: false },
  { top: "80%", left: "22%", size: 1, delay: "1.3s", slow: true },
  { top: "84%", left: "95%", size: 2, delay: "2.1s", slow: false },
  { top: "88%", left: "51%", size: 3, delay: "0.7s", slow: false },
  { top: "92%", left: "6%", size: 1, delay: "1.9s", slow: true },
  { top: "96%", left: "71%", size: 2, delay: "0.3s", slow: false },
  { top: "10%", left: "55%", size: 2, delay: "1.4s", slow: false },
  { top: "22%", left: "78%", size: 1, delay: "2.5s", slow: true },
  { top: "36%", left: "38%", size: 3, delay: "0.6s", slow: false },
  { top: "44%", left: "87%", size: 2, delay: "1.7s", slow: false },
  { top: "59%", left: "3%", size: 1, delay: "0.2s", slow: true },
  { top: "68%", left: "33%", size: 2, delay: "2.4s", slow: false },
  { top: "77%", left: "64%", size: 3, delay: "1s", slow: false },
  { top: "85%", left: "42%", size: 1, delay: "0.8s", slow: true },
  { top: "93%", left: "19%", size: 2, delay: "1.5s", slow: false },
];

function GeneratingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const called = useRef(false);
  const [error, setError] = useState(false);

  const player = searchParams.get("player") || "max";
  const friend = searchParams.get("friend") || "";
  const place = searchParams.get("place") || "";
  const problem = searchParams.get("problem") || "";

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 3000));

    const generate = fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player,
        magical_friend: friend,
        place,
        problem,
      }),
    }).then((r) => r.json());

    Promise.all([minDelay, generate])
      .then(([, data]) => {
        if (data.id) {
          router.push(`/story/${data.id}`);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <main
        className="relative min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6"
        style={{ background: "#0f0c29" }}
      >
        <div className="text-6xl">😔</div>
        <p className="text-xl font-bold" style={{ color: "#ffd700" }}>
          The story fairies got confused... try again!
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-3xl font-bold text-lg px-8 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)",
            color: "#0f0c29",
            minHeight: "64px",
          }}
        >
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0f0c29" }}
    >
      {/* Stars */}
      {STARS.map((s, i) => (
        <div
          key={i}
          className={s.slow ? "star-slow" : "star"}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Moon */}
      <div
        className="moon-glow"
        style={{ position: "absolute", top: "12%", right: "18%", fontSize: "5rem", lineHeight: 1 }}
      >
        🌙
      </div>

      {/* Fairy dust sparkles */}
      <div
        style={{ position: "absolute", top: "30%", left: "12%", fontSize: "2rem", opacity: 0.6 }}
        className="moon-glow"
      >
        ✨
      </div>
      <div
        style={{ position: "absolute", bottom: "25%", right: "10%", fontSize: "1.5rem", opacity: 0.5 }}
        className="moon-glow"
      >
        ⭐
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6 max-w-md">
        <div className="text-8xl moon-glow">✨</div>
        <p
          className="text-2xl font-extrabold leading-snug"
          style={{ color: "#ffd700" }}
        >
          The story fairies are writing your adventure...
        </p>
        <p className="text-lg" style={{ color: "rgba(240,240,240,0.6)" }}>
          Sprinkling magic dust just for you 🌟
        </p>
        {/* Animated dots */}
        <div className="flex gap-3 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: "12px",
                height: "12px",
                background: "#ffd700",
                animation: `twinkle 1.2s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function GeneratingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ background: "#0f0c29" }} />
      }
    >
      <GeneratingContent />
    </Suspense>
  );
}

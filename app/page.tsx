import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getStoryCounts() {
  const { data, error } = await supabase.from("stories").select("player");
  if (error || !data) return { max: 0, lila: 0 };
  return {
    max: data.filter((s) => s.player === "max").length,
    lila: data.filter((s) => s.player === "lila").length,
  };
}

// Hardcoded star positions for CSS-only twinkling animation
const STARS = [
  { top: "3%", left: "8%", size: 2, delay: "0s", slow: false },
  { top: "7%", left: "22%", size: 1, delay: "1.2s", slow: false },
  { top: "5%", left: "45%", size: 3, delay: "0.4s", slow: true },
  { top: "11%", left: "67%", size: 1, delay: "2.1s", slow: false },
  { top: "4%", left: "82%", size: 2, delay: "0.8s", slow: false },
  { top: "2%", left: "93%", size: 1, delay: "1.6s", slow: false },
  { top: "15%", left: "12%", size: 1, delay: "2.4s", slow: false },
  { top: "18%", left: "35%", size: 2, delay: "0.2s", slow: false },
  { top: "14%", left: "57%", size: 1, delay: "1.8s", slow: true },
  { top: "20%", left: "78%", size: 3, delay: "0.6s", slow: false },
  { top: "25%", left: "5%", size: 2, delay: "1.0s", slow: false },
  { top: "28%", left: "92%", size: 1, delay: "2.8s", slow: false },
  { top: "33%", left: "18%", size: 1, delay: "0.3s", slow: false },
  { top: "37%", left: "48%", size: 2, delay: "1.5s", slow: true },
  { top: "31%", left: "72%", size: 1, delay: "2.2s", slow: false },
  { top: "42%", left: "3%", size: 3, delay: "0.9s", slow: false },
  { top: "45%", left: "88%", size: 2, delay: "1.3s", slow: false },
  { top: "50%", left: "15%", size: 1, delay: "2.6s", slow: false },
  { top: "53%", left: "62%", size: 1, delay: "0.7s", slow: true },
  { top: "58%", left: "30%", size: 2, delay: "1.9s", slow: false },
  { top: "55%", left: "95%", size: 1, delay: "0.1s", slow: false },
  { top: "63%", left: "8%", size: 1, delay: "2.3s", slow: false },
  { top: "67%", left: "42%", size: 2, delay: "1.1s", slow: false },
  { top: "61%", left: "75%", size: 3, delay: "0.5s", slow: true },
  { top: "72%", left: "22%", size: 1, delay: "2.7s", slow: false },
  { top: "75%", left: "55%", size: 1, delay: "1.4s", slow: false },
  { top: "70%", left: "88%", size: 2, delay: "0.2s", slow: false },
  { top: "80%", left: "5%", size: 2, delay: "2.0s", slow: false },
  { top: "83%", left: "38%", size: 1, delay: "0.8s", slow: true },
  { top: "78%", left: "65%", size: 1, delay: "1.7s", slow: false },
  { top: "86%", left: "18%", size: 3, delay: "2.5s", slow: false },
  { top: "88%", left: "78%", size: 2, delay: "0.4s", slow: false },
  { top: "92%", left: "48%", size: 1, delay: "1.2s", slow: false },
  { top: "95%", left: "10%", size: 1, delay: "2.9s", slow: true },
  { top: "93%", left: "90%", size: 2, delay: "0.6s", slow: false },
];

export default async function Home() {
  const counts = await getStoryCounts();

  return (
    <main className="min-h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Twinkling stars background — CSS animation only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {STARS.map((star, i) => (
          <span
            key={i}
            className={star.slow ? "star-slow" : "star"}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        <h1
          className="text-4xl md:text-6xl font-extrabold text-center mb-10"
          style={{ color: "#ffd700" }}
        >
          Bedtime Stories 🌙
        </h1>

        {/* Character cards */}
        <div className="flex flex-col sm:flex-row gap-6 w-full mb-10">
          {/* Max */}
          <Link
            href="/build?player=max"
            className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              minHeight: "220px",
            }}
          >
            <span className="text-7xl leading-none">🦁</span>
            <span className="text-3xl font-extrabold text-white">Max</span>
            <span className="text-white/80 text-lg font-semibold">
              {counts.max} {counts.max === 1 ? "story" : "stories"} saved
            </span>
          </Link>

          {/* Lila */}
          <Link
            href="/build?player=lila"
            className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
              minHeight: "220px",
            }}
          >
            <span className="text-7xl leading-none">🦋</span>
            <span className="text-3xl font-extrabold text-white">Lila</span>
            <span className="text-white/80 text-lg font-semibold">
              {counts.lila} {counts.lila === 1 ? "story" : "stories"} saved
            </span>
          </Link>
        </div>

        {/* Favourites */}
        <Link
          href="/favourites"
          className="rounded-3xl px-10 font-bold text-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{
            background: "#302b63",
            color: "#ffd700",
            minHeight: "64px",
          }}
        >
          ⭐ Our Favourites
        </Link>
      </div>
    </main>
  );
}

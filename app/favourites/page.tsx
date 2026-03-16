import { createClient } from "@supabase/supabase-js";
import { Story } from "@/lib/supabase";
import Link from "next/link";

export const revalidate = 0;

export default async function FavouritesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("is_favourite", true)
    .order("created_at", { ascending: false })
    .returns<Story[]>();

  const favs = stories ?? [];

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-2xl opacity-70 hover:opacity-100 transition-opacity">
            ←
          </Link>
          <h1 className="text-3xl font-extrabold" style={{ color: "#ffd700" }}>
            ⭐ Our Favourites
          </h1>
        </div>

        {favs.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: "rgba(48,43,99,0.5)",
              border: "1px solid rgba(255,215,0,0.15)",
            }}
          >
            <div className="text-6xl mb-4">✨</div>
            <p className="text-xl font-bold" style={{ color: "#ffd700" }}>
              No favourites yet — make some stories first!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {favs.map((story) => {
              const isMax = story.player === "max";
              const firstSentence = story.story_text.split(/[.!?]/)[0]?.trim() ?? "";
              const date = new Date(story.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <Link
                  key={story.id}
                  href={`/story/${story.id}`}
                  className="block rounded-3xl p-5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "rgba(48,43,99,0.5)",
                    border: `2px solid ${isMax ? "rgba(249,115,22,0.4)" : "rgba(168,85,247,0.4)"}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{isMax ? "🦁" : "🦋"}</span>
                    <span
                      className="font-extrabold text-lg"
                      style={{ color: isMax ? "#f97316" : "#a855f7" }}
                    >
                      {isMax ? "Max" : "Lila"}&apos;s Story
                    </span>
                    <span
                      className="ml-auto text-sm opacity-60"
                      style={{ color: "#f0f0f0" }}
                    >
                      {date}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm mb-3" style={{ color: "rgba(240,240,240,0.6)" }}>
                    <span>{story.place}</span>
                    <span>·</span>
                    <span>{story.problem}</span>
                  </div>
                  <p
                    className="text-sm leading-relaxed line-clamp-2"
                    style={{ color: "rgba(240,240,240,0.8)" }}
                  >
                    {firstSentence}…
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

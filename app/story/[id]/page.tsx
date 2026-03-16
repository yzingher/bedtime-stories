import { createClient } from "@supabase/supabase-js";
import { Story } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import FavouriteButton from "./FavouriteButton";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: story } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .single<Story>();

  if (!story) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🌙</div>
        <p className="text-xl font-bold" style={{ color: "#ffd700" }}>
          Story not found
        </p>
        <Link
          href="/"
          className="rounded-3xl font-bold text-lg px-8 flex items-center justify-center"
          style={{
            background: "rgba(48,43,99,0.7)",
            border: "2px solid rgba(255,215,0,0.3)",
            color: "#f0f0f0",
            minHeight: "64px",
          }}
        >
          Back to Home
        </Link>
      </main>
    );
  }

  const isMax = story.player === "max";
  const paragraphs = story.story_text.split("\n\n").filter(Boolean);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1
          className="text-3xl font-extrabold mb-8 text-center"
          style={{ color: "#ffd700" }}
        >
          {isMax ? "Max's Story 🦁" : "Lila's Story 🦋"}
        </h1>

        {/* Illustration */}
        {story.image_url && (
          <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl">
            <Image
              src={story.image_url}
              alt={`Illustration for ${isMax ? "Max" : "Lila"}'s story`}
              width={1024}
              height={1024}
              className="w-full"
              priority
            />
          </div>
        )}

        {/* Story text */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{ background: "rgba(48,43,99,0.5)", border: "1px solid rgba(255,215,0,0.15)" }}
        >
          {paragraphs.map((para, i) => (
            <div key={i}>
              <p
                style={{
                  fontSize: "20px",
                  lineHeight: "1.8",
                  color: "#f0f0f0",
                  marginBottom: "1rem",
                }}
              >
                {para}
              </p>
              {i < paragraphs.length - 1 && (
                <div
                  className="text-center text-2xl my-2"
                  style={{ color: "#ffd700", opacity: 0.5 }}
                >
                  ✦
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          <FavouriteButton
            storyId={story.id}
            initialIsFavourite={story.is_favourite}
          />

          <button
            disabled
            className="rounded-3xl font-bold text-xl w-full"
            style={{
              background: "rgba(48,43,99,0.5)",
              border: "2px solid rgba(255,255,255,0.12)",
              color: "rgba(240,240,240,0.4)",
              minHeight: "64px",
              cursor: "not-allowed",
            }}
          >
            🔊 Read Aloud (coming soon)
          </button>

          <Link
            href="/"
            className="rounded-3xl font-bold text-xl w-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              background: "rgba(48,43,99,0.7)",
              border: "2px solid rgba(255,215,0,0.25)",
              color: "#f0f0f0",
              minHeight: "64px",
            }}
          >
            🔄 New Story
          </Link>
        </div>
      </div>
    </main>
  );
}

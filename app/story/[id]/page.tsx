import { createClient } from "@supabase/supabase-js";
import { Story } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import FavouriteButton from "./FavouriteButton";
import ReadAloudButton from "./ReadAloudButton";

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

        {/* Story text with inline images */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{ background: "rgba(48,43,99,0.5)", border: "1px solid rgba(255,215,0,0.15)" }}
        >
          {paragraphs.map((para, i) => {
            const imgSrc = story.image_urls?.[i] ?? (i === 0 ? story.image_url : null);
            return (
              <div key={i}>
                {imgSrc && (
                  <div className="flex justify-center mb-4">
                    <div className="rounded-2xl overflow-hidden shadow-xl" style={{ maxWidth: "400px", width: "100%" }}>
                      <Image
                        src={imgSrc}
                        alt={`Scene ${i + 1}`}
                        width={400}
                        height={400}
                        className="w-full"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                )}
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
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4">
          <FavouriteButton
            storyId={story.id}
            initialIsFavourite={story.is_favourite}
          />

          <ReadAloudButton storyId={story.id} />

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

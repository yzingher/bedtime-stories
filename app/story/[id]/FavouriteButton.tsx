"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FavouriteButton({
  storyId,
  initialIsFavourite,
}: {
  storyId: string;
  initialIsFavourite: boolean;
}) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const newValue = !isFavourite;
    setIsFavourite(newValue);

    await supabase
      .from("stories")
      .update({ is_favourite: newValue })
      .eq("id", storyId);

    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="rounded-3xl font-bold text-xl w-full transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: isFavourite
          ? "linear-gradient(135deg, #ffd700 0%, #f59e0b 100%)"
          : "rgba(48,43,99,0.7)",
        border: `2px solid ${isFavourite ? "#ffd700" : "rgba(255,215,0,0.3)"}`,
        color: isFavourite ? "#0f0c29" : "#f0f0f0",
        minHeight: "64px",
      }}
    >
      {isFavourite ? "⭐ Saved to Favourites!" : "☆ Save as Favourite"}
    </button>
  );
}

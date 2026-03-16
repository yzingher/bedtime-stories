import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHARACTER_DESC =
  "Twin siblings, boy and girl, around 4 years old. The boy has lighter brown straight hair and a cheeky grin; the girl has darker brown curly hair in pigtail buns and a sweet smile. Both have large dark brown eyes and fair skin. Cartoon/illustrated style, warm and friendly, suitable for a children's storybook.";

export async function POST(req: NextRequest) {
  try {
    const { player, magical_friend, place, problem } = await req.json();

    const playerName = player === "max" ? "Max" : "Lila";
    const otherSibling = player === "max" ? "Lila" : "Max";

    // Generate short story with GPT-4o
    const storyCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `You are a warm children's story writer for 4-year-olds.
Write a bedtime story with:
- Hero: ${playerName} (age 4.5)
- Companion: ${otherSibling} (their sibling, also 4.5)
- Magical friend: ${magical_friend}
- Setting: ${place}
- Problem: ${problem}
Rules: EXACTLY 3 paragraphs, ~120-150 words total, very simple vocabulary, sentences max 15 words, both children work together, no scary moments, warm gentle tone, end with both children falling asleep happy and safe.
Format: Return ONLY the story text, no title, no labels. Separate paragraphs with a blank line.`,
        },
      ],
    });

    const story_text = storyCompletion.choices[0].message.content || "";

    // Split into exactly 3 paragraphs
    const paragraphs = story_text.split("\n\n").filter(Boolean).slice(0, 3);

    // Generate 3 DALL-E 2 images in parallel, one per paragraph
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const timestamp = Date.now();

    const imageUrls = await Promise.all(
      paragraphs.map(async (para, i) => {
        const imageResponse = await openai.images.generate({
          model: "dall-e-2",
          prompt: `${CHARACTER_DESC} Scene: ${playerName} and ${otherSibling} with a ${magical_friend} in ${place}. ${para.slice(0, 200)}`,
          size: "512x512",
          n: 1,
        });

        const dalleUrl = imageResponse.data![0].url!;
        const imageRes = await fetch(dalleUrl);
        const imageBuffer = await imageRes.arrayBuffer();
        const filename = `story-${timestamp}-${i}.png`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from("story-images")
          .upload(filename, imageBuffer, { contentType: "image/png" });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from("story-images").getPublicUrl(filename);

        return publicUrl;
      })
    );

    // Save to Supabase DB
    const { data, error } = await supabaseAdmin
      .from("stories")
      .insert({
        player,
        magical_friend,
        place,
        problem,
        story_text,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, story_text });
  } catch (err) {
    console.error("Story generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}

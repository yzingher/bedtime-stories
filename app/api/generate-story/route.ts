import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { player, magical_friend, place, problem } = await req.json();

    const playerName = player === "max" ? "Max" : "Lila";
    const otherSibling = player === "max" ? "Lila" : "Max";

    // Generate story with GPT-4o
    const storyCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `You are a warm children's story writer for 4-5 year olds.
Write a bedtime story with:
- Hero: ${playerName} (age 4.5)
- Companion: ${otherSibling} (their sibling, also 4.5)
- Magical friend: ${magical_friend}
- Setting: ${place}
- Problem: ${problem}
Rules: 5 paragraphs, ~350 words, simple vocabulary, both children work together as a team, no scary moments, warm gentle tone, end with both children falling asleep happy and safe.
Format: Return ONLY the story text, no title, no labels.`,
        },
      ],
    });

    const story_text = storyCompletion.choices[0].message.content || "";

    // Generate DALL-E illustration
    const scene_description = `${playerName} and ${otherSibling} are in ${place} with a ${magical_friend}, trying to ${problem}. Colorful, dreamy, magical nighttime atmosphere.`;
    const imagePrompt = `Twin siblings, boy and girl, around 4 years old. The boy has lighter brown straight hair and a cheeky grin; the girl has darker brown curly hair in pigtail buns and a sweet smile. Both have large dark brown eyes and fair skin. Cartoon/illustrated style, warm and friendly, suitable for a children's storybook. Scene: ${scene_description}`;

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const dalleUrl = imageResponse.data![0].url!;

    // Download image and upload to Supabase Storage
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    const imageRes = await fetch(dalleUrl);
    const imageBuffer = await imageRes.arrayBuffer();
    const filename = `story-${Date.now()}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("story-images")
      .upload(filename, imageBuffer, { contentType: "image/png" });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("story-images").getPublicUrl(filename);

    // Save to Supabase DB
    const { data, error } = await supabaseAdmin
      .from("stories")
      .insert({
        player,
        magical_friend,
        place,
        problem,
        story_text,
        image_url: publicUrl,
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

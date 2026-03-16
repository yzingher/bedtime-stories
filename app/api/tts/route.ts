import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET(request: NextRequest) {
  const storyId = request.nextUrl.searchParams.get("story_id");
  if (!storyId) {
    return NextResponse.json({ error: "story_id is required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: story } = await supabase
    .from("stories")
    .select("story_text")
    .eq("id", storyId)
    .single();

  if (!story) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: story.story_text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length.toString(),
    },
  });
}

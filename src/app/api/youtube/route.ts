import { NextRequest, NextResponse } from "next/server";

interface VideoMedia {
  type: string;
  is_audio: boolean;
  url: string;
  label: string;
  width: number;
  height: number;
}

interface ApiResponse {
  source?: string;
  title?: string;
  author?: string;
  thumbnail?: string;
  duration?: string;
  medias?: VideoMedia[];
}

export async function POST(req: NextRequest) {
  try {
    const body: { url?: string } = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
    }

    const apiUrl =
      "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink";

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    };

    const response = await fetch(apiUrl, options);
    const data: ApiResponse = await response.json();

    if (!data.medias || data.medias.length === 0) {
      return NextResponse.json(
        { error: "Failed to fetch video details" },
        { status: 500 }
      );
    }

    // Find the first video that has both video and audio
    const videoWithAudio = data.medias.find(
      (media) => media.type === "video" && media.is_audio
    );

    if (!videoWithAudio) {
      return NextResponse.json(
        { error: "No downloadable video with audio found" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      source: data.source || "Unknown",
      title: data.title || "Untitled",
      author: data.author || "Unknown",
      thumbnail: data.thumbnail || "",
      duration: data.duration || "Unknown",
      downloadUrl: videoWithAudio.url,
      format: videoWithAudio.label,
      resolution: `${videoWithAudio.width}x${videoWithAudio.height}`,
      hasAudio: true,
    });
  } catch (error) {
    console.error("YouTube Download API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

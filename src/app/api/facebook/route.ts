import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Missing Facebook video URL" },
        { status: 400 }
      );
    }

    const apiUrl =
      "https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink";

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    };

    const response = await fetch(apiUrl, options);
    const result = await response.json();

    console.log("API Response:", result);

    // Extract the highest quality video link
    if (result && result.medias && result.medias.length > 0) {
      const highestQualityVideo =
        result.medias.find((media: any) => media.quality === "HD") ||
        result.medias[0];
      return NextResponse.json({
        title: result.title || "Facebook Video",
        thumbnail: result.thumbnail,
        downloadUrl: highestQualityVideo.url,
        quality: highestQualityVideo.quality,
        duration: result.duration,
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch Facebook video download link" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error fetching Facebook video:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

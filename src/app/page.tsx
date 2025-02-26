"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoType, setVideoType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!url || !videoType) {
      alert("Please enter a valid URL and select a platform.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/${videoType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = `${videoType}-video.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Failed to fetch the download link.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6 text-center">Video Downloader</h1>

      <div className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Paste video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Select onValueChange={setVideoType}>
          <SelectTrigger className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500">
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={handleDownload}
          disabled={loading}
          className={`w-full p-3 rounded-md text-white text-center transition ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Downloading..." : "Download Video"}
        </button>
      </div>
    </main>
  );
}

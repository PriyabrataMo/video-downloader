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
        // Create a hidden link and trigger download
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = `${videoType}-video.mp4`; // Set file name dynamically
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
    <main className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-4">Video Downloader</h1>

      <input
        type="text"
        placeholder="Paste video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="p-2 border rounded w-80 mb-4"
      />

      <Select onValueChange={setVideoType}>
        <SelectTrigger className="w-[200px]">
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
        className={`mt-4 p-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Downloading..." : "Download Video"}
      </button>
    </main>
  );
}

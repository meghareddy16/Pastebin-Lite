"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [expiresAt, setExpiresAt] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
      const ttlSeconds = expiresAt
        ? Math.floor(
            (new Date(expiresAt).getTime() - Date.now()) / 1000
          )
        : null;

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        content,
        max_views: maxViews === "" ? null : Number(maxViews),
        ttl_seconds: ttlSeconds,
      }),

    });

    const data = await res.json();

    if (data?.id) {
      router.push(`/p/${data.id}`);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg" style={{color:"#000"}}
      >
        <h1 className="text-2xl font-bold mb-4">Pastebin Lite</h1>

        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={6}
          placeholder="Paste your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="block mb-1">Max Views (optional)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={maxViews}
            onChange={(e) =>
              setMaxViews(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Expires At (optional)</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Create Paste
        </button>
      </form>
    </main>
  );
}

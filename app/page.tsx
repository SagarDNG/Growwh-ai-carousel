"use client";
import { useState } from "react";
import Carousel from "./components/Carousel";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQuotes = async () => {
    if (!theme) return alert("Enter a theme!");
    setLoading(true);

    try {
      const response = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });

      const data = await response.json();
      setQuotes(data.quotes);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white mb-6 drop-shadow-lg">
        AI Carousel Post Generator (Gemini)
      </h1>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter Theme (e.g., Growth, Success, Mindset, Discipline)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="p-3 w-80 md:w-96 border-none shadow-lg text-lg rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white text-gray-900 placeholder-gray-500"
        />

      {/* Button */}
      <button
        onClick={generateQuotes}
        className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition transform duration-300"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Quotes"}
      </button>

      {/* Carousel Component */}
      {quotes.length > 0 && (
        <div className="mt-10 w-full flex flex-col items-center">
          <Carousel quotes={quotes} />
        </div>
      )}
    </div>
  );
}

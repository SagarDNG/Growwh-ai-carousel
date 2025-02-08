"use client";
import { useState } from "react";
import Carousel from "./components/Carousel";

export default function Home() {
  const [theme, setTheme] = useState("");
  const [quotes, setQuotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuotes = async () => {
    if (!theme.trim()) {
      setError("Please enter a theme!");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://65.1.214.87:4000//api/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) throw new Error("Failed to generate quotes");

      const data = await response.json();
      setQuotes(data.quotes);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate quotes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTheme("");
    setQuotes([]);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg text-center">
        AI Carousel Post Generator (Gemini AI)
      </h1>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter Theme (e.g., Growth, Success, Mindset, Discipline)"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="p-3 w-full sm:w-80 md:w-96 border-none shadow-lg text-lg rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white text-gray-900 placeholder-gray-500"
      />

      {/* Error Message */}
      {error && <p className="mt-2 text-red-200 text-sm text-center">{error}</p>}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={generateQuotes}
          className="px-8 py-3 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition transform duration-300"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">🌀</span> Generating...
            </span>
          ) : (
            "Generate Quotes"
          )}
        </button>

        {quotes.length > 0 && (
          <button
            onClick={reset}
            className="px-8 py-3 bg-gray-500 text-white text-lg font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-xl transition transform duration-300"
          >
            Reset
          </button>
        )}
      </div>

      {/* Carousel Component */}
      {quotes.length > 0 && (
        <div className="mt-8 w-full flex flex-col items-center">
          <Carousel quotes={quotes} />
        </div>
      )}
    </div>
  );
}
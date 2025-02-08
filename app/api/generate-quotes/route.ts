import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY environment variable");

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  const { theme } = await req.json();

  if (!theme || typeof theme !== "string") {
    return NextResponse.json(
      { error: "Theme is required and must be a string" },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Generate 5 motivational quotes about ${theme}`
    );
    const response = await result.response;
    const quotes = response.text()?.split("\n").filter(Boolean) || [];

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Error generating quotes:", error);
    return NextResponse.json(
      { error: "Failed to generate quotes" },
      { status: 500 }
    );
  }
}
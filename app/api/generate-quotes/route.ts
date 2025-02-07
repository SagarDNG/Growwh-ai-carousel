import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.GEMINI_API_KEY;
const apiKey = 'AIzaSyC3po7A2IeTXQmWNeDEFgzaaGgBPbraMrI';
const genAI = new GoogleGenerativeAI(apiKey as string);

export async function POST(req: Request) {
  const { theme } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(`Generate 5 motivational quotes about ${theme}`);
    const response = await result.response;
    const quotes = response.text()?.split("\n").filter(Boolean) || [];

    return NextResponse.json({ quotes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate quotes" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const promptText =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 120, // ✅ lower tokens = better RPM
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await res.json();

    console.log("Gemini API Response:", JSON.stringify(data, null, 2));

    // 🔴 Handle API errors properly
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Gemini API failed" },
        { status: res.status }
      );
    }

    if (!data?.candidates?.length) {
      return NextResponse.json(
        { error: "No response from Gemini", fullResponse: data },
        { status: 500 }
      );
    }

    const text = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ message: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas from Gemini." },
      { status: 500 }
    );
  }
}
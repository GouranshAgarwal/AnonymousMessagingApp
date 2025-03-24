import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const promptText = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'.";

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }], // Correct format
        generationConfig: { maxOutputTokens: 200 } // Fix for max tokens
      }),
    });

    const data = await res.json();
    console.log("Gemini API Response:", JSON.stringify(data, null, 2)); // Debugging log

    if (!data?.candidates?.length) {
      return NextResponse.json({ error: "No response from Gemini", fullResponse: data }, { status: 500 });
    }

    return NextResponse.json({ message: data.candidates[0].content.parts[0].text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to fetch ideas from Gemini." }, { status: 500 });
  }
}

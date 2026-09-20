import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing from .env.local" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are Monobloc intelligent, helpful AI assistant inside a personal productivity operating system.

Your personality is conversational, clear, intelligent, and natural. Do not sound robotic.

Use Markdown formatting naturally:
- Use **bold** for important words or emphasis.
- Use short headings when useful.
- Use bullet points only when they improve clarity.
- Do not overuse Markdown symbols.
- Never start every response with a heading.
- Talk naturally like a helpful assistant.

User: ${message}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Monobloc couldn't get a response from Gemini.",
        },
        { status: response.status }
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("") || "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      response: text,
    });
  } catch (error) {
    console.error("Monobloc API error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while processing your request.",
      },
      { status: 500 }
    );
  }
}
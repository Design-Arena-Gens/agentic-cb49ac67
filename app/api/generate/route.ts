import { buildUserPrompt, systemPrompt } from "@/lib/prompt";
import { shortPlanSchema } from "@/lib/schema";
import type { AgentPayload } from "@/lib/types";
import { NextResponse } from "next/server";

interface OpenAIChoice {
  message?: {
    content?: string;
  };
}

interface OpenAIResponse {
  choices?: OpenAIChoice[];
}

export async function POST(request: Request) {
  let payload: Partial<AgentPayload>;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const {
    apiKey,
    topic,
    audience,
    tone,
    goal,
    duration,
    platformFocus,
    includeCaptions = true,
    includeBroll = true
  } = payload;

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json(
      { error: "Missing OpenAI API key" },
      { status: 400 }
    );
  }

  if (!topic || !audience || !tone || !goal || !duration || !platformFocus) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const userPrompt = buildUserPrompt({
      apiKey,
      topic,
      audience,
      tone,
      goal,
      duration,
      platformFocus,
      includeCaptions,
      includeBroll
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 900,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      const error = await response.json().catch(() => undefined);
      return NextResponse.json(
        { error: error?.error?.message ?? "OpenAI request failed" },
        { status: 502 }
      );
    }

    const data = (await response.json()) as OpenAIResponse;
    const completion = data.choices?.[0]?.message?.content;

    if (!completion) {
      return NextResponse.json(
        { error: "No completion returned" },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(completion);
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to parse model response" },
        { status: 500 }
      );
    }

    const result = shortPlanSchema.parse(parsed);

    return NextResponse.json({ plan: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

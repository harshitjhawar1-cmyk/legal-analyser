import { NextRequest, NextResponse } from "next/server";
import { chatAboutDocument } from "@/lib/claude";
import { ChatMessage } from "@/lib/types";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { documentText, history, message } = (await req.json()) as {
      documentText: string;
      history: ChatMessage[];
      message: string;
    };

    if (!documentText || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reply = await chatAboutDocument(documentText, history, message);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Failed to get response" }, { status: 500 });
  }
}

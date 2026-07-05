import { NextRequest, NextResponse } from "next/server";
import { extractText } from "@/lib/parsers";
import { analyseDocument } from "@/lib/claude";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    let documentText: string;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      documentText = await extractText(buffer, file.type);
    } else if (text) {
      documentText = text;
    } else {
      return NextResponse.json({ error: "No document provided" }, { status: 400 });
    }

    if (!documentText.trim()) {
      return NextResponse.json({ error: "Could not extract text from document" }, { status: 400 });
    }

    const analysis = await analyseDocument(documentText);
    return NextResponse.json({ analysis, documentText });
  } catch (err) {
    console.error("Analysis error:", err);
    return NextResponse.json({ error: "Failed to analyse document" }, { status: 500 });
  }
}

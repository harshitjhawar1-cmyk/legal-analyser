import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult, ChatMessage } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a legal document analyst specialising in rental and lease agreements.
Your job is to help ordinary people understand agreements in plain English, identify risks, and spot where they may be at a disadvantage or advantage.

Always respond with valid JSON only — no markdown fences, no preamble, no explanation outside the JSON.`;

const ANALYSIS_PROMPT = (text: string) => `Analyse the following rental/lease agreement and return a JSON object with this exact structure:

{
  "summary": "A plain-English paragraph summarising what this agreement is about — who, what, where, how long, how much.",
  "keyTerms": [
    { "label": "Parties", "value": "..." },
    { "label": "Property Address", "value": "..." },
    { "label": "Lease Duration", "value": "..." },
    { "label": "Monthly Rent", "value": "..." },
    { "label": "Security Deposit", "value": "..." },
    { "label": "Notice Period", "value": "..." },
    { "label": "Rent Increases", "value": "..." },
    { "label": "Pets Allowed", "value": "..." },
    { "label": "Subletting", "value": "..." }
  ],
  "riskFlags": [
    {
      "level": "HIGH",
      "title": "Short title of the risk",
      "description": "Plain-English explanation of what this means and why it matters",
      "clause": "Optional: quote the relevant clause text"
    }
  ],
  "atALoss": [
    "Plain-English description of a clause or gap that puts you at a disadvantage"
  ],
  "atAnAdvantage": [
    "Plain-English description of a clause that favours you as the tenant"
  ],
  "gaps": [
    "Plain-English description of something important that is missing from the agreement"
  ]
}

Rules:
- level must be exactly "HIGH", "MEDIUM", or "LOW"
- Only include keyTerms that are present in the document
- Include at least 3-5 items in riskFlags, atALoss, atAnAdvantage, and gaps where relevant
- If a section has nothing to report, return an empty array
- Return ONLY the JSON object, nothing else

DOCUMENT:
${text}`;

export async function analyseDocument(text: string): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(ANALYSIS_PROMPT(text));
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(cleaned) as AnalysisResult;
}

export async function chatAboutDocument(
  documentText: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: `You are a legal document analyst. The user has uploaded a rental/lease agreement and has questions about it.
Answer clearly in plain English. Be specific and reference the document where relevant.
Here is the document the user is asking about:

---
${documentText}
---`,
  });

  const chat = model.startChat({
    history: history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

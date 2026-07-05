export interface RiskFlag {
  level: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  clause?: string;
}

export interface KeyTerm {
  label: string;
  value: string;
}

export interface AnalysisResult {
  summary: string;
  keyTerms: KeyTerm[];
  riskFlags: RiskFlag[];
  atALoss: string[];
  atAnAdvantage: string[];
  gaps: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface HistoryEntry {
  id: string;
  fileName: string;
  uploadedAt: string;
  analysis: AnalysisResult;
  documentText: string;
  chat: ChatMessage[];
}

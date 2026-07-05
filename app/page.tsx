"use client";

import { useState, useEffect } from "react";
import DocumentUpload from "./components/DocumentUpload";
import AnalysisResultView from "./components/AnalysisResult";
import ChatInterface from "./components/ChatInterface";
import HistoryTab from "./components/HistoryTab";
import { AnalysisResult, ChatMessage, HistoryEntry } from "@/lib/types";

type Tab = "analyse" | "history";

const HISTORY_KEY = "legal-analyser-history";

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("analyse");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setChat([]);

    const file = formData.get("file") as File | null;
    setFileName(file ? file.name : "Pasted text");

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setAnalysis(data.analysis);
      setDocumentText(data.documentText);

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        fileName: file ? file.name : "Pasted text",
        uploadedAt: new Date().toISOString(),
        analysis: data.analysis,
        documentText: data.documentText,
        chat: [],
      };
      const updated = [entry, ...history];
      setHistory(updated);
      saveHistory(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleNewMessage(userMsg: string, assistantMsg: string) {
    const newChat: ChatMessage[] = [
      ...chat,
      { role: "user", content: userMsg },
      { role: "assistant", content: assistantMsg },
    ];
    setChat(newChat);

    setHistory((prev) => {
      const updated = prev.map((entry, i) =>
        i === 0 ? { ...entry, chat: newChat } : entry
      );
      saveHistory(updated);
      return updated;
    });
  }

  function handleSelectHistory(entry: HistoryEntry) {
    setAnalysis(entry.analysis);
    setDocumentText(entry.documentText);
    setFileName(entry.fileName);
    setChat(entry.chat);
    setTab("analyse");
  }

  function handleClearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Legal Agreement Analyser</h1>
            <p className="text-sm text-slate-400 mt-0.5">Understand your rental & lease agreements in plain English</p>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(["analyse", "history"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t}
                {t === "history" && history.length > 0 && (
                  <span className="ml-1.5 bg-indigo-100 text-indigo-700 text-xs px-1.5 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {tab === "analyse" && (
          <div className="space-y-6">
            <DocumentUpload onSubmit={handleSubmit} loading={loading} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {analysis && (
              <>
                <AnalysisResultView analysis={analysis} fileName={fileName} />
                <ChatInterface
                  documentText={documentText}
                  history={chat}
                  onNewMessage={handleNewMessage}
                />
              </>
            )}
          </div>
        )}

        {tab === "history" && (
          <HistoryTab
            history={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        )}
      </main>
    </div>
  );
}

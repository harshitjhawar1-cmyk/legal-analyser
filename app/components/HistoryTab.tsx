"use client";

import { HistoryEntry } from "@/lib/types";

interface Props {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export default function HistoryTab({ history, onSelect, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-4xl mb-3">📂</p>
        <p className="text-slate-500 font-medium">No history yet</p>
        <p className="text-sm text-slate-400 mt-1">Analysed agreements will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">History</h2>
        <button
          onClick={onClear}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-3">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="w-full text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl p-4 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 text-sm">{entry.fileName}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{entry.analysis.summary}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-slate-400">{new Date(entry.uploadedAt).toLocaleDateString()}</p>
                <div className="flex gap-1 mt-1 justify-end">
                  {entry.analysis.riskFlags.some((f) => f.level === "HIGH") && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">High risk</span>
                  )}
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                    {entry.analysis.riskFlags.length} flags
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

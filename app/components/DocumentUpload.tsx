"use client";

import { useState, useRef, DragEvent } from "react";

interface Props {
  onSubmit: (formData: FormData) => void;
  loading: boolean;
}

export default function DocumentUpload({ onSubmit, loading }: Props) {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    if (!allowed.includes(file.type)) {
      alert("Please upload a PDF, DOCX, or TXT file.");
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleSubmit() {
    const fd = new FormData();
    if (mode === "upload" && selectedFile) {
      fd.append("file", selectedFile);
    } else if (mode === "paste" && pastedText.trim()) {
      fd.append("text", pastedText.trim());
    } else {
      alert(mode === "upload" ? "Please select a file." : "Please paste some text.");
      return;
    }
    onSubmit(fd);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Upload Agreement</h2>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setMode("upload")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Upload file
        </button>
        <button
          onClick={() => setMode("paste")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "paste" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Paste text
        </button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            dragging
              ? "border-indigo-400 bg-indigo-50"
              : selectedFile
              ? "border-green-400 bg-green-50"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {selectedFile ? (
            <div>
              <div className="text-3xl mb-2">✓</div>
              <p className="font-medium text-green-700">{selectedFile.name}</p>
              <p className="text-sm text-slate-500 mt-1">Click to change file</p>
            </div>
          ) : (
            <div>
              <div className="text-4xl mb-3 text-slate-400">↑</div>
              <p className="text-slate-600 font-medium">Drop your file here or click to browse</p>
              <p className="text-sm text-slate-400 mt-2">PDF, DOCX, or TXT</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste the full text of your rental or lease agreement here..."
          className="w-full h-48 border border-slate-300 rounded-xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analysing...
          </>
        ) : (
          "Analyse Agreement"
        )}
      </button>
    </div>
  );
}

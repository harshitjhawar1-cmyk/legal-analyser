"use client";

import { AnalysisResult, RiskFlag, KeyTerm } from "@/lib/types";

interface Props {
  analysis: AnalysisResult;
  fileName: string;
}

const riskColors: Record<RiskFlag["level"], { bg: string; text: string; badge: string }> = {
  HIGH: { bg: "bg-red-50 border-red-200", text: "text-red-800", badge: "bg-red-100 text-red-700" },
  MEDIUM: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", badge: "bg-amber-100 text-amber-700" },
  LOW: { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700" },
};

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function BulletList({ items, color }: { items: string[]; color: string }) {
  if (!items.length) return <p className="text-sm text-slate-400 italic">None identified.</p>;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-2 text-sm ${color}`}>
          <span className="mt-0.5 flex-shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AnalysisResultView({ analysis, fileName }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Analysis Results</h2>
          <p className="text-sm text-slate-400 mt-1">{fileName}</p>
        </div>
      </div>

      {/* Summary */}
      <Section title="Plain-English Summary" icon="📄">
        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
          {analysis.summary}
        </p>
      </Section>

      {/* Key Terms */}
      {analysis.keyTerms.length > 0 && (
        <Section title="Key Terms" icon="🔑">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.keyTerms.map((term: KeyTerm, i: number) => (
              <div key={i} className="bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{term.label}</p>
                <p className="text-sm font-medium text-slate-800 mt-0.5">{term.value}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Risk Flags */}
      <Section title="Risk Flags" icon="⚠️">
        {analysis.riskFlags.length === 0 ? (
          <p className="text-sm text-slate-400 italic">No significant risks identified.</p>
        ) : (
          <div className="space-y-3">
            {analysis.riskFlags.map((flag: RiskFlag, i: number) => {
              const colors = riskColors[flag.level];
              return (
                <div key={i} className={`rounded-xl border p-4 ${colors.bg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                      {flag.level}
                    </span>
                    <span className={`text-sm font-semibold ${colors.text}`}>{flag.title}</span>
                  </div>
                  <p className={`text-sm ${colors.text}`}>{flag.description}</p>
                  {flag.clause && (
                    <p className="text-xs mt-2 italic text-slate-500 border-l-2 border-slate-300 pl-2">
                      "{flag.clause}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* At a Loss */}
      <Section title="Where You Could Be at a Loss" icon="🔴">
        <BulletList items={analysis.atALoss} color="text-red-700" />
      </Section>

      {/* At an Advantage */}
      <Section title="Where You Have an Advantage" icon="🟢">
        <BulletList items={analysis.atAnAdvantage} color="text-green-700" />
      </Section>

      {/* Gaps */}
      <Section title="Gaps & Missing Clauses" icon="🔍">
        <BulletList items={analysis.gaps} color="text-slate-600" />
      </Section>
    </div>
  );
}

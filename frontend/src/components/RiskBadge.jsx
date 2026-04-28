import React from "react";

const levelColor = {
  LOW: { border: "border-green-500/40", text: "text-green-400", bg: "bg-green-500/10", bar: "bg-green-500" },
  MODERATE: { border: "border-yellow-500/40", text: "text-yellow-400", bg: "bg-yellow-500/10", bar: "bg-yellow-500" },
  HIGH: { border: "border-orange-500/50", text: "text-orange-400", bg: "bg-orange-500/10", bar: "bg-orange-500" },
  CRITICAL: { border: "border-red-500/60", text: "text-red-400", bg: "bg-red-500/10", bar: "bg-red-500" },
};

export const RiskBadge = ({ level, className = "" }) => {
  const c = levelColor[level] || levelColor.LOW;
  return (
    <span
      data-testid={`risk-badge-${level}`}
      className={`inline-flex items-center gap-1.5 px-2 py-1 border ${c.border} ${c.text} ${c.bg} font-mono text-[10px] uppercase tracking-[0.2em] ${className}`}
    >
      <span className={`h-1.5 w-1.5 ${c.bar}`} />
      {level}
    </span>
  );
};

export const RiskBar = ({ score = 0, level = "LOW" }) => {
  const c = levelColor[level] || levelColor.LOW;
  const pct = Math.max(0, Math.min(100, score));
  return (
    <div className="w-full h-1 bg-white/10 overflow-hidden">
      <div className={`h-full ${c.bar}`} style={{ width: `${pct}%` }} />
    </div>
  );
};

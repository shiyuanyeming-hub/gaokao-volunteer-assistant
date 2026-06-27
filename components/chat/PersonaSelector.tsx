"use client";

import { PERSONA_MODES, type PersonaMode } from "@/lib/constants";

interface PersonaSelectorProps {
  value: PersonaMode;
  onChange: (mode: PersonaMode) => void;
}

export function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-xf-darker/80 border-b border-white/10">
      <span className="text-xs font-bold text-white/40 uppercase tracking-wider">
        人格模式
      </span>
      {PERSONA_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            value === mode.id
              ? "bg-xf-red text-white shadow-lg shadow-red-500/20"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          <span className={`size-2 rounded-full ${mode.dot}`} />
          <span className="hidden sm:inline">{mode.name}</span>
          <span className="sm:hidden">{mode.name.slice(0, 2)}</span>
        </button>
      ))}
    </div>
  );
}

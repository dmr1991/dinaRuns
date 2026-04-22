"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

// Definimos las interfaces aquí mismo para que no te dé error de "module not found"
export interface BodyCheckData {
  footCondition: string;
  kneeCondition: string;
  energy: number;
  notes: string;
}

interface Props {
  data: BodyCheckData;
  onChange: (data: BodyCheckData) => void;
}

const CONDITIONS = ["Good", "Tight", "Sore", "Pain"];

export default function BodyCheck({ data, onChange }: Props) {
  const update = (patch: Partial<BodyCheckData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-black italic tracking-tighter uppercase text-primary">
        Body <span className="text-white">Check</span>
      </h3>

      {/* Foot Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          🦶 Foot Condition
        </label>
        <div className="flex gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => update({ footCondition: c })}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95",
                data.footCondition === c
                  ? c === "Pain"
                    ? "bg-destructive text-white shadow-lg shadow-destructive/20"
                    : "bg-secondary text-white shadow-lg shadow-secondary/20"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Knee Selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          🦵 Knee Condition
        </label>
        <div className="flex gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => update({ kneeCondition: c })}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95",
                data.kneeCondition === c
                  ? c === "Pain"
                    ? "bg-destructive text-white shadow-lg shadow-destructive/20"
                    : "bg-secondary text-white shadow-lg shadow-secondary/20"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Energy Level */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          ⚡ Energy Level
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => update({ energy: lvl })}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-black transition-all duration-200 active:scale-95",
                data.energy === lvl
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60",
              )}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Area */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          📝 Training Notes
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="¿Cómo te sentiste hoy, Dina?"
          rows={4}
          className="w-full bg-muted/40 border border-white/5 rounded-[1.5rem] px-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
        />
      </div>
    </div>
  );
}

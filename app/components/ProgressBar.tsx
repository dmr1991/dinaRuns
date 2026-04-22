"use client";

import React from "react";
import { Flame, TrendingUp } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ProgressBarProps {
  // Recibimos los datos completados para calcular el % en tiempo real
  completedDays: string[];
  totalWorkoutDays: number;
  streak?: number;
}

export default function ProgressBar({
  completedDays,
  totalWorkoutDays,
  streak = 3,
}: ProgressBarProps) {
  // Calculamos el porcentaje
  const pct =
    totalWorkoutDays > 0
      ? Math.round((completedDays.length / totalWorkoutDays) * 100)
      : 0;

  return (
    <div className="flex items-center gap-6 animate-in fade-in duration-700">
      {/* Progress Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-secondary" />
            Weekly <span className="text-white/40">Goal</span>
          </span>
          <span className="text-sm font-black italic text-primary tracking-tighter">
            {pct}%
          </span>
        </div>

        {/* Bar Container */}
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-white/5 p-[2px]">
          <div
            className="h-full bg-gradient-to-r from-primary via-[#ff7eb3] to-secondary rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(228,1,89,0.3)]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Streak Badge */}
      {streak > 0 && (
        <div className="flex flex-col items-center justify-center bg-card border border-white/10 px-4 py-2 rounded-[1.2rem] shadow-xl relative overflow-hidden group">
          {/* Brillo de fondo sutil */}
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />

          <div className="relative flex flex-col items-center">
            <Flame
              className="w-4 h-4 text-primary mb-0.5"
              fill="currentColor"
            />
            <span className="text-sm font-black italic text-white leading-none">
              {streak}
              <span className="text-[10px] lowercase not-italic text-primary">
                w
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

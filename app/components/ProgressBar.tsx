"use client";

import React from "react";
import { Flame, TrendingUp } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ProgressBarProps {
  completedDays: string[];
  totalWorkoutDays: number;
  intensity?: number;
}

export default function ProgressBar({
  completedDays,
  totalWorkoutDays,
  intensity = 0,
}: ProgressBarProps) {
  const pct =
    totalWorkoutDays > 0
      ? Math.round((completedDays.length / totalWorkoutDays) * 100)
      : 0;

  // Colores de fuego real
  const getFireColor = () => {
    if (intensity === 0) return "rgba(255, 255, 255, 0.1)"; // Color del borde cuando está apagado
    if (intensity > 0.8) return "#ffeb3b"; // Amarillo brillante
    if (intensity > 0.4) return "#ff9800"; // Naranja fuego
    return "#f44336"; // Rojo brasa
  };

  return (
    <div className="flex items-center gap-6 animate-in fade-in duration-700">
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

        <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-white/5 p-[2px]">
          <div
            className="h-full bg-gradient-to-r from-primary via-[#ff7eb3] to-secondary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Flame Badge - Cuadrado perfecto */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 bg-card border border-white/10 rounded-2xl relative overflow-hidden transition-all duration-700",
          intensity > 0 ? "shadow-2xl shadow-orange-900/20" : "opacity-50"
        )}
      >
        {/* Brillo de fondo: Solo aparece si hay intensidad */}
        {intensity > 0 && (
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              backgroundColor: `rgba(255, 87, 34, ${0.05 + intensity * 0.15})`,
            }}
          />
        )}

        <div className="relative flex items-center justify-center">
          {/* Aura de calor: Solo si hay progreso */}
          {intensity > 0 && (
            <div
              className="absolute inset-0 bg-orange-600 blur-lg rounded-full animate-pulse"
              style={{ 
                opacity: intensity * 0.6,
                transform: `scale(${1 + intensity})` 
              }}
            />
          )}

          <Flame
            size={22}
            strokeWidth={1.5}
            className="transition-all duration-700 relative z-10"
            style={{
              color: getFireColor(),
              // RELLENO DINÁMICO: 0 si intensidad es 0, aumenta con el progreso
              fill: getFireColor(),
              fillOpacity: intensity > 0 ? 0.3 + (intensity * 0.7) : 0,
              filter: intensity > 0 
                ? `drop-shadow(0 0 ${4 + intensity * 15}px rgba(255, 152, 0, ${0.4 + intensity}))` 
                : 'none',
              transform: `scale(${1 + intensity * 0.3})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
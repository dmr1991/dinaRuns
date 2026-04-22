"use client";

import { useState } from "react";
import { Check, Flame, Moon, Dumbbell, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";

// Definición de tipos para evitar errores de importación
export type DayType = "run" | "rest" | "strength";

export interface DayLog {
  completed: boolean;
  energyLevel: number;
  notes: string;
}

export interface WeekData {
  days: { [key: number]: DayLog };
}

// Datos constantes del plan (basados en tu especificación)
const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run", type: "run" as DayType, notes: "" },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" as DayType, notes: "Short and easy" },
  { day: "Wednesday", workout: "Rest", type: "rest" as DayType, notes: "" },
  { day: "Thursday", workout: "Run", type: "run" as DayType, notes: "" },
  { day: "Friday", workout: "Routine A", type: "strength" as DayType, notes: "" },
  { day: "Saturday", workout: "Rest", type: "rest" as DayType, notes: "" },
  { day: "Sunday", workout: "Routine B (Optional)", type: "strength" as DayType, notes: "Optional day" }
];

const typeIcon = (type: DayType) => {
  switch (type) {
    case "run": return <Flame className="w-4 h-4" />;
    case "rest": return <Moon className="w-4 h-4" />;
    case "strength": return <Dumbbell className="w-4 h-4" />;
  }
};

const typeColor = (type: DayType) => {
  switch (type) {
    case "run": return "text-primary";
    case "rest": return "text-muted-foreground";
    case "strength": return "text-secondary";
  }
};

const energyEmoji = (level: number) => ["😴", "😐", "🙂", "💪", "🔥"][level - 1] || "🙂";

interface Props {
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function WeeklyPlanner({ data, onChange }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const getDayLog = (i: number): DayLog =>
    data.days[i] || { completed: false, energyLevel: 3, notes: "" };

  const updateDay = (i: number, patch: Partial<DayLog>) => {
    const current = getDayLog(i);
    onChange({
      ...data,
      days: { ...data.days, [i]: { ...current, ...patch } },
    });
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      {WEEKLY_PLAN.map((day, i) => {
        const log = getDayLog(i);
        const isRest = day.type === "rest";
        const expanded = expandedDay === i;

        return (
          <motion.div
            key={day.day}
            layout
            className={cn(
              "rounded-[1.5rem] border transition-all overflow-hidden",
              log.completed ? "bg-primary/5 border-primary/30" : "bg-card border-white/5"
            )}
          >
            <button
              onClick={() => setExpandedDay(expanded ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              {/* Checkbox */}
              {!isRest && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    updateDay(i, { completed: !log.completed });
                  }}
                  className={cn(
                    "w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer",
                    log.completed
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "border-muted-foreground/30 hover:border-primary"
                  )}
                >
                  {log.completed && <Check className="w-4 h-4 stroke-[4px]" />}
                </div>
              )}
              {isRest && <div className="w-7 h-7 flex items-center justify-center text-muted-foreground/40"><Moon size={18}/></div>}

              <div className="flex flex-col flex-1">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest leading-none mb-1", typeColor(day.type))}>
                  {day.day}
                </span>
                <span className={cn("flex items-center gap-1.5 text-base font-black tracking-tight", isRest ? "text-muted-foreground/40" : "text-white")}>
                  {typeIcon(day.type)}
                  {day.workout}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {log.energyLevel > 0 && !isRest && log.completed && (
                  <span className="text-base">{energyEmoji(log.energyLevel)}</span>
                )}
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground/50" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {expanded && !isRest && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4 bg-black/20">
                    {/* Energy Selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Energy Level</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateDay(i, { energyLevel: lvl })}
                            className={cn(
                              "flex-1 h-10 rounded-xl text-xs font-black transition-all active:scale-90",
                              log.energyLevel === lvl
                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                                : "bg-muted/40 text-muted-foreground"
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Notes Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Notes</label>
                      <input
                        type="text"
                        value={log.notes}
                        onChange={(e) => updateDay(i, { notes: e.target.value })}
                        placeholder={day.notes || "¿Cómo te fue hoy?"}
                        className="w-full bg-muted/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground/30 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
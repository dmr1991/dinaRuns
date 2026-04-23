"use client";

import { useState } from "react";
import {
  Check,
  Moon,
  ChevronDown,
  ChevronUp,
  Footprints,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { WeekData, DayLog } from "@/app/lib/types";

interface Props {
  plan: any[]; // Recibe el plan desde page.tsx
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function WeeklyPlanner({ plan, data, onChange }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const getDayLog = (i: number): DayLog =>
    data.days[i] || {
      completed: false,
      energyLevel: 0,
      footCondition: "",
      kneeCondition: "",
      notes: "",
    };

  const updateDay = (i: number, patch: Partial<DayLog>) => {
    const current = getDayLog(i);
    onChange({
      ...data,
      days: { ...data.days, [i]: { ...current, ...patch } },
    });
  };

  return (
    <div className="space-y-3">
      {plan.map((day, i) => {
        const log = getDayLog(i);
        const isRest = day.type === "rest";
        const expanded = expandedDay === i;

        return (
          <motion.div
            key={day.day}
            layout
            className={cn(
              "rounded-[2rem] border transition-all duration-300 overflow-hidden",
              log.completed
                ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                : "bg-card border-white/5",
            )}
          >
            <button
              onClick={() => !isRest && setExpandedDay(expanded ? null : i)}
              className={cn(
                "w-full flex items-center gap-4 p-5 text-left",
                isRest ? "opacity-50 cursor-default" : "cursor-pointer",
              )}
            >
              {!isRest ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    updateDay(i, { completed: !log.completed });
                  }}
                  className={cn(
                    "w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500",
                    log.completed
                      ? "bg-primary border-primary text-white scale-110"
                      : "border-white/10 bg-white/5",
                  )}
                >
                  {log.completed && <Check className="w-5 h-5 stroke-[4px]" />}
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center text-muted-foreground/20">
                  <Moon size={20} />
                </div>
              )}

              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1.5">
                  {day.day}
                </span>
                <span
                  className={cn(
                    "text-base font-black italic uppercase tracking-tighter transition-colors",
                    log.completed ? "text-primary" : "text-white",
                  )}
                >
                  {day.workout}
                </span>
              </div>

              {!isRest && (
                <div className="text-muted-foreground/80">
                  {expanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              )}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <div className="px-6 pb-6 space-y-6 border-t border-white/5 pt-5 bg-white/[0.02]">
                    {/* Energy Select */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                        <Activity size={12} /> Energy Level
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateDay(i, { energyLevel: lvl })}
                            className={cn(
                              "flex-1 h-11 rounded-[1rem] text-xs font-black transition-all",
                              log.energyLevel === lvl
                                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-white/5 text-muted-foreground",
                            )}
                          >
                            {lvl === 1 ? "😴" : lvl === 5 ? "🔥" : lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Conditions */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Feet",
                          key: "footCondition",
                          icon: <Footprints size={12} />,
                          options: ["Good", "Tired", "Sore"],
                        },
                        {
                          label: "Knees",
                          key: "kneeCondition",
                          icon: <Activity size={12} />,
                          options: ["Good", "Weak", "Pain"],
                        },
                      ].map((group) => (
                        <div key={group.key} className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2">
                            {group.icon} {group.label}
                          </label>
                          <div className="flex flex-col gap-1.5">
                            {group.options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() =>
                                  updateDay(i, { [group.key]: opt } as any)
                                }
                                className={cn(
                                  "py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                  (log as any)[group.key] === opt
                                    ? "bg-white/10 text-white border border-white/10"
                                    : "text-muted-foreground hover:text-white",
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={log.notes}
                        onChange={(e) =>
                          updateDay(i, { notes: e.target.value })
                        }
                        placeholder="Add notes about your session..."
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-primary/30 transition-all placeholder:text-white/10"
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

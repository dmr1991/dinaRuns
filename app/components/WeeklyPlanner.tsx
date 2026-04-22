"use client";

import { useState } from "react";
import {
  Check,
  Flame,
  Moon,
  Dumbbell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { WeekData, DayType, DayLog } from "@/app/lib/types";

const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run", type: "run" as DayType },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" as DayType },
  { day: "Wednesday", workout: "Rest", type: "rest" as DayType },
  { day: "Thursday", workout: "Run", type: "run" as DayType },
  { day: "Friday", workout: "Routine A", type: "strength" as DayType },
  { day: "Saturday", workout: "Rest", type: "rest" as DayType },
  { day: "Sunday", workout: "Routine B", type: "strength" as DayType },
];

const typeIcon = (type: DayType) => {
  switch (type) {
    case "run":
      return <Flame className="w-4 h-4" />;
    case "rest":
      return <Moon className="w-4 h-4" />;
    case "strength":
      return <Dumbbell className="w-4 h-4" />;
  }
};

const energyEmoji = (level: number) =>
  ["😴", "😐", "🙂", "💪", "🔥"][level - 1] || "🙂";

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
    <div className="space-y-2">
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
              log.completed
                ? "bg-primary/5 border-primary/30"
                : "bg-card border-white/5",
            )}
          >
            <button
              onClick={() => setExpandedDay(expanded ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              {!isRest && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    updateDay(i, { completed: !log.completed });
                  }}
                  className={cn(
                    "w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all",
                    log.completed
                      ? "bg-primary border-primary text-white"
                      : "border-muted-foreground/30",
                  )}
                >
                  {log.completed && <Check className="w-4 h-4 stroke-[4px]" />}
                </div>
              )}
              {isRest && (
                <div className="w-7 h-7 flex items-center justify-center text-muted-foreground/40">
                  <Moon size={18} />
                </div>
              )}

              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {day.day}
                </span>
                <span className="flex items-center gap-1.5 text-base font-black text-white">
                  {typeIcon(day.type)} {day.workout}
                </span>
              </div>

              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {expanded && !isRest && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => updateDay(i, { energyLevel: lvl })}
                          className={cn(
                            "flex-1 h-10 rounded-xl text-xs font-black",
                            log.energyLevel === lvl
                              ? "bg-primary text-white"
                              : "bg-muted/40 text-muted-foreground",
                          )}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={log.notes}
                      onChange={(e) => updateDay(i, { notes: e.target.value })}
                      placeholder="Daily notes..."
                      className="w-full bg-muted/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none"
                    />
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

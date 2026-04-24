"use client";

import { useState } from "react";
import {
  Check,
  Moon,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Lock,
  Unlock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { WeekData, DayLog } from "@/app/lib/types";

const MY_SHOES = ["Gel Kayano 31", "Other"];

interface Props {
  plan: any[];
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function WeeklyPlanner({ plan, data, onChange }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState<number | null>(null);

  const getDayLog = (i: number): DayLog =>
    data.days[i] || {
      completed: false,
      energyLevel: 0,
      distance: "",
      shoes: "",
      footCondition: "",
      kneeCondition: "",
      shinCondition: "",
      hipCondition: "",
      avgHR: "",
      hrStatus: "",
      notes: "",
    };

  const updateDay = (i: number, patch: Partial<DayLog>) => {
    const current = getDayLog(i);
    onChange({
      ...data,
      days: { ...data.days, [i]: { ...current, ...patch } },
    });
  };

  const handleLockIn = (i: number) => {
    updateDay(i, { completed: true });
    setIsSaving(i);
    setTimeout(() => {
      setExpandedDay(null);
      setIsSaving(null);
    }, 600);
  };

  return (
    <div className="space-y-3">
      {plan.map((day, i) => {
        const log = getDayLog(i);
        const isRest = day.type === "rest";
        const expanded = expandedDay === i;
        const saving = isSaving === i;
        const isLocked = log.completed;

        return (
          <motion.div
            key={day.day}
            layout
            className={cn(
              "rounded-[2rem] border transition-all duration-500 overflow-hidden",
              isLocked
                ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                : "bg-card border-white/5",
              saving && "ring-2 ring-primary border-primary",
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
                    isLocked
                      ? "bg-primary border-primary text-white scale-110"
                      : "border-white/10 bg-white/5",
                  )}
                >
                  {isLocked && <Check className="w-5 h-5 stroke-[4px]" />}
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
                    isLocked ? "text-primary" : "text-white",
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
                  <div
                    className={cn(
                      "px-6 pb-6 space-y-7 border-t border-white/5 pt-5 bg-white/[0.02] transition-opacity duration-500",
                      isLocked && !saving
                        ? "opacity-60 pointer-events-none"
                        : "opacity-100",
                    )}
                  >
                    {/* KM & SHOES SECTION */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1">
                          <Zap size={12} /> Kilometers
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            inputMode="decimal"
                            disabled={isLocked}
                            value={log.distance}
                            onChange={(e) =>
                              updateDay(i, { distance: e.target.value })
                            }
                            placeholder="0.0"
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-2 text-xl font-black italic text-primary placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-primary/5 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase">
                            KM
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1">
                          <Activity size={12} /> Shoes
                        </label>
                        <div className="flex flex-col gap-1.5">
                          {MY_SHOES.map((shoe) => (
                            <button
                              key={shoe}
                              disabled={isLocked}
                              onClick={() => updateDay(i, { shoes: shoe })}
                              className={cn(
                                "py-2 px-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all",
                                log.shoes === shoe
                                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/10"
                                  : "bg-white/5 text-muted-foreground border-white/5",
                              )}
                            >
                              {shoe}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* HR Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 ml-1">
                        <Heart
                          size={12}
                          className="text-primary animate-pulse"
                        />
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60">
                          Average Heart Rate
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          disabled={isLocked}
                          value={log.avgHR}
                          onChange={(e) =>
                            updateDay(i, { avgHR: e.target.value })
                          }
                          placeholder="000"
                          className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-2 text-xl font-black italic text-primary placeholder:text-white/10 outline-none focus:border-primary/40 focus:bg-primary/5 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase pointer-events-none">
                          BPM
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {["Stable", "Varied", "High"].map((status) => (
                          <button
                            key={status}
                            disabled={isLocked}
                            onClick={() => updateDay(i, { hrStatus: status })}
                            className={cn(
                              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                              log.hrStatus === status
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : "bg-white/5 text-muted-foreground border border-white/5",
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Energy Level */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1">
                        <Activity size={12} /> Energy Level
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            disabled={isLocked}
                            onClick={() => updateDay(i, { energyLevel: lvl })}
                            className={cn(
                              "flex-1 h-11 rounded-xl text-xs font-black transition-all",
                              log.energyLevel === lvl
                                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-white/5 text-muted-foreground",
                            )}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body Conditions Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          label: "Feet",
                          key: "footCondition",
                          options: ["Good", "Tired", "Pain"],
                        },
                        {
                          label: "Shins",
                          key: "shinCondition",
                          options: ["Good", "Tight", "Pain"],
                        },
                        {
                          label: "Hips",
                          key: "hipCondition",
                          options: ["Good", "Tight", "Pain"],
                        },
                        {
                          label: "Knees",
                          key: "kneeCondition",
                          options: ["Good", "Weak", "Pain"],
                        },
                      ].map((group) => (
                        <div key={group.key} className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1">
                            <Activity size={12} /> {group.label}
                          </label>
                          <div className="flex flex-col gap-1.5">
                            {group.options.map((opt) => (
                              <button
                                key={opt}
                                disabled={isLocked}
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

                    <input
                      type="text"
                      disabled={isLocked}
                      value={log.notes}
                      onChange={(e) => updateDay(i, { notes: e.target.value })}
                      placeholder="Add notes about your session..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-primary/30"
                    />
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={() =>
                        isLocked
                          ? updateDay(i, { completed: false })
                          : handleLockIn(i)
                      }
                      className={cn(
                        "w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                        isLocked
                          ? "bg-white/5 text-muted-foreground border border-white/10"
                          : "bg-primary text-white shadow-lg shadow-primary/10 active:scale-95",
                      )}
                    >
                      {saving ? (
                        <>
                          <Check size={14} className="stroke-[3px]" /> SAVED!
                        </>
                      ) : isLocked ? (
                        <>
                          <Unlock size={12} /> Unlock to Edit
                        </>
                      ) : (
                        <>
                          <Lock size={12} /> Lock It In
                        </>
                      )}
                    </button>
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

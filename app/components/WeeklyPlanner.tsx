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
  Timer,
  Trash2,
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
  const [showResetConfirm, setShowResetConfirm] = useState<number | null>(null);

  const getDayLog = (i: number): DayLog =>
    data.days[i] || {
      completed: false,
      energyLevel: 0,
      distance: "",
      avgPace: "",
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

  const resetDay = (i: number) => {
    const defaultLog: DayLog = {
      completed: false, energyLevel: 0, distance: "", avgPace: "",
      shoes: "", footCondition: "", kneeCondition: "", shinCondition: "",
      hipCondition: "", avgHR: "", hrStatus: "", notes: "",
    };
    onChange({ ...data, days: { ...data.days, [i]: defaultLog } });
    setShowResetConfirm(null);
  };

  const handleDistanceChange = (i: number, value: string) => {
    const sanitized = value.replace(",", ".");
    updateDay(i, { distance: sanitized });
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
    <div className="space-y-3 relative">
      {/* Estilo para quitar flechas del input number */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* --- CUSTOM MODAL AESTHETIC --- */}
      <AnimatePresence>
        {showResetConfirm !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6 bg-background/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs bg-card border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-black italic uppercase tracking-tighter mb-2">Clear Data?</h3>
              <p className="text-xs text-muted-foreground font-bold leading-relaxed mb-8">This will reset all progress for this day. This action cannot be undone.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => resetDay(showResetConfirm)}
                  className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
                >
                  Confirm Reset
                </button>
                <button 
                  onClick={() => setShowResetConfirm(null)}
                  className="w-full py-4 bg-white/5 text-muted-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              isLocked ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-card border-white/5", 
              saving && "ring-2 ring-primary border-primary"
            )}
          >
            {/* Header */}
            <button onClick={() => !isRest && setExpandedDay(expanded ? null : i)} className={cn("w-full flex items-center gap-4 p-5 text-left", isRest ? "opacity-50 cursor-default" : "cursor-pointer")}>
              {!isRest ? (
                <div onClick={(e) => { e.stopPropagation(); updateDay(i, { completed: !log.completed }); }} className={cn("w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500", isLocked ? "bg-primary border-primary text-white scale-110" : "border-white/10 bg-white/5")}>
                  {isLocked && <Check className="w-5 h-5 stroke-[4px]" />}
                </div>
              ) : <div className="w-8 h-8 flex items-center justify-center text-muted-foreground/20"><Moon size={20} /></div>}
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1.5">{day.day}</span>
                <span className={cn("text-base font-black italic uppercase tracking-tighter transition-colors", isLocked ? "text-primary" : "text-white")}>{day.workout}</span>
              </div>
              {!isRest && <div className="text-muted-foreground/80">{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className={cn("px-6 pb-6 space-y-7 border-t border-white/5 pt-5 bg-white/[0.02] transition-opacity duration-500", isLocked && !saving ? "opacity-60 pointer-events-none" : "opacity-100")}>
                    
                    {/* SECCIÓN 1: DISTANCIA Y ZAPATOS */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Zap size={12} /> Kilometers</label>
                        <div className="relative">
                          <input type="text" inputMode="decimal" disabled={isLocked} value={log.distance} onChange={(e) => handleDistanceChange(i, e.target.value)} placeholder="0.0" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-2 text-xl font-black italic text-primary outline-none focus:border-primary/40 transition-all" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase">KM</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Activity size={12} /> Shoes</label>
                        <div className="flex flex-col gap-1.5">
                          {MY_SHOES.map((shoe) => (
                            <button key={shoe} disabled={isLocked} onClick={() => updateDay(i, { shoes: shoe })} className={cn("py-2 px-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all", log.shoes === shoe ? "bg-primary text-white border-primary shadow-lg" : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/30 hover:bg-white/[0.07]")}>{shoe}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SECCIÓN 2: PACE Y HEART RATE */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Timer size={12} /> Avg Pace</label>
                        <div className="relative">
                          <input type="text" disabled={isLocked} value={log.avgPace || ""} onChange={(e) => updateDay(i, { avgPace: e.target.value })} placeholder="0:00" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-2 text-xl font-black italic text-primary outline-none focus:border-primary/40 transition-all" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase">/KM</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Heart size={12} /> Avg HR</label>
                        <div className="relative">
                          <input type="number" inputMode="numeric" disabled={isLocked} value={log.avgHR} onChange={(e) => updateDay(i, { avgHR: e.target.value })} placeholder="000" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-2 text-xl font-black italic text-primary outline-none focus:border-primary/40 transition-all" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase">BPM</span>
                        </div>
                      </div>
                    </div>

                    {/* HR STATUS */}
                    <div className="flex gap-2">
                      {["Stable", "Varied", "High"].map((status) => (
                        <button key={status} disabled={isLocked} onClick={() => updateDay(i, { hrStatus: status })} className={cn("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all", log.hrStatus === status ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white/5 text-muted-foreground border border-white/10 hover:border-white/30 hover:bg-white/[0.07]")}>{status}</button>
                      ))}
                    </div>

                    {/* ENERGY LEVEL */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Activity size={12} /> Energy Level</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button key={lvl} disabled={isLocked} onClick={() => updateDay(i, { energyLevel: lvl })} className={cn("flex-1 h-11 rounded-xl text-xs font-black transition-all", log.energyLevel === lvl ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")}>{lvl}</button>
                        ))}
                      </div>
                    </div>

                    {/* BODY STATUS CON BORDES FINITOS */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Feet", key: "footCondition", options: ["Good", "Tired", "Discomfort", "Pain"] },
                        { label: "Shins", key: "shinCondition", options: ["Good", "Tight", "Discomfort", "Pain"] },
                        { label: "Hips", key: "hipCondition", options: ["Good", "Tight", "Discomfort", "Pain"] },
                        { label: "Knees", key: "kneeCondition", options: ["Good", "Weak", "Discomfort", "Pain"] },
                      ].map((group) => (
                        <div key={group.key} className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 flex items-center gap-2 ml-1"><Activity size={12} /> {group.label}</label>
                          <div className="flex flex-col gap-1.5">
                            {group.options.map((opt) => (
                              <button
                                key={opt}
                                disabled={isLocked}
                                onClick={() => updateDay(i, { [group.key]: opt } as any)}
                                className={cn(
                                  "py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border", 
                                  (log as any)[group.key] === opt 
                                    ? "bg-white/10 text-white border-white/20" 
                                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <input type="text" disabled={isLocked} value={log.notes} onChange={(e) => updateDay(i, { notes: e.target.value })} placeholder="Add notes..." className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-primary/30" />
                  </div>

                  <div className="flex gap-3 px-6 pb-6 mt-4">
                    {!isLocked && (
                      <button 
                        onClick={() => setShowResetConfirm(i)} 
                        className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-all hover:bg-red-500/20 hover:border-red-500/40 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => isLocked ? updateDay(i, { completed: false }) : handleLockIn(i)} 
                      className={cn(
                        "py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95", 
                        isLocked 
                          ? "flex-1 bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10" 
                          : "flex-[4] bg-primary text-white shadow-lg hover:brightness-110 hover:shadow-primary/30"
                      )}
                    >
                      {saving ? <><Check size={14} /> SAVED!</> : isLocked ? <><Unlock size={12} /> Unlock</> : <><Lock size={12} /> Lock It In</>}
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
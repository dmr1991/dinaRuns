"use client";
import React, { useState } from 'react';
import { Calendar, Dumbbell, Heart, Check, Flame, Moon, Zap } from 'lucide-react';
import { cn } from "@/app/lib/utils";

const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run", type: "run" },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" },
  { day: "Wednesday", workout: "Rest", type: "rest" },
  { day: "Thursday", workout: "Run", type: "run" },
  { day: "Friday", workout: "Routine A", type: "strength" },
  { day: "Saturday", workout: "Rest", type: "rest" },
  { day: "Sunday", workout: "Routine B", type: "strength" }
];

export default function Page() {
  const [tab, setTab] = useState('week');
  const [completed, setCompleted] = useState<string[]>([]);

  const workoutDays = WEEKLY_PLAN.filter(d => d.type !== 'rest').length;
  const progress = Math.round((completed.length / workoutDays) * 100);

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <header className="pt-4 mb-8">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">
          DINA<span className="text-primary font-black">RUNS</span>
        </h1>
        
        <div className="mt-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Weekly Progress</span>
            <span className="text-primary font-black text-lg">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex bg-muted/50 backdrop-blur-sm p-1 rounded-2xl mb-8 border border-white/5 sticky top-0 z-10">
        {['week', 'A', 'B', 'body'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all",
              tab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Listado de días */}
      <main className="space-y-3">
        {tab === 'week' && WEEKLY_PLAN.map((item) => {
          const isDone = completed.includes(item.day);
          const isRest = item.type === 'rest';
          return (
            <div 
              key={item.day}
              onClick={() => !isRest && setCompleted(prev => 
                prev.includes(item.day) ? prev.filter(d => d !== item.day) : [...prev, item.day]
              )}
              className={cn(
                "flex items-center justify-between p-5 rounded-[1.8rem] border transition-all duration-300 cursor-pointer active:scale-95",
                isDone 
                  ? "bg-primary/5 border-primary/30" // Fondo rosado muy suave cuando está hecho
                  : isRest ? "bg-muted/20 border-transparent opacity-60" : "bg-card border-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                {!isRest ? (
                  <div className={cn(
                    "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
                    isDone 
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(228,1,89,0.4)]" // Rosa sólido y brillo
                      : "border-muted-foreground/30 bg-transparent"
                  )}>
                    {isDone && <Check size={18} strokeWidth={4} className="animate-in zoom-in duration-300" />}
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center text-muted-foreground/40">
                    <Moon size={20} />
                  </div>
                )}
                <div>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    isDone ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.day}
                  </p>
                  <p className={cn(
                    "text-base font-black tracking-tight",
                    isRest ? "text-muted-foreground/40" : "text-white"
                  )}>
                    {item.workout}
                  </p>
                </div>
              </div>
              {!isRest && (
                <Flame 
                  size={20} 
                  className={isDone ? "text-primary" : "text-primary/10"} 
                  fill={isDone ? "currentColor" : "none"} 
                />
              )}
            </div>
          );
        })}
      </main>

      {/* Streak Badge */}
      <div className="fixed bottom-10 right-6 sm:absolute sm:bottom-10">
        <div className="bg-card border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <div className="bg-primary/20 p-2 rounded-xl text-primary animate-pulse">
            <Zap size={16} fill="currentColor" />
          </div>
          <div className="pr-1">
            <p className="text-[9px] font-black text-muted-foreground uppercase leading-none">Streak</p>
            <p className="text-sm font-black italic text-white tracking-widest">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
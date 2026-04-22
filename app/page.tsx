"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Dumbbell,
  Heart,
  Check,
  Flame,
  Moon,
  Zap,
  Trophy,
} from "lucide-react";

const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run", type: "run" },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" },
  { day: "Wednesday", workout: "Rest", type: "rest" },
  { day: "Thursday", workout: "Run", type: "run" },
  { day: "Friday", workout: "Routine A", type: "strength" },
  { day: "Saturday", workout: "Rest", type: "rest" },
  { day: "Sunday", workout: "Routine B (Optional)", type: "strength" },
];

export default function DinaRuns() {
  const [activeTab, setActiveTab] = useState("week");
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  const workoutDays = WEEKLY_PLAN.filter((d) => d.type !== "rest").length;
  const progress = Math.round((completedDays.length / workoutDays) * 100);

  return (
    // CONTENEDOR RAIZ: Ocupa toda la pantalla y centra el "celular"
    <div className="min-h-screen bg-[#050505] flex justify-center items-start sm:items-center sm:p-8">
      {/* EL "DISPOSITIVO": En móvil es full screen, en desktop parece una app */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:h-[850px] bg-background sm:rounded-[3rem] sm:border-[8px] sm:border-muted overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col">
        <div className="p-6 flex-1">
          {/* Brand Header */}
          <header className="pt-4 mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                DINA<span className="text-primary font-black">RUNS</span>
              </h1>
              <div className="bg-muted px-3 py-1 rounded-full flex items-center gap-2">
                <Trophy size={14} className="text-primary" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  Lvl 1
                </span>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                  Weekly Flow
                </span>
                <span className="text-primary font-black text-lg">
                  {progress}%
                </span>
              </div>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-primary via-[#ff7eb3] to-secondary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(230,40,138,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </header>

          {/* Pill Navigation */}
          <nav className="flex bg-muted/40 backdrop-blur-md p-1.5 rounded-2xl mb-8 border border-white/5 sticky top-0 z-10">
            {[
              { id: "week", label: "Week", icon: <Calendar size={14} /> },
              { id: "A", label: "Rout. A", icon: <Dumbbell size={14} /> },
              { id: "B", label: "Rout. B", icon: <Dumbbell size={14} /> },
              { id: "body", label: "Body", icon: <Heart size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-xl scale-[1.03]"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          {/* List Section */}
          <main className="space-y-3 pb-10">
            {activeTab === "week" &&
              WEEKLY_PLAN.map((item) => (
                <div
                  key={item.day}
                  onClick={() =>
                    item.type !== "rest" &&
                    setCompletedDays((prev) =>
                      prev.includes(item.day)
                        ? prev.filter((d) => d !== item.day)
                        : [...prev, item.day],
                    )
                  }
                  className={`group flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-300 ${
                    completedDays.includes(item.day)
                      ? "bg-accent/10 border-accent/40 shadow-[inset_0_0_20px_rgba(46,184,114,0.05)]"
                      : item.type === "rest"
                        ? "bg-muted/20 border-transparent opacity-60"
                        : "bg-card border-white/[0.03] hover:border-primary/40 active:scale-[0.98]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {item.type !== "rest" ? (
                      <div
                        className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all ${
                          completedDays.includes(item.day)
                            ? "bg-accent border-accent text-white"
                            : "border-muted"
                        }`}
                      >
                        {completedDays.includes(item.day) && (
                          <Check size={16} strokeWidth={4} />
                        )}
                      </div>
                    ) : (
                      <div className="w-7 h-7 flex items-center justify-center text-muted-foreground">
                        <Moon size={20} />
                      </div>
                    )}
                    <div>
                      <p
                        className={`text-[10px] font-bold uppercase tracking-tighter ${completedDays.includes(item.day) ? "text-accent" : "text-muted-foreground"}`}
                      >
                        {item.day}
                      </p>
                      <p
                        className={`text-base font-bold tracking-tight ${item.type === "rest" ? "text-muted-foreground/50" : "text-white"}`}
                      >
                        {item.workout}
                      </p>
                    </div>
                  </div>
                  {item.type === "run" && (
                    <Flame
                      size={20}
                      className={
                        completedDays.includes(item.day)
                          ? "text-accent"
                          : "text-primary/40"
                      }
                    />
                  )}
                </div>
              ))}
          </main>
        </div>

        {/* Botón flotante estilo App */}
        <div className="absolute bottom-10 right-6 sm:bottom-12">
          <div className="bg-card border border-white/10 p-4 rounded-[2rem] shadow-2xl flex items-center gap-3 backdrop-blur-lg">
            <div className="bg-primary/20 p-2.5 rounded-2xl text-primary animate-pulse">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="pr-2">
              <p className="text-[10px] font-black text-muted-foreground uppercase leading-none">
                Streak
              </p>
              <p className="text-lg font-black italic tracking-widest text-white">
                3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import WeeklyPlanner from "@/app/components/WeeklyPlanner";
import RoutineTracker from "@/app/components/RoutineTracker";
import { cn } from "@/app/lib/utils";
import { WeekData, DayType } from "@/app/lib/types";
import { Download } from "lucide-react";

// --- FUENTE DE VERDAD ÚNICA ---
// Modifica esto y se actualizará la App entera y el Reporte CSV
const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run + Routine A", type: "run" as DayType },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" as DayType },
  { day: "Wednesday", workout: "Rest", type: "rest" as DayType },
  { day: "Thursday", workout: "Run", type: "run" as DayType },
  { day: "Friday", workout: "Routine B", type: "strength" as DayType },
  { day: "Saturday", workout: "Rest", type: "rest" as DayType },
  { day: "Sunday", workout: "Rest", type: "rest" as DayType },
];

export default function Page() {
  const [tab, setTab] = useState("week");
  const [weekData, setWeekData] = useState<WeekData>({
    days: {},
    routines: {},
  });

  // Cálculo dinámico de días de entrenamiento (excluyendo "rest")
  const totalWorkoutDays = WEEKLY_PLAN.filter((d) => d.type !== "rest").length;

  const completedDaysKeys = Object.keys(weekData.days).filter(
    (key) => weekData.days[parseInt(key)].completed,
  );

  const calculateDailyStreak = () => {
    let streak = 0;
    for (let i = 0; i < WEEKLY_PLAN.length; i++) {
      if (weekData.days[i]?.completed) {
        streak++;
      } else {
        if (streak > 0) break;
      }
    }
    return streak;
  };

  const currentStreak = calculateDailyStreak();

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Day,Status,Workout,Energy,Feet,Knees,Notes\n";

    // Usamos el plan definido arriba para generar el CSV
    WEEKLY_PLAN.forEach((planItem, i) => {
      const log = weekData.days[i] || {
        completed: false,
        energyLevel: 0,
        footCondition: "",
        kneeCondition: "",
        notes: "",
      };

      const line = [
        planItem.day,
        log.completed ? "DONE" : "PENDING",
        planItem.workout,
        log.energyLevel,
        log.footCondition,
        log.kneeCondition,
        `"${log.notes.replace(/"/g, '""')}"`,
      ].join(",");

      csvContent += line + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `DinaRuns_Log_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <div className="max-w-md mx-auto px-6 pt-8 pb-32">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              DINA<span className="text-primary">RUNS</span>
            </h1>
            <button
              onClick={exportToCSV}
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-muted-foreground hover:text-primary transition-colors active:scale-95"
            >
              <Download size={18} />
            </button>
          </div>

          <ProgressBar
            completedDays={completedDaysKeys}
            totalWorkoutDays={totalWorkoutDays}
            streak={currentStreak}
          />
        </header>

        <nav className="flex bg-muted/20 backdrop-blur-xl p-1 rounded-[2rem] mb-10 border border-white/5 sticky top-6 z-50 shadow-2xl">
          {[
            { id: "week", label: "WEEK" },
            { id: "A", label: "RTN A" },
            { id: "B", label: "RTN B" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                tab === t.id
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-white",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {tab === "week" && (
            // Pasamos WEEKLY_PLAN como prop para que el Planner sepa qué mostrar
            <WeeklyPlanner
              plan={WEEKLY_PLAN}
              data={weekData}
              onChange={setWeekData}
            />
          )}
          {(tab === "A" || tab === "B") && (
            <RoutineTracker
              routineId={tab}
              data={weekData}
              onChange={setWeekData}
            />
          )}
        </main>
      </div>
    </div>
  );
}

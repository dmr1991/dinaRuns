"use client";

import React, { useState } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import WeeklyPlanner from "@/app/components/WeeklyPlanner";
import RoutineTracker from "@/app/components/RoutineTracker";
import { cn } from "@/app/lib/utils";
import { WeekData, DayType } from "@/app/lib/types";
import { Download } from "lucide-react";

// --- FUENTE DE VERDAD ÚNICA ---
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

  const totalWorkoutDays = WEEKLY_PLAN.filter((d) => d.type !== "rest").length;
  
  // Intensidad basada en total de días completados para la flama real
  const completedCount = Object.values(weekData.days).filter(d => d.completed).length;
  const progressIntensity = totalWorkoutDays > 0 ? completedCount / totalWorkoutDays : 0;

  const completedDaysKeys = Object.keys(weekData.days).filter(
    (key) => weekData.days[parseInt(key)].completed,
  );

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Day,Status,Workout,Energy,Feet,Shins,Hips,Knees,AvgHR,HRStatus,Notes\n";

    WEEKLY_PLAN.forEach((planItem, i) => {
      const log = weekData.days[i] || {
        completed: false, energyLevel: 0, footCondition: "", kneeCondition: "",
        shinCondition: "", hipCondition: "", avgHR: "", hrStatus: "", notes: "",
      };

      const line = [
        planItem.day, log.completed ? "DONE" : "PENDING", planItem.workout,
        log.energyLevel, log.footCondition, log.shinCondition, log.hipCondition,
        log.kneeCondition, log.avgHR, log.hrStatus,
        `"${log.notes.replace(/"/g, '""')}"`,
      ].join(",");

      csvContent += line + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DinaRuns_Log_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <div className="max-w-md mx-auto px-6 pb-32">
        
        {/* --- CABECERA FIJA (Sticky Header + Progress + Nav) --- */}
        <div className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl pt-8 pb-4 -mx-6 px-6">
          <header className="mb-8">
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
              intensity={progressIntensity} 
            />
          </header>

          <nav className="flex bg-muted/20 backdrop-blur-xl p-1 rounded-[2rem] border border-white/5 shadow-2xl">
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
        </div>
        {/* --- FIN CABECERA FIJA --- */}

        {/* Espaciado para que el contenido no empiece pegado al sticky */}
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
          {tab === "week" && (
            <WeeklyPlanner
              plan={WEEKLY_PLAN as any}
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
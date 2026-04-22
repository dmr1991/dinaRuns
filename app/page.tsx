"use client";

import React, { useState } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import WeeklyPlanner from "@/app/components/WeeklyPlanner";
import RoutineTracker from "@/app/components/RoutineTracker";
import { cn } from "@/app/lib/utils";
import { WeekData } from "@/app/lib/types";
import { Download } from "lucide-react";

export default function Page() {
  const [tab, setTab] = useState("week");
  const [weekData, setWeekData] = useState<WeekData>({
    days: {},
    routines: {},
  });

  // Cálculo de días completados
  const completedDaysKeys = Object.keys(weekData.days).filter(
    (key) => weekData.days[parseInt(key)].completed,
  );

  const totalWorkoutDays = 5;

  /**
   * Lógica de Daily Streak:
   * Cuenta cuántos días seguidos llevas completados de hoy hacia atrás.
   */
  const calculateDailyStreak = () => {
    const dayIndexes = [0, 1, 2, 3, 4, 5, 6]; // Lun a Dom
    let streak = 0;

    // Obtenemos el índice del día de hoy (0 = Lun, 6 = Dom)
    // Para simplificar, buscamos la racha máxima actual en la semana
    for (let i = 0; i < dayIndexes.length; i++) {
      if (weekData.days[i]?.completed) {
        streak++;
      } else {
        // Si el plan es "Rest" y no está marcado, podrías decidir si rompe racha o no.
        // Aquí, cualquier día no marcado rompe la continuidad visual.
        if (streak > 0) break;
      }
    }
    return streak;
  };

  const currentStreak = calculateDailyStreak();

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Dia,Estado,Entrenamiento,Energia,Pies,Rodillas,Notas\n";

    const days = [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sabado",
      "Domingo",
    ];
    const workouts = [
      "Run",
      "Run (Easy)",
      "Rest",
      "Run",
      "Routine A",
      "Rest",
      "Routine B",
    ];

    days.forEach((dayName, i) => {
      const log = weekData.days[i] || {
        completed: false,
        energyLevel: 3,
        footCondition: "Good",
        kneeCondition: "Good",
        notes: "",
      };

      const line = [
        dayName,
        log.completed ? "HECHO" : "PENDIENTE",
        workouts[i],
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

        {/* Nav Principal */}
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
            <WeeklyPlanner data={weekData} onChange={setWeekData} />
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

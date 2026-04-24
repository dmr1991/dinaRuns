"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import WeeklyPlanner from "@/app/components/WeeklyPlanner";
import RoutineTracker from "@/app/components/RoutineTracker";
import { cn } from "@/app/lib/utils";
import { WeekData, DayType } from "@/app/lib/types";
import { Download, CalendarDays } from "lucide-react";

const WEEKLY_PLAN = [
  { day: "Monday", workout: "Run + Routine A", type: "run" as DayType },
  { day: "Tuesday", workout: "Run (Easy)", type: "run" as DayType },
  { day: "Wednesday", workout: "Rest", type: "rest" as DayType },
  { day: "Thursday", workout: "Run", type: "run" as DayType },
  { day: "Friday", workout: "Routine B", type: "strength" as DayType },
  { day: "Saturday", workout: "Rest", type: "rest" as DayType },
  { day: "Sunday", workout: "Rest", type: "rest" as DayType },
];

function getMondayId(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

export default function Page() {
  const [tab, setTab] = useState("week");
  const [weekData, setWeekData] = useState<WeekData>({
    days: {},
    routines: {},
  });

  const currentWeekId = getMondayId(new Date());

  // Cargar datos de la semana actual
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/training?weekId=${currentWeekId}`);
        const data = await res.json();
        if (data) {
          setWeekData(data);
        }
      } catch (error) {
        console.error("Error cargando datos de MongoDB:", error);
      }
    };
    loadData();
  }, [currentWeekId]);

  const handleDataChange = async (newData: WeekData) => {
    setWeekData(newData);
    try {
      await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          weekId: currentWeekId, 
          weekData: newData 
        }),
      });
    } catch (error) {
      console.error("Error guardando en MongoDB:", error);
    }
  };

  // --- LÓGICA DE EXPORTACIÓN ---

  const generateCSVString = (weeksArray: any[]) => {
    let csv = "WeekID,Day,Status,Workout,Distance,AvgPace,Shoes,Energy,Feet,Shins,Hips,Knees,AvgHR,HRStatus,Notes\n";
    
    // Ordenar semanas por fecha antes de generar
    weeksArray.sort((a, b) => a.weekId.localeCompare(b.weekId)).forEach((weekDoc) => {
      WEEKLY_PLAN.forEach((planItem, i) => {
        const log = (weekDoc.weekData?.days || weekDoc.days)?.[i] || {};
        const line = [
          weekDoc.weekId || currentWeekId,
          planItem.day,
          log.completed ? "DONE" : "PENDING",
          planItem.workout,
          log.distance || "0",
          log.avgPace || "0:00",
          log.shoes || "N/A",
          log.energyLevel || 0,
          log.footCondition || "",
          log.shinCondition || "",
          log.hipCondition || "",
          log.kneeCondition || "",
          log.avgHR || "",
          log.hrStatus || "",
          `"${(log.notes || "").replace(/"/g, '""')}"`,
        ].join(",");
        csv += line + "\n";
      });
    });
    return csv;
  };

  const downloadFile = (content: string, fileName: string) => {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar solo la semana que estoy viendo
  const exportCurrentWeek = () => {
    const csv = generateCSVString([{ weekId: currentWeekId, weekData: weekData }]);
    downloadFile(csv, `DinaRuns_Week_${currentWeekId}.csv`);
  };

  // Descargar todo el mes actual
  const exportMonthlyCSV = async () => {
    const currentMonth = currentWeekId.substring(0, 7); // "2026-04"
    try {
      const res = await fetch(`/api/training?month=${currentMonth}`);
      const allWeeks = await res.json();

      if (!allWeeks || allWeeks.length === 0) {
        alert("No hay datos guardados para este mes aún.");
        return;
      }

      const csv = generateCSVString(allWeeks);
      downloadFile(csv, `DinaRuns_Monthly_${currentMonth}.csv`);
    } catch (error) {
      console.error("Error en descarga mensual:", error);
    }
  };

  // --- CÁLCULOS DE PROGRESO ---
  const totalWorkoutDays = WEEKLY_PLAN.filter((d) => d.type !== "rest").length;
  const completedCount = Object.values(weekData.days).filter((d) => d.completed).length;
  const progressIntensity = totalWorkoutDays > 0 ? completedCount / totalWorkoutDays : 0;
  const completedDaysKeys = Object.keys(weekData.days).filter(
    (key) => weekData.days[parseInt(key)].completed
  );

  return (
    <div className="min-h-screen bg-background text-white font-sans">
      <div className="max-w-md mx-auto px-6 pb-32">
        <div className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl pt-8 pb-4 -mx-6 px-6">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h1 className="text-2xl font-black italic tracking-tighter uppercase">
                  DINA<span className="text-primary">RUNS</span>
                </h1>
                <span className="text-[10px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase">
                  Week: {currentWeekId}
                </span>
              </div>
              
              <div className="flex gap-2">
                {/* Botón Mensual */}
                <button
                  onClick={exportMonthlyCSV}
                  title="Download Month"
                  className="flex items-center gap-2 px-4 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <CalendarDays size={16} />
                  <span>Month</span>
                </button>
                
                {/* Botón Semanal */}
                <button
                  onClick={exportCurrentWeek}
                  title="Download Week"
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl text-muted-foreground hover:text-primary transition-colors active:scale-95"
                >
                  <Download size={18} />
                </button>
              </div>
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
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
          {tab === "week" && (
            <WeeklyPlanner
              plan={WEEKLY_PLAN as any}
              data={weekData}
              onChange={handleDataChange}
            />
          )}
          {(tab === "A" || tab === "B") && (
            <RoutineTracker
              routineId={tab}
              data={weekData}
              onChange={handleDataChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
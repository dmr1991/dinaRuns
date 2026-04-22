"use client";

import React, { useState } from 'react';
import ProgressBar from "@/app/components/ProgressBar";
import WeeklyPlanner from "@/app/components/WeeklyPlanner";
import BodyCheck from "@/app/components/BodyCheck";
import RoutineTracker from "@/app/components/RoutineTracker";
import { cn } from "@/app/lib/utils";
import { WeekData, BodyCheckData } from "@/app/lib/types";

export default function Page() {
  const [tab, setTab] = useState('week');

  const [weekData, setWeekData] = useState<WeekData>({
    days: {},
    routines: {}
  });

  const [bodyData, setBodyData] = useState<BodyCheckData>({
    footCondition: "Good",
    kneeCondition: "Good",
    energy: 3,
    notes: ""
  });

  const completedDaysKeys = Object.keys(weekData.days).filter(
    key => weekData.days[parseInt(key)].completed
  );
  const totalWorkoutDays = 5;

  return (
    // Quitamos p-6 y usamos un contenedor interno para controlar el aire
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-md mx-auto px-6 pt-8 pb-28">
        
        {/* Header & Progress Bar */}
        <header className="mb-8">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-6">
            DINA<span className="text-primary">RUNS</span>
          </h1>
          
          <ProgressBar 
            completedDays={completedDaysKeys} 
            totalWorkoutDays={totalWorkoutDays} 
            streak={3} 
          />
        </header>

        {/* Navegación (Tabs) */}
        <nav className="flex bg-muted/20 backdrop-blur-xl p-1 rounded-[2rem] mb-8 border border-white/5 sticky top-6 z-50 shadow-2xl">
          {[
            { id: 'week', label: 'WEEK' },
            { id: 'A', label: 'RTN A' }, // Acortado para que quepa bien en móvil
            { id: 'B', label: 'RTN B' },
            { id: 'body', label: 'BODY' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 py-3 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all duration-300",
                tab === t.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Contenido principal */}
        <main className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          {tab === 'week' && (
            <WeeklyPlanner data={weekData} onChange={setWeekData} />
          )}

          {(tab === 'A' || tab === 'B') && (
            <RoutineTracker routineId={tab} data={weekData} onChange={setWeekData} />
          )}

          {tab === 'body' && (
            <BodyCheck data={bodyData} onChange={setBodyData} />
          )}
        </main>
      </div>
    </div>
  );
}
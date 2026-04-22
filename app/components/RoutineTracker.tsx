"use client";

import React from 'react';
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

// Definición de tipos para las rutinas (Routine A y B)
const ROUTINES = [
  {
    id: "A",
    name: "Routine A",
    rounds: "3-4",
    focus: ["Core", "Glutes"],
    exercises: [
      { name: "Plank", reps: "45s" },
      { name: "Squats", reps: "20" },
      { name: "Bird Dog", reps: "12/side" },
      { name: "Glute Bridge", reps: "15" },
    ]
  },
  {
    id: "B",
    name: "Routine B",
    rounds: "3-4",
    focus: ["Strength", "Stability"],
    exercises: [
      { name: "Push Ups", reps: "10-12" },
      { name: "Lunges", reps: "10/side" },
      { name: "Deadbug", reps: "15" },
      { name: "Superman", reps: "12" },
    ]
  }
];

// Interfaces de datos
export interface RoundLog { [key: number]: boolean; }
export interface RoutineLog { rounds: { [key: number]: RoundLog }; }
export interface WeekData { routines: { [key: string]: RoutineLog }; }

interface Props {
  routineId: string;
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function RoutineTracker({ routineId, data, onChange }: Props) {
  const routine = ROUTINES.find((r) => r.id === routineId);
  if (!routine) return null;

  const log: RoutineLog = data.routines[routineId] || { rounds: {} };
  const roundCount = parseInt(routine.rounds.split("-")[1]) || 3;

  const isChecked = (round: number, exercise: number) =>
    log.rounds[round]?.[exercise] || false;

  const toggle = (round: number, exercise: number) => {
    const roundLog: RoundLog = { ...(log.rounds[round] || {}) };
    roundLog[exercise] = !roundLog[exercise];
    const newLog: RoutineLog = {
      rounds: { ...log.rounds, [round]: roundLog },
    };
    onChange({
      ...data,
      routines: { ...data.routines, [routineId]: newLog },
    });
  };

  const roundProgress = (round: number) => {
    const total = routine.exercises.length;
    const done = routine.exercises.filter((_, ei) => isChecked(round, ei)).length;
    return { done, total };
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header de la Rutina */}
      <div className="pt-2">
        <h3 className="text-xl font-black italic tracking-tighter uppercase text-white">
          {routine.name}
        </h3>
        <div className="flex gap-2 mt-2">
          {routine.focus.map((f) => (
            <span key={f} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {f}
            </span>
          ))}
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-3 tracking-widest">
          {routine.rounds} Rounds Target
        </p>
      </div>

      {/* Rondas */}
      <div className="space-y-4">
        {Array.from({ length: roundCount }, (_, ri) => {
          const { done, total } = roundProgress(ri);
          const complete = done === total;
          return (
            <motion.div
              key={ri}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: ri * 0.1 }}
              className={cn(
                "rounded-[2rem] border p-5 transition-all duration-300",
                complete 
                  ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5" 
                  : "border-white/5 bg-card/50 backdrop-blur-sm"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                    R{ri + 1}
                  </span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/80">Round</span>
                </div>
                <span className={cn(
                  "text-xs font-black tracking-tighter px-3 py-1 rounded-lg bg-muted text-muted-foreground",
                  complete && "bg-primary text-white"
                )}>
                  {done}/{total}
                </span>
              </div>

              <div className="space-y-2">
                {routine.exercises.map((ex, ei) => {
                  const checked = isChecked(ri, ei);
                  return (
                    <button
                      key={ei}
                      onClick={() => toggle(ri, ei)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all active:scale-[0.98]",
                        checked ? "bg-white/5 opacity-60" : "hover:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                        checked ? "bg-primary border-primary text-white" : "border-muted-foreground/20"
                      )}>
                        {checked && <Check className="w-4 h-4 stroke-[4px]" />}
                      </div>
                      
                      <div className="flex-1">
                        <span className={cn(
                          "text-sm font-bold block leading-tight",
                          checked ? "line-through text-muted-foreground" : "text-white"
                        )}>
                          {ex.name}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                           {ex.reps} reps
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
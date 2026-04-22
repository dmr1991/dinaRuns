"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { WeekData, RoutineLog, RoundLog } from "@/app/lib/types";

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
    ],
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
    ],
  },
];

interface Props {
  routineId: string;
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function RoutineTracker({ routineId, data, onChange }: Props) {
  const routine = ROUTINES.find((r) => r.id === routineId);
  if (!routine) return null;

  const log: RoutineLog = data.routines[routineId] || { rounds: {} };
  const roundCount = 3;

  const isChecked = (round: number, exercise: number) =>
    log.rounds[round]?.[exercise] || false;

  const toggle = (round: number, exercise: number) => {
    const roundLog: RoundLog = { ...(log.rounds[round] || {}) };
    roundLog[exercise] = !roundLog[exercise];

    onChange({
      ...data,
      routines: {
        ...data.routines,
        [routineId]: { rounds: { ...log.rounds, [round]: roundLog } },
      },
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <h3 className="text-xl font-black italic uppercase text-white">
        {routine.name}
      </h3>
      {Array.from({ length: roundCount }, (_, ri) => (
        <motion.div
          key={ri}
          className="rounded-[2rem] border border-white/5 bg-card/50 p-5"
        >
          <span className="text-[10px] font-black text-primary uppercase mb-4 block">
            Round {ri + 1}
          </span>
          <div className="space-y-2">
            {routine.exercises.map((ex, ei) => {
              const checked = isChecked(ri, ei);
              return (
                <button
                  key={ei}
                  onClick={() => toggle(ri, ei)}
                  className="w-full flex items-center gap-3 py-2 text-left"
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0",
                      checked ? "bg-primary border-primary" : "border-muted",
                    )}
                  >
                    {checked && (
                      <Check size={14} strokeWidth={4} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      checked
                        ? "line-through text-muted-foreground"
                        : "text-white",
                    )}
                  >
                    {ex.name}{" "}
                    <span className="text-[10px] opacity-50 ml-1">
                      {ex.reps}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

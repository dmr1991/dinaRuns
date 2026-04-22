"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Dumbbell,
  Heart,
  Flame,
  Moon,
  Check,
  ChevronDown,
} from "lucide-react";

const EMOJIS: Record<number, string> = {
  1: "😴",
  2: "😐",
  3: "🙂",
  4: "💪",
  5: "🔥",
};

export default function DinaRuns() {
  const [activeTab, setActiveTab] = useState("week");
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  // Lógica de progreso según especificación
  const workoutDaysCount = 5; // Lun, Mar, Jue, Vie, Dom
  const progress = Math.round((completedDays.length / workoutDaysCount) * 100);

  return (
    <div className="max-w-md mx-auto min-h-screen p-4 pb-28">
      {/* Header */}
      <header className="pt-6 pb-3">
        <h1 className="text-xl font-black tracking-tight uppercase">
          DINA<span className="text-primary font-black italic">RUNS</span>
        </h1>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
            <span>Week</span>
          </div>
          <span className="text-primary font-bold">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="flex gap-1 bg-muted p-1 rounded-xl mb-6">
        {[
          { id: "week", label: "Week", icon: <Calendar size={14} /> },
          { id: "A", label: "A", icon: <Dumbbell size={14} /> },
          { id: "B", label: "B", icon: <Dumbbell size={14} /> },
          { id: "body", label: "Body", icon: <Heart size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg"
                : "text-muted-foreground"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {/* Weekly Planner */}
      {activeTab === "week" && (
        <div className="space-y-2">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <DayCard
              key={day}
              day={day}
              isDone={completedDays.includes(day)}
              onToggle={() =>
                setCompletedDays((prev) =>
                  prev.includes(day)
                    ? prev.filter((d) => d !== day)
                    : [...prev, day],
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DayCard({ day, isDone, onToggle }: any) {
  const isRest = day === "Wednesday" || day === "Saturday";

  return (
    <div
      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
        isDone ? "bg-accent/10 border-accent/30" : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        {!isRest && (
          <button
            onClick={onToggle}
            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
              isDone
                ? "bg-accent border-accent text-white"
                : "border-muted-foreground/30"
            }`}
          >
            {isDone && <Check size={14} strokeWidth={4} />}
          </button>
        )}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            {day.substring(0, 3)}
          </p>
          <p
            className={`text-sm font-bold ${isRest ? "text-muted-foreground" : ""}`}
          >
            {isRest ? "Rest" : "Workout"}
          </p>
        </div>
      </div>
      {isRest ? (
        <Moon size={16} className="text-muted-foreground" />
      ) : (
        <Flame size={16} className="text-primary" />
      )}
    </div>
  );
}


export type DayType = "run" | "rest" | "strength";

export interface DayLog {
  completed: boolean;
  energyLevel: number;
  notes: string;
}

export interface RoundLog {
  [key: number]: boolean;
}

export interface RoutineLog {
  rounds: { [key: number]: RoundLog };
}

export interface WeekData {
  days: { [key: number]: DayLog };
  routines: { [key: string]: RoutineLog };
}

export interface BodyCheckData {
  footCondition: string;
  kneeCondition: string;
  energy: number;
  notes: string;
}

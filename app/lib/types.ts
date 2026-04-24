export type DayType = "run" | "rest" | "strength" | "combined";
/**
 * Log detallado por cada día de la semana.
 * Ahora incluye la energía y el estado físico integrado.
 */
export interface DayLog {
  completed: boolean;
  energyLevel: number;
  footCondition: string;
  kneeCondition: string;
  shinCondition: string;
  hipCondition: string;
  avgHR: string;
  hrStatus: string;
  notes: string;
}
/**
 * Estado de cada ronda dentro de una rutina de fuerza.
 * Ej: { 0: true, 1: false } (el ejercicio 0 está hecho, el 1 no)
 */
export interface RoundLog {
  [key: number]: boolean;
}

/**
 * Log de una rutina completa (Routine A o B).
 */
export interface RoutineLog {
  rounds: { [key: number]: RoundLog };
}

/**
 * La estructura principal de datos de la semana.
 */
export interface WeekData {
  days: { [key: number]: DayLog };
  routines: { [key: string]: RoutineLog };
}

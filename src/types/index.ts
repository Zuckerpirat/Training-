export interface Exercise {
  id: string;
  n: string;
  s: number;
  r: string;
  g: string;
}

export interface DayPlan {
  lb: string;
  ic: string;
  sub: string;
  ex: Exercise[];
}

export type Plan = Record<string, DayPlan>;

export interface SetEntry {
  w: string;
  r: string;
}

export interface SessionData {
  type: string;
  dateKey: string;
  sets: Record<string, SetEntry[]>;
  ts: number;
}

export type Goal = 'cut' | 'maintain' | 'bulk';

export interface Profile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: Goal;
  kcal: { cut: number; maintain: number; bulk: number };
}

export type ThemeKey = 'dark' | 'light' | 'ocean' | 'forest';
export type SchedKey = 'A' | 'B' | 'C' | 'D';
export type DayKey = 'push' | 'pull' | 'legs' | string;

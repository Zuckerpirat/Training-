import type { Plan } from '../types';

export const DEFAULT_PLAN: Plan = {
  upper: {
    lb: 'UPPER', ic: '🔼', sub: 'Brust · Rücken · Schulter · Bizeps',
    ex: [
      { id: 'u1', n: 'Brustpresse Maschine',       s: 3, r: '6–10',  g: 'Brust' },
      { id: 'u2', n: 'Neutraler Latzug',           s: 3, r: '8–12',  g: 'Rücken' },
      { id: 'u3', n: 'Schrägbank Brustpresse',     s: 3, r: '8–12',  g: 'obere Brust' },
      { id: 'u4', n: 'Brustgestütztes Rudern',     s: 3, r: '8–12',  g: 'Rücken' },
      { id: 'u5', n: 'Seitheben Maschine',         s: 3, r: '15–20', g: 'Schulter' },
      { id: 'u6', n: 'Hammer Curls',               s: 2, r: '10–12', g: 'Bizeps' },
    ],
  },
  lower: {
    lb: 'LOWER', ic: '🔽', sub: 'Beine · Core · unterer Rücken',
    ex: [
      { id: 'd1', n: 'Leg Press',                  s: 3, r: '8–12',  g: 'Quad' },
      { id: 'd2', n: 'Hack Squat',                 s: 3, r: '8–12',  g: 'Quad' },
      { id: 'd3', n: 'Beinbeuger sitzend',         s: 3, r: '10–12', g: 'Hamstrings' },
      { id: 'd4', n: 'Wadenmaschine',              s: 3, r: '12–15', g: 'Waden' },
      { id: 'd5', n: 'Hyperextensions',            s: 2, r: '12–15', g: 'unterer Rücken' },
      { id: 'd6', n: 'Bauchmaschine / Kabelcrunch', s: 2, r: '12–15', g: 'Core' },
    ],
  },
  push: {
    lb: 'PUSH', ic: '⬆', sub: 'Brust · Schulter · Trizeps',
    ex: [
      { id: 'p1', n: 'Schrägbank Brustpresse',     s: 3, r: '8–12',  g: 'obere Brust' },
      { id: 'p2', n: 'Butterfly',                  s: 2, r: '10–15', g: 'Brust' },
      { id: 'p3', n: 'Brustpresse Maschine',       s: 2, r: '10–12', g: 'Brust' },
      { id: 'p4', n: 'Seitheben Maschine',         s: 3, r: '15–20', g: 'Schulter' },
      { id: 'p5', n: 'Reverse Butterfly',          s: 2, r: '15–20', g: 'hint. Schulter' },
      { id: 'p6', n: 'Trizeps Pushdown',           s: 3, r: '10–12', g: 'Trizeps' },
    ],
  },
  pull: {
    lb: 'PULL', ic: '⬇', sub: 'Rücken · Bizeps · hint. Schulter',
    ex: [
      { id: 'q1', n: 'Neutraler Latzug',           s: 3, r: '8–12',  g: 'Rücken' },
      { id: 'q2', n: 'Brustgestütztes Rudern',     s: 3, r: '8–12',  g: 'Rücken' },
      { id: 'q3', n: 'Einarmiger Kabel-Latzug',    s: 2, r: '10–12', g: 'Rücken' },
      { id: 'q4', n: 'Kabel-Überzüge',             s: 2, r: '12–15', g: 'Lat / Brust' },
      { id: 'q5', n: 'Hammer Curls',               s: 3, r: '8–12',  g: 'Bizeps' },
      { id: 'q6', n: 'Preacher Curls',             s: 2, r: '10–12', g: 'Bizeps' },
    ],
  },
};

export interface Schedule {
  name: string;
  short: string;
  hint: string;
  days: number[];
  td: Record<string, number[]>;
}

import type { SchedKey } from '../types';

// Wochentage: 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa, 0=So
// A: Standard — Mo Upper · Do Lower · Fr Push · Sa Pull
// B: Fr frei  — Mo Upper · Mi Lower · Do Push · Sa Pull
// C: Sa frei  — Mo Upper · Mi Lower · Do Push · Fr Pull
// D: Wochenende frei — Mo Push · Di Pull · Mi Lower · Fr Upper (entzerrt Recovery)
export const SCHED: Record<SchedKey, Schedule> = {
  A: {
    name: 'Mo·Do·Fr·Sa',
    short: 'Standard',
    hint: 'Mo Upper · Do Lower · Fr Push · Sa Pull',
    days: [1, 4, 5, 6],
    td: { upper: [1], lower: [4], push: [5], pull: [6] },
  },
  B: {
    name: 'Mo·Mi·Do·Sa',
    short: 'Fr frei',
    hint: 'Mo Upper · Mi Lower · Do Push · Sa Pull',
    days: [1, 3, 4, 6],
    td: { upper: [1], lower: [3], push: [4], pull: [6] },
  },
  C: {
    name: 'Mo·Mi·Do·Fr',
    short: 'Sa frei',
    hint: 'Mo Upper · Mi Lower · Do Push · Fr Pull',
    days: [1, 3, 4, 5],
    td: { upper: [1], lower: [3], push: [4], pull: [5] },
  },
  D: {
    name: 'Mo·Di·Mi·Fr',
    short: 'WE frei',
    hint: 'Mo Push · Di Pull · Mi Lower · Fr Upper',
    days: [1, 2, 3, 5],
    td: { push: [1], pull: [2], lower: [3], upper: [5] },
  },
};

export const ACCENT_VAR: Record<string, string> = {
  upper: 'var(--push)',
  lower: 'var(--legs)',
  push:  'var(--push)',
  pull:  'var(--pull)',
  legs:  'var(--legs)',
  home:  'var(--home)',
  workout:  'var(--push)',
  progress: 'var(--progress)',
  profile:  'var(--profile)',
  plan:     'var(--pull)',
};

export const GOAL_LABEL = { cut: 'Diät (Cut) 🔥', maintain: 'Erhalt ⚖️', bulk: 'Aufbau (Bulk) 💪' } as const;
export const GOAL_SHORT = { cut: 'Diät 🔥', maintain: 'Erhalt ⚖️', bulk: 'Aufbau 💪' } as const;
export const GOAL_VAR = { cut: 'var(--push)', maintain: 'var(--pull)', bulk: 'var(--legs)' } as const;

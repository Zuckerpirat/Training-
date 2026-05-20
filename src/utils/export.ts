import { LS } from './storage';
import { dk } from './dates';
import type { Plan, SessionData } from '../types';

function download(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportJSON(): void {
  const data = LS.all();
  download(
    'trainingsplan-export-' + dk() + '.json',
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  );
}

export function exportCSV(plan: Plan): void {
  const rows: (string | number)[][] = [
    ['Datum', 'Typ', 'Übung', 'Satz', 'Gewicht (kg)', 'Wiederholungen', 'Volumen (kg)'],
  ];
  LS.keys('sess_').forEach(k => {
    try {
      const s = LS.getJ<SessionData>(k) || ({} as SessionData);
      const date = s.dateKey
        ? s.dateKey.slice(6, 8) + '.' + s.dateKey.slice(4, 6) + '.' + s.dateKey.slice(0, 4)
        : '';
      const type = plan[s.type]?.lb || s.type || '';
      Object.entries(s.sets || {}).forEach(([ex, sets]) => {
        sets.forEach((st, i) => {
          const w = parseFloat(st.w) || 0;
          const r = parseInt(st.r) || 0;
          rows.push([date, type, ex, i + 1, w, r, w * r]);
        });
      });
    } catch {}
  });
  const csv = rows
    .map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','))
    .join('\n');
  download(
    'training-logs-' + dk() + '.csv',
    new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  );
}

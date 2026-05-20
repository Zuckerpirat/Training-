export function dk(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

export function sk(d: string, t: string): string {
  return 'sess_' + d + '_' + t;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function formatDateKey(k: string): string {
  if (!k || k.length < 8) return '–';
  return k.slice(6, 8) + '.' + k.slice(4, 6) + '.' + k.slice(0, 4);
}

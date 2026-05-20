export const LS = {
  get(k: string): string | null {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k: string, v: unknown): void {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
  getJ<T = any>(k: string): T | null {
    try {
      const r = localStorage.getItem(k);
      return r ? (JSON.parse(r) as T) : null;
    } catch { return null; }
  },
  keys(prefix: string): string[] {
    return Object.keys(localStorage).filter(k => k.startsWith(prefix)).sort();
  },
  all(): Record<string, unknown> {
    const o: Record<string, unknown> = {};
    try {
      Object.keys(localStorage).forEach(k => {
        try { o[k] = JSON.parse(localStorage.getItem(k) as string); }
        catch { o[k] = localStorage.getItem(k); }
      });
    } catch {}
    return o;
  },
  remove(k: string): void {
    try { localStorage.removeItem(k); } catch {}
  },
  clear(): void {
    try { localStorage.clear(); } catch {}
  },
};

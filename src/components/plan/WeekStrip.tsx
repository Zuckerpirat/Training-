import { useStore } from '../../store/useStore';
import { SCHED, ACCENT_VAR } from '../../constants/plan';
import type { SchedKey } from '../../types';

interface Props { accent: string }

export default function WeekStrip({ accent }: Props) {
  const sched = useStore(s => s.sched);
  const setSched = useStore(s => s.setSched);
  const selPlan = useStore(s => s.selPlan);

  const today = new Date();
  const dow = today.getDay();
  const mo = dow === 0 ? -6 : 1 - dow;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mo + i);
    return d;
  });

  const sc = SCHED[sched];
  const hl = sc.td[selPlan] || [];

  return (
    <div style={{ padding: '14px 18px 14px', borderBottom: '1px solid var(--border)' }}>
      <div className="flex justify-between items-center mb-2.5">
        <div className="font-bold" style={{ fontSize: 10, letterSpacing: 3, color: 'var(--text-muted)' }}>
          DIESE WOCHE
        </div>
        <div className="flex gap-1">
          {(Object.entries(SCHED) as [SchedKey, typeof sc][]).map(([k, s]) => {
            const active = sched === k;
            return (
              <button
                key={k}
                onClick={() => setSched(k)}
                className="rounded-full transition-all active:scale-95 cursor-pointer"
                title={s.hint}
                style={{
                  padding: '4px 10px', fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
                  border: `1px solid ${active ? accent : 'var(--border)'}`,
                  background: active ? `color-mix(in oklab, ${accent} 18%, transparent)` : 'transparent',
                  color: active ? accent : 'var(--text-muted)',
                }}
              >
                {s.short}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mb-2.5 truncate"
        style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 0.5 }}
      >
        {sc.hint.split(' · ').map((part, i) => {
          const type = (part.split(' ')[1] || '').toLowerCase();
          const a = ACCENT_VAR[type] || 'var(--text-muted)';
          return (
            <span key={i}>
              {i > 0 && <span style={{ opacity: 0.4 }}> · </span>}
              <span style={{ color: a, fontWeight: 600 }}>{part}</span>
            </span>
          );
        })}
      </div>

      <div className="flex gap-1.5">
        {week.map((date, i) => {
          const wi = i === 6 ? 0 : i + 1;
          const isH = hl.includes(wi);
          const isTrainDay = sc.days.includes(wi);
          const isT = date.toDateString() === today.toDateString();

          // Color for trained day (any type, not just current selection)
          let dayType: string | undefined;
          Object.entries(sc.td).forEach(([t, ds]) => { if (ds.includes(wi)) dayType = t; });
          const dayAccent = dayType ? ACCENT_VAR[dayType] : undefined;

          return (
            <div
              key={i}
              className="flex-1 text-center rounded-lg transition-all duration-200"
              style={{
                padding: '8px 2px',
                background: isH
                  ? `color-mix(in oklab, ${accent} 22%, transparent)`
                  : isT ? 'var(--surface2)' : 'transparent',
                border: `1px solid ${
                  isH ? `color-mix(in oklab, ${accent} 50%, transparent)` :
                  isT ? 'var(--border)' : 'transparent'
                }`,
              }}
            >
              <div className="font-semibold mb-1" style={{ fontSize: 9, color: isH ? accent : 'var(--text-muted)' }}>
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i]}
              </div>
              <div className="font-mono-num" style={{ fontSize: 13, fontWeight: isH || isT ? 700 : 500, color: isH ? accent : 'var(--text)' }}>
                {date.getDate()}
              </div>
              {isTrainDay && (
                <div
                  className="rounded-full mx-auto mt-1"
                  style={{
                    width: 5, height: 5,
                    background: isH ? accent : (dayAccent || 'var(--text-muted)'),
                    opacity: isH ? 1 : 0.55,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

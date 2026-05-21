import { ChevronDown, History } from 'lucide-react';
import { LS } from '../../utils/storage';
import { formatDateKey } from '../../utils/dates';
import type { SessionData } from '../../types';

interface Props {
  exName: string;
  accent: string;
}

interface HistorySet {
  date: string;
  setIndex: number;
  weight: string;
  reps: string;
}

function getLastSets(exName: string): HistorySet[] {
  return LS.keys('sess_')
    .map(key => LS.getJ<SessionData>(key))
    .filter((session): session is SessionData => !!session)
    .sort((a, b) => {
      const at = a.ts || Number(a.dateKey) || 0;
      const bt = b.ts || Number(b.dateKey) || 0;
      return bt - at;
    })
    .flatMap(session => {
      const sets = session.sets?.[exName] || [];
      return sets
        .map((set, index) => ({ set, index }))
        .filter(({ set }) => set.w && set.r)
        .map(({ set, index }) => ({
          date: formatDateKey(session.dateKey),
          setIndex: index + 1,
          weight: set.w,
          reps: set.r,
        }));
    })
    .slice(0, 5);
}

export default function SetHistoryDropdown({ exName, accent }: Props) {
  const sets = getLastSets(exName);

  return (
    <details
      className="rounded-xl mt-2"
      style={{
        background: `color-mix(in oklab, ${accent} 7%, transparent)`,
        border: `1px solid color-mix(in oklab, ${accent} 20%, var(--border))`,
      }}
    >
      <summary
        className="flex items-center justify-between gap-2 cursor-pointer"
        style={{ padding: '10px 12px', listStyle: 'none' }}
      >
        <span className="flex items-center gap-2 font-bold" style={{ fontSize: 11, color: accent, letterSpacing: 1 }}>
          <History size={13} /> LETZTE 5 SAETZE
        </span>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </summary>

      <div style={{ padding: '0 12px 10px' }}>
        {sets.length ? (
          sets.map((set, index) => (
            <div
              key={`${set.date}-${set.setIndex}-${index}`}
              className="flex justify-between items-center"
              style={{
                padding: '8px 0',
                borderTop: index === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: index < sets.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {set.date} · Satz {set.setIndex}
              </div>
              <div className="font-mono-num font-bold" style={{ fontSize: 13, color: 'var(--text)' }}>
                {set.weight} kg x {set.reps}
              </div>
            </div>
          ))
        ) : (
          <div style={{ paddingTop: 2, color: 'var(--text-muted)', fontSize: 12 }}>
            Noch keine gespeicherten Saetze fuer diese Uebung.
          </div>
        )}
      </div>
    </details>
  );
}

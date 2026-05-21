import { ChevronDown, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import InlineLogger from './InlineLogger';
import SetHistoryDropdown from './SetHistoryDropdown';
import type { Exercise } from '../../types';

interface Props {
  ex: Exercise;
  index: number;
  accent: string;
}

export default function ExerciseCard({ ex, index, accent }: Props) {
  const openEx = useStore(s => s.openEx);
  const editMode = useStore(s => s.editMode);
  const selPlan = useStore(s => s.selPlan);
  const inline = useStore(s => s.inline);
  const bests = useStore(s => s.bests);
  const toggleEx = useStore(s => s.toggleEx);
  const removeEx = useStore(s => s.removeEx);

  const isOpen = openEx === ex.id;
  const sets = inline[ex.n] || [];
  const done = sets.filter(s => s.w && s.r).length;
  const best = bests[ex.n];

  return (
    <div
      className="rounded-2xl overflow-hidden mb-2.5 transition-all duration-200"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isOpen ? `color-mix(in oklab, ${accent} 35%, var(--border))` : 'var(--border)'}`,
        boxShadow: isOpen ? `0 4px 20px color-mix(in oklab, ${accent} 18%, transparent)` : undefined,
      }}
    >
      <div
        onClick={() => !editMode && toggleEx(ex.id)}
        className="flex items-center gap-3 cursor-pointer transition-all"
        style={{
          padding: '13px 14px',
          background: isOpen ? `color-mix(in oklab, ${accent} 8%, transparent)` : 'transparent',
          borderBottom: isOpen ? '1px solid var(--border)' : 'none',
        }}
      >
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all"
          style={{
            width: 28, height: 28, fontSize: 12,
            background: done > 0 ? accent : `color-mix(in oklab, ${accent} 18%, transparent)`,
            color: done > 0 ? '#fff' : accent,
          }}
        >
          {done > 0 ? '✓' : index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate" style={{ fontSize: 13, color: 'var(--text)' }}>
            {ex.n}
          </div>
          <div className="mt-0.5 truncate" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {ex.g}{best ? ` · Best: ${best} kg` : ''}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-mono-num font-bold" style={{ fontSize: 16, color: accent }}>
            {ex.s}×{ex.r}
          </div>
          {editMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Übung entfernen?')) removeEx(selPlan, ex.id);
              }}
              className="rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90"
              style={{
                width: 26, height: 26,
                border: '1px solid rgba(255,68,68,0.3)',
                background: 'rgba(255,68,68,0.13)', color: '#ff4444',
              }}
              aria-label="Übung entfernen"
            >
              <X size={14} />
            </button>
          ) : (
            <ChevronDown
              size={16}
              style={{
                color: isOpen ? accent : 'var(--text-muted)',
                transition: 'transform 200ms ease',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          )}
        </div>
      </div>
      {!editMode && isOpen && (
        <>
          <div className="px-3.5 pt-3.5">
            <SetHistoryDropdown exName={ex.n} accent={accent} />
          </div>
          <InlineLogger exName={ex.n} sets={sets} accent={accent} />
        </>
      )}
    </div>
  );
}

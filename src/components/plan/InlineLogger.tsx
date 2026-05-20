import { X, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Input from '../ui/Input';
import type { SetEntry } from '../../types';

interface Props {
  exName: string;
  sets: SetEntry[];
  accent: string;
}

export default function InlineLogger({ exName, sets, accent }: Props) {
  const updateInlineSet = useStore(s => s.updateInlineSet);
  const removeInlineSet = useStore(s => s.removeInlineSet);
  const addInlineSet = useStore(s => s.addInlineSet);

  return (
    <div className="p-3.5 slide-up">
      <div className="flex gap-2 mb-2" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>
        <div style={{ width: 28 }}>#</div>
        <div className="flex-1">GEWICHT (KG)</div>
        <div className="flex-1">WIEDERH.</div>
        <div style={{ width: 28 }} />
      </div>
      {sets.map((s, i) => {
        const filled = !!(s.w && s.r);
        return (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0 font-bold transition-all"
              style={{
                width: 28, height: 28, fontSize: 11,
                background: filled ? accent : `color-mix(in oklab, ${accent} 18%, transparent)`,
                color: filled ? '#fff' : accent,
              }}
            >
              {filled ? '✓' : i + 1}
            </div>
            <Input
              type="number" inputMode="decimal" placeholder="–"
              value={s.w} accent={accent} filled={!!s.w}
              onChange={e => updateInlineSet(exName, i, 'w', e.target.value)}
              className="font-mono-num text-center"
              style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
            />
            <Input
              type="number" inputMode="numeric" placeholder="–"
              value={s.r} accent={accent} filled={!!s.r}
              onChange={e => updateInlineSet(exName, i, 'r', e.target.value)}
              className="font-mono-num text-center"
              style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
            />
            <button
              onClick={() => removeInlineSet(exName, i)}
              className="rounded-full flex items-center justify-center transition active:scale-90"
              style={{ width: 28, height: 28, border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
              aria-label="Satz entfernen"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <button
        onClick={() => addInlineSet(exName)}
        className="w-full rounded-lg transition-all active:scale-[0.98] mt-1 flex items-center justify-center gap-1.5"
        style={{
          padding: 8, border: '1px dashed var(--border)',
          background: 'transparent', color: 'var(--text-muted)', fontSize: 12,
        }}
      >
        <Plus size={14} /> Satz
      </button>
    </div>
  );
}

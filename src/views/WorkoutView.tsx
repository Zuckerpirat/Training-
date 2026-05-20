import { Check, Plus, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ACCENT_VAR } from '../constants/plan';
import Input from '../components/ui/Input';

export default function WorkoutView() {
  const wkOn = useStore(s => s.wkOn);
  const wkType = useStore(s => s.wkType);
  const wkSets = useStore(s => s.wkSets);
  const plan = useStore(s => s.plan);
  const saved = useStore(s => s.saved);
  const bests = useStore(s => s.bests);
  const startWorkout = useStore(s => s.startWorkout);
  const addWkSet = useStore(s => s.addWkSet);
  const removeWkSet = useStore(s => s.removeWkSet);
  const updateWkSet = useStore(s => s.updateWkSet);
  const finishWorkout = useStore(s => s.finishWorkout);

  if (!wkOn) {
    return (
      <div className="slide-up text-center" style={{ padding: '40px 18px' }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>💪</div>
        <div className="font-bold mb-1" style={{ fontSize: 19 }}>
          Kein aktives Training
        </div>
        <div className="mb-6" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Wähle einen Typ:
        </div>
        {Object.keys(plan).map(k => {
          const a = ACCENT_VAR[k] || 'var(--push)';
          return (
            <button
              key={k}
              onClick={() => startWorkout(k)}
              className="w-full rounded-2xl mb-2.5 font-bold transition-all active:scale-[0.98] cursor-pointer"
              style={{
                padding: 16, fontSize: 14, letterSpacing: 2,
                background: 'var(--surface)',
                border: `1px solid color-mix(in oklab, ${a} 35%, var(--border))`,
                color: a,
              }}
            >
              {plan[k].ic} {plan[k].lb} starten
            </button>
          );
        })}
      </div>
    );
  }

  const day = plan[wkType];
  const accent = ACCENT_VAR[wkType] || 'var(--push)';

  return (
    <div className="slide-up">
      <div
        className="glass flex justify-between items-center sticky z-10"
        style={{
          top: 56, padding: '14px 18px',
          borderBottom: '1px solid var(--border)',
          background: `color-mix(in oklab, ${accent} 12%, var(--surface))`,
        }}
      >
        <div>
          <div className="font-bold" style={{ fontSize: 19, color: accent, letterSpacing: -0.3 }}>
            {day.ic} {day.lb} DAY
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>
        <button
          onClick={finishWorkout}
          className="rounded-xl flex items-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer"
          style={{
            padding: '10px 18px', fontSize: 12,
            background: saved ? '#00AA55' : accent, color: '#fff', border: 'none',
            boxShadow: `0 4px 16px color-mix(in oklab, ${saved ? '#00AA55' : accent} 40%, transparent)`,
          }}
        >
          <Check size={14} /> {saved ? 'Gespeichert' : 'Fertig'}
        </button>
      </div>

      <div style={{ padding: '14px 18px' }}>
        {day.ex.map(ex => {
          const sets = wkSets[ex.n] || [];
          const best = bests[ex.n];
          return (
            <div
              key={ex.id}
              className="rounded-2xl overflow-hidden mb-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div
                className="flex justify-between items-center"
                style={{
                  padding: '11px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: `color-mix(in oklab, ${accent} 6%, transparent)`,
                }}
              >
                <div>
                  <div className="font-bold" style={{ fontSize: 13 }}>{ex.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {ex.s}×{ex.r} · {ex.g}
                  </div>
                </div>
                {best ? (
                  <div className="text-right">
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>BEST</div>
                    <div className="font-mono-num font-bold" style={{ fontSize: 13, color: accent }}>
                      {best} kg
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="px-3.5 py-2.5">
                <div className="flex gap-2 mb-2" style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>
                  <div style={{ width: 28 }}>#</div>
                  <div className="flex-1">KG</div>
                  <div className="flex-1">WDHL.</div>
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
                        onChange={e => updateWkSet(ex.n, i, 'w', e.target.value)}
                        className="font-mono-num text-center" style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
                      />
                      <Input
                        type="number" inputMode="numeric" placeholder="–"
                        value={s.r} accent={accent} filled={!!s.r}
                        onChange={e => updateWkSet(ex.n, i, 'r', e.target.value)}
                        className="font-mono-num text-center" style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
                      />
                      <button
                        onClick={() => removeWkSet(ex.n, i)}
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
                  onClick={() => addWkSet(ex.n)}
                  className="w-full rounded-lg mt-1 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                  style={{
                    padding: 8, border: '1px dashed var(--border)',
                    background: 'transparent', color: 'var(--text-muted)', fontSize: 12,
                  }}
                >
                  <Plus size={14} /> Satz
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

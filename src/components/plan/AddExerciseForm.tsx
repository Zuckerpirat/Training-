import { useState } from 'react';
import { useStore } from '../../store/useStore';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface Props { accent: string }

export default function AddExerciseForm({ accent }: Props) {
  const confirmAddEx = useStore(s => s.confirmAddEx);
  const cancelAddEx = useStore(s => s.cancelAddEx);
  const [n, setN] = useState('');
  const [g, setG] = useState('');
  const [s, setS] = useState(3);
  const [r, setR] = useState('10–12');

  return (
    <div
      className="rounded-2xl mb-2.5 slide-up"
      style={{
        background: 'var(--surface)',
        border: `1px solid color-mix(in oklab, ${accent} 35%, var(--border))`,
        padding: 14,
        boxShadow: `0 4px 18px color-mix(in oklab, ${accent} 18%, transparent)`,
      }}
    >
      <div className="font-bold mb-3" style={{ fontSize: 12, color: accent, letterSpacing: 1 }}>
        + Neue Übung
      </div>
      <Input placeholder="Name der Übung" value={n} onChange={e => setN(e.target.value)} accent={accent} autoFocus className="mb-2" />
      <div className="flex gap-2 mb-2">
        <Input placeholder="Muskelgruppe" value={g} onChange={e => setG(e.target.value)} accent={accent} style={{ flex: 1 }} />
        <Input type="number" placeholder="Sätze" value={s} onChange={e => setS(parseInt(e.target.value) || 3)} accent={accent} className="text-center" style={{ width: 70 }} />
        <Input placeholder="Wdh." value={r} onChange={e => setR(e.target.value)} accent={accent} className="text-center" style={{ width: 84 }} />
      </div>
      <div className="flex gap-2">
        <Button accent={accent} onClick={() => confirmAddEx({ n: n.trim(), g: g.trim(), s, r: r.trim() })} className="flex-1">
          Hinzufügen
        </Button>
        <Button variant="ghost" onClick={cancelAddEx}>Abbrechen</Button>
      </div>
    </div>
  );
}

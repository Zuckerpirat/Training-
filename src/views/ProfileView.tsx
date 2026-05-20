import { useState, useEffect } from 'react';
import { Pencil, Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GOAL_LABEL, GOAL_VAR } from '../constants/plan';
import { exportJSON, exportCSV } from '../utils/export';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { Goal } from '../types';

export default function ProfileView() {
  const profile = useStore(s => s.profile);
  const editProfile = useStore(s => s.editProfile);
  const startEditProfile = useStore(s => s.startEditProfile);
  const cancelEditProfile = useStore(s => s.cancelEditProfile);
  const saveProfile = useStore(s => s.saveProfile);
  const setGoal = useStore(s => s.setGoal);
  const resetAllData = useStore(s => s.resetAllData);
  const plan = useStore(s => s.plan);

  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (editProfile) setDraft(profile);
  }, [editProfile, profile]);

  const accent = 'var(--profile)';
  const bmi = profile.weight && profile.height
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : null;

  if (editProfile) {
    return (
      <div className="slide-up" style={{ padding: 18 }}>
        <div className="font-bold mb-4" style={{ fontSize: 12, color: accent, letterSpacing: 2 }}>
          PROFIL BEARBEITEN
        </div>

        {[
          { type: 'text',   label: 'Name',          field: 'name'   as const },
          { type: 'number', label: 'Alter (Jahre)', field: 'age'    as const },
          { type: 'number', label: 'Gewicht (kg)',  field: 'weight' as const },
          { type: 'number', label: 'Größe (cm)',    field: 'height' as const },
        ].map(({ type, label, field }) => (
          <div key={field} className="mb-3">
            <div className="mb-1.5" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>
              {label.toUpperCase()}
            </div>
            <Input
              type={type as any}
              accent={accent}
              value={(draft as any)[field] ?? ''}
              onChange={e => {
                const v = type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
                setDraft({ ...draft, [field]: v } as any);
              }}
              style={{ fontSize: 15 }}
            />
          </div>
        ))}

        <div className="mb-2.5 mt-5" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, fontWeight: 700 }}>
          KALORIENZIELE
        </div>
        {(['cut', 'maintain', 'bulk'] as const).map(gk => (
          <div key={gk} className="mb-2.5 flex items-center gap-3">
            <div className="rounded-full flex-shrink-0" style={{ width: 10, height: 10, background: GOAL_VAR[gk] }} />
            <div style={{ fontSize: 13, width: 110, color: 'var(--text)' }}>
              {gk === 'cut' ? 'Diät (Cut)' : gk === 'maintain' ? 'Erhalt' : 'Aufbau (Bulk)'}
            </div>
            <Input
              type="number"
              accent={GOAL_VAR[gk]}
              value={draft.kcal[gk]}
              onChange={e => setDraft({ ...draft, kcal: { ...draft.kcal, [gk]: parseInt(e.target.value) || 0 } })}
              className="text-center font-mono-num"
              style={{ flex: 1, fontSize: 14, textAlign: 'center' }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>kcal</span>
          </div>
        ))}

        <div className="flex gap-2.5 mt-5">
          <Button accent={accent} onClick={() => saveProfile(draft)} className="flex-1" size="lg">
            Speichern
          </Button>
          <Button variant="ghost" onClick={cancelEditProfile} size="lg">Abbrechen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-up" style={{ padding: 18 }}>
      <div
        className="rounded-2xl text-center mb-4"
        style={{
          padding: 22,
          background: `color-mix(in oklab, ${accent} 12%, var(--surface))`,
          border: `1px solid color-mix(in oklab, ${accent} 35%, var(--border))`,
          boxShadow: `0 6px 24px color-mix(in oklab, ${accent} 18%, transparent)`,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 6 }}>🏋️</div>
        <div className="font-bold" style={{ fontSize: 22, letterSpacing: -0.3 }}>
          {profile.name || 'Mein Profil'}
        </div>
        <div className="mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {profile.age ? `${profile.age} Jahre · ` : ''}
          {profile.height ? `${profile.height} cm · ` : ''}
          {profile.weight ? `${profile.weight} kg` : ''}
        </div>
        {bmi && (
          <div className="mt-0.5" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            BMI: <span className="font-mono-num">{bmi}</span>
          </div>
        )}
        <button
          onClick={startEditProfile}
          className="rounded-full mt-3 font-bold transition-all active:scale-95 inline-flex items-center gap-1.5 cursor-pointer"
          style={{
            padding: '8px 20px', fontSize: 12,
            border: `1px solid ${accent}`, background: 'transparent', color: accent,
          }}
        >
          <Pencil size={12} /> Bearbeiten
        </button>
      </div>

      <div className="mb-2.5" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, fontWeight: 700 }}>
        AKTUELLES ZIEL
      </div>
      <div className="flex gap-2 mb-4">
        {(Object.entries(GOAL_LABEL) as [Goal, string][]).map(([k, l]) => {
          const active = profile.goal === k;
          const a = GOAL_VAR[k];
          const [main, emoji] = l.split(' ').reduce<[string, string]>(
            (acc, part) => /\p{Emoji}/u.test(part) ? [acc[0], part] : [acc[0] ? acc[0] + ' ' + part : part, acc[1]],
            ['', '']
          );
          return (
            <button
              key={k}
              onClick={() => setGoal(k)}
              className="flex-1 rounded-xl transition-all active:scale-[0.97] cursor-pointer"
              style={{
                padding: '12px 6px',
                border: active ? `2px solid ${a}` : '1px solid var(--border)',
                background: active ? `color-mix(in oklab, ${a} 18%, transparent)` : 'transparent',
                color: active ? a : 'var(--text-muted)',
                fontSize: 11, fontWeight: 700, lineHeight: 1.35,
                boxShadow: active ? `0 4px 18px color-mix(in oklab, ${a} 22%, transparent)` : 'none',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 2 }}>{emoji}</div>
              {main}
            </button>
          );
        })}
      </div>

      <div className="mb-2.5" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, fontWeight: 700 }}>
        KALORIENZIELE
      </div>
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {([['cut', 'Diät'], ['maintain', 'Erhalt'], ['bulk', 'Aufbau']] as const).map(([k, l], i, arr) => {
          const active = profile.goal === k;
          return (
            <div
              key={k}
              className="flex justify-between items-center"
              style={{
                padding: '13px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                background: active ? `color-mix(in oklab, ${GOAL_VAR[k]} 8%, transparent)` : 'transparent',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="rounded-full" style={{ width: 8, height: 8, background: GOAL_VAR[k] }} />
                <div style={{ fontSize: 13, fontWeight: active ? 700 : 400 }}>
                  {l}{active ? ' (aktiv)' : ''}
                </div>
              </div>
              <div className="font-mono-num font-bold" style={{ fontSize: 15, color: GOAL_VAR[k] }}>
                {profile.kcal[k] || '–'} kcal
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-2.5" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, fontWeight: 700 }}>
        DATEN
      </div>
      <div className="flex flex-col gap-2.5">
        <button
          onClick={exportJSON}
          className="w-full rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          style={{
            padding: 14, background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 13, fontWeight: 700,
          }}
        >
          <Download size={16} /> Alle Daten exportieren (JSON)
        </button>
        <button
          onClick={() => exportCSV(plan)}
          className="w-full rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          style={{
            padding: 14, background: 'var(--surface)', border: '1px solid var(--border)',
            color: 'var(--text)', fontSize: 13, fontWeight: 700,
          }}
        >
          <FileSpreadsheet size={16} /> Trainingslogs exportieren (CSV)
        </button>
        <button
          onClick={() => {
            if (confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden.')) {
              if (confirm('Bist du sicher?')) resetAllData();
            }
          }}
          className="w-full rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          style={{
            padding: 14,
            background: 'rgba(255,68,68,0.05)',
            border: '1px solid rgba(255,68,68,0.25)',
            color: '#ff6666', fontSize: 13, fontWeight: 700,
          }}
        >
          <Trash2 size={16} /> Alle Daten löschen
        </button>
      </div>
    </div>
  );
}

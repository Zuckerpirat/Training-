import { Play, Scale } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SCHED, ACCENT_VAR, GOAL_SHORT, GOAL_VAR } from '../constants/plan';
import { LS } from '../utils/storage';
import { formatDateKey } from '../utils/dates';
import StatCard from '../components/ui/StatCard';
import type { SessionData } from '../types';

export default function HomeView() {
  const profile = useStore(s => s.profile);
  const sched = useStore(s => s.sched);
  const plan = useStore(s => s.plan);
  const startWorkout = useStore(s => s.startWorkout);

  const today = new Date();
  const dow = today.getDay();
  const sc = SCHED[sched];
  const isTrain = sc.days.includes(dow);
  let todayType: string | null = null;
  Object.entries(sc.td).forEach(([type, days]) => {
    if (days.includes(dow)) todayType = type;
  });
  const accent = todayType ? ACCENT_VAR[todayType] : 'var(--text-muted)';

  const sessKeys = LS.keys('sess_').reverse().slice(0, 5);
  const recentSess = sessKeys.map(k => {
    const d = LS.getJ<SessionData>(k) || ({} as SessionData);
    const date = formatDateKey(d.dateKey || '');
    const type = d.type || '?';
    const exCount = Object.keys(d.sets || {}).length;
    const setCount = Object.values(d.sets || {}).reduce(
      (a, v) => a + v.filter(s => s.w && s.r).length,
      0
    );
    return { date, type, exCount, setCount };
  });

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  weekStart.setHours(0, 0, 0, 0);
  const weekKeys = LS.keys('sess_').filter(k => {
    const kd = k.slice(5, 13);
    const d = new Date(kd.slice(0, 4) + '-' + kd.slice(4, 6) + '-' + kd.slice(6, 8));
    return d >= weekStart;
  });

  const currentKcal = profile.kcal?.[profile.goal] || 0;
  const bmi = profile.weight && profile.height
    ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="slide-up" style={{ padding: 18 }}>
      <div className="mb-5">
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
          {profile.name ? `Hey, ${profile.name}! 👋` : 'Hey! 👋'}
        </div>
        <div className="mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {today.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
        </div>
      </div>

      <div
        className="rounded-2xl mb-3.5 transition-all duration-200"
        style={{
          padding: 18,
          background: isTrain
            ? `color-mix(in oklab, ${accent} 10%, var(--surface))`
            : 'var(--surface)',
          border: `1px solid ${isTrain ? `color-mix(in oklab, ${accent} 35%, var(--border))` : 'var(--border)'}`,
          boxShadow: isTrain ? `0 6px 24px color-mix(in oklab, ${accent} 18%, transparent)` : undefined,
        }}
      >
        <div className="font-bold mb-2" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 3 }}>
          HEUTE
        </div>
        {isTrain && todayType ? (
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold" style={{ fontSize: 21, color: accent, letterSpacing: -0.3 }}>
                {plan[todayType].ic} {plan[todayType].lb} DAY
              </div>
              <div className="mt-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {plan[todayType].ex.length} Übungen · {plan[todayType].sub}
              </div>
            </div>
            <button
              onClick={() => startWorkout(todayType!)}
              className="rounded-xl flex items-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer"
              style={{
                padding: '12px 18px', fontSize: 13,
                background: accent, color: '#fff', border: 'none',
                boxShadow: `0 4px 16px color-mix(in oklab, ${accent} 40%, transparent)`,
              }}
            >
              <Play size={13} fill="#fff" /> Los
            </button>
          </div>
        ) : (
          <div className="font-semibold" style={{ fontSize: 16, color: 'var(--text-muted)' }}>
            🛋️ Ruhetag
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-3.5">
        <StatCard label="Diese Woche" value={`${weekKeys.length} Sessions`} accent="var(--pull)" />
        <StatCard label="Ziel" value={GOAL_SHORT[profile.goal]} accent={GOAL_VAR[profile.goal]} />
        <StatCard label="Kalorien" value={currentKcal ? `${currentKcal} kcal` : '–'} accent="var(--progress)" />
      </div>

      {profile.weight ? (
        <div
          className="rounded-2xl mb-3.5 flex gap-3 items-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 15 }}
        >
          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              width: 48, height: 48,
              background: 'color-mix(in oklab, var(--pull) 15%, transparent)',
              color: 'var(--pull)',
            }}
          >
            <Scale size={24} />
          </div>
          <div>
            <div className="font-mono-num font-bold" style={{ fontSize: 19 }}>
              {profile.weight} kg
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {profile.height} cm · BMI {bmi || '–'}
            </div>
          </div>
        </div>
      ) : null}

      {recentSess.length ? (
        <>
          <div className="font-bold mb-2.5" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2.5 }}>
            LETZTE EINHEITEN
          </div>
          {recentSess.map((s, i) => {
            const a = ACCENT_VAR[s.type] || 'var(--text-muted)';
            return (
              <div
                key={i}
                className="rounded-xl mb-2 flex justify-between items-center transition-all"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  padding: '12px 14px',
                }}
              >
                <div>
                  <div className="font-semibold" style={{ fontSize: 13, color: a }}>
                    {plan[s.type] ? `${plan[s.type].ic} ${plan[s.type].lb}` : '?'}
                  </div>
                  <div className="mt-0.5" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {s.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono-num font-bold" style={{ fontSize: 13 }}>
                    {s.setCount} Sätze
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {s.exCount} Übungen
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="text-center" style={{ padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
          Noch keine Trainings gespeichert.
          <br />
          <span style={{ fontSize: 11 }}>Starte dein erstes Workout!</span>
        </div>
      )}
    </div>
  );
}

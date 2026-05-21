import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, Play, Plus, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ACCENT_VAR, SCHED } from '../constants/plan';
import { dk } from '../utils/dates';
import { LS } from '../utils/storage';
import Input from '../components/ui/Input';
import SetHistoryDropdown from '../components/plan/SetHistoryDropdown';
import type { SchedKey } from '../types';

function getWorkoutTypeForDate(date: Date, sched: SchedKey): string | null {
  const weekday = date.getDay();
  const schedule = SCHED[sched];
  for (const [type, days] of Object.entries(schedule.td)) {
    if (days.includes(weekday)) return type;
  }
  return null;
}

function makeCalendarDays(sched: SchedKey) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 21 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const type = getWorkoutTypeForDate(date, sched);
    const key = dk(date);
    return {
      date,
      key,
      type,
      isToday: index === 0,
      saved: type ? !!LS.get(`sess_${key}_${type}`) : false,
    };
  });
}

export default function WorkoutView() {
  const wkOn = useStore(s => s.wkOn);
  const wkType = useStore(s => s.wkType);
  const wkSets = useStore(s => s.wkSets);
  const wkDate = useStore(s => s.wkDate);
  const plan = useStore(s => s.plan);
  const saved = useStore(s => s.saved);
  const bests = useStore(s => s.bests);
  const sched = useStore(s => s.sched);
  const setSched = useStore(s => s.setSched);
  const startWorkout = useStore(s => s.startWorkout);
  const addWkSet = useStore(s => s.addWkSet);
  const removeWkSet = useStore(s => s.removeWkSet);
  const updateWkSet = useStore(s => s.updateWkSet);
  const finishWorkout = useStore(s => s.finishWorkout);

  const [showActiveWorkout, setShowActiveWorkout] = useState(wkOn);

  useEffect(() => {
    if (wkOn) setShowActiveWorkout(true);
  }, [wkOn]);

  const calendarDays = useMemo(() => makeCalendarDays(sched), [sched]);

  if (!wkOn || !showActiveWorkout) {
    return (
      <div className="slide-up" style={{ padding: 18 }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-bold tracking-tight flex items-center gap-2" style={{ fontSize: 22, color: 'var(--push)' }}>
              <CalendarDays size={22} /> Training
            </div>
            <div className="mt-1" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Kalender fuer die naechsten 3 Wochen.
            </div>
          </div>
          {wkOn && (
            <button
              onClick={() => setShowActiveWorkout(true)}
              className="rounded-xl flex items-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer"
              style={{
                padding: '10px 12px',
                fontSize: 12,
                background: ACCENT_VAR[wkType] || 'var(--push)',
                color: '#fff',
                border: 'none',
              }}
            >
              <Play size={13} fill="#fff" /> Fortsetzen
            </button>
          )}
        </div>

        <div className="flex gap-1.5 mb-4">
          {(Object.entries(SCHED) as [SchedKey, typeof SCHED[SchedKey]][]).map(([key, schedule]) => {
            const active = sched === key;
            return (
              <button
                key={key}
                onClick={() => setSched(key)}
                className="flex-1 rounded-full transition-all active:scale-95 cursor-pointer"
                title={schedule.hint}
                style={{
                  padding: '8px 8px',
                  fontSize: 10,
                  fontWeight: 800,
                  border: `1px solid ${active ? 'var(--push)' : 'var(--border)'}`,
                  background: active ? 'color-mix(in oklab, var(--push) 14%, transparent)' : 'transparent',
                  color: active ? 'var(--push)' : 'var(--text-muted)',
                }}
              >
                {schedule.short}
              </button>
            );
          })}
        </div>

        <div className="mb-2.5" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 2, fontWeight: 700 }}>
          TRAININGSKALENDER
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {calendarDays.map(day => {
            const type = day.type;
            const workout = type ? plan[type] : null;
            const accent = type ? ACCENT_VAR[type] || 'var(--push)' : 'var(--text-muted)';
            const isActiveWorkoutDay = wkOn && type === wkType && day.key === wkDate;

            return (
              <button
                key={day.key}
                onClick={() => {
                  if (isActiveWorkoutDay) {
                    setShowActiveWorkout(true);
                  } else if (type) {
                    startWorkout(type);
                  }
                }}
                disabled={!type}
                className="w-full rounded-2xl text-left transition-all active:scale-[0.98] disabled:cursor-default cursor-pointer"
                style={{
                  padding: '13px 14px',
                  background: day.isToday
                    ? 'var(--surface2)'
                    : type ? 'var(--surface)' : 'transparent',
                  border: `1px solid ${
                    isActiveWorkoutDay
                      ? accent
                      : type
                        ? `color-mix(in oklab, ${accent} 28%, var(--border))`
                        : 'var(--border)'
                  }`,
                  opacity: type ? 1 : 0.62,
                }}
              >
                <div className="flex justify-between items-center gap-3">
                  <div className="min-w-0">
                    <div className="font-bold" style={{ fontSize: 13, color: day.isToday ? 'var(--text)' : 'var(--text-muted)' }}>
                      {day.date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                      {day.isToday ? ' · Heute' : ''}
                    </div>
                    <div className="mt-1 truncate" style={{ fontSize: 14, color: type ? accent : 'var(--text-muted)', fontWeight: 800 }}>
                      {workout ? `${workout.ic} ${workout.lb} Day` : 'Ruhetag'}
                    </div>
                    {workout && (
                      <div className="mt-0.5 truncate" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {workout.ex.length} Uebungen · {workout.sub}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isActiveWorkoutDay ? (
                      <div className="font-bold" style={{ fontSize: 11, color: accent }}>OFFEN</div>
                    ) : day.saved ? (
                      <div className="font-bold" style={{ fontSize: 11, color: 'var(--legs)' }}>ERLEDIGT</div>
                    ) : type ? (
                      <div className="font-bold" style={{ fontSize: 11, color: accent }}>START</div>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
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
          top: 56, padding: '12px 18px',
          borderBottom: '1px solid var(--border)',
          background: `color-mix(in oklab, ${accent} 12%, var(--surface))`,
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setShowActiveWorkout(false)}
            className="rounded-lg flex items-center justify-center flex-shrink-0 transition active:scale-95 cursor-pointer"
            style={{ width: 34, height: 34, border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent' }}
            aria-label="Zurueck zur Trainingsuebersicht"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="font-bold truncate" style={{ fontSize: 18, color: accent, letterSpacing: -0.3 }}>
              {day.ic} {day.lb} DAY
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {wkDate ? `${wkDate.slice(6, 8)}.${wkDate.slice(4, 6)}.${wkDate.slice(0, 4)}` : new Date().toLocaleDateString('de-DE')}
            </div>
          </div>
        </div>
        <button
          onClick={finishWorkout}
          className="rounded-xl flex items-center gap-1.5 font-bold transition-all active:scale-95 cursor-pointer"
          style={{
            padding: '10px 14px', fontSize: 12,
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
                <div className="min-w-0">
                  <div className="font-bold truncate" style={{ fontSize: 13 }}>{ex.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {ex.s}x{ex.r} · {ex.g}
                  </div>
                </div>
                {best ? (
                  <div className="text-right flex-shrink-0">
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: 1 }}>BEST</div>
                    <div className="font-mono-num font-bold" style={{ fontSize: 13, color: accent }}>
                      {best} kg
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="px-3.5">
                <SetHistoryDropdown exName={ex.n} accent={accent} />
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
                        {filled ? <Check size={14} /> : i + 1}
                      </div>
                      <Input
                        type="number" inputMode="decimal" placeholder="-"
                        value={s.w} accent={accent} filled={!!s.w}
                        onChange={e => updateWkSet(ex.n, i, 'w', e.target.value)}
                        className="font-mono-num text-center" style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
                      />
                      <Input
                        type="number" inputMode="numeric" placeholder="-"
                        value={s.r} accent={accent} filled={!!s.r}
                        onChange={e => updateWkSet(ex.n, i, 'r', e.target.value)}
                        className="font-mono-num text-center" style={{ flex: 1, fontSize: 16, textAlign: 'center' }}
                      />
                      <button
                        onClick={() => removeWkSet(ex.n, i)}
                        className="rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer"
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
                  className="w-full rounded-lg mt-1 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
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

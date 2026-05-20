import { useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LS } from '../utils/storage';
import StatCard from '../components/ui/StatCard';
import type { SessionData } from '../types';

export default function ProgressView() {
  const plan = useStore(s => s.plan);
  const progEx = useStore(s => s.progEx);
  const setProgEx = useStore(s => s.setProgEx);
  const bests = useStore(s => s.bests);
  const accent = 'var(--progress)';

  const allEx = useMemo(
    () => Object.values(plan).flatMap(d => d.ex.map(e => e.n)),
    [plan]
  );

  const data = useMemo(() => {
    const arr: { date: string; label: string; weight: number; vol: number }[] = [];
    LS.keys('sess_').forEach(k => {
      try {
        const s = LS.getJ<SessionData>(k) || ({} as SessionData);
        const sets = s.sets?.[progEx];
        if (!sets) return;
        const mx = Math.max(...sets.map(x => parseFloat(x.w) || 0));
        if (mx > 0) {
          arr.push({
            date: s.dateKey,
            label: s.dateKey.slice(6, 8) + '.' + s.dateKey.slice(4, 6),
            weight: mx,
            vol: sets.reduce((a, v) => (parseFloat(v.w) || 0) * (parseInt(v.r) || 0) + a, 0),
          });
        }
      } catch {}
    });
    arr.sort((a, b) => a.date.localeCompare(b.date));
    return arr;
  }, [progEx]);

  const total = data.length;
  const first = total > 0 ? data[0].weight : null;
  const last = total > 0 ? data[total - 1].weight : null;
  const diff = total > 1 && first !== null && last !== null ? (last - first).toFixed(1) : null;

  const prs = useMemo(
    () =>
      allEx
        .map(n => (bests[n] ? { n, b: bests[n] } : null))
        .filter(Boolean)
        .sort((a, b) => b!.b - a!.b) as { n: string; b: number }[],
    [allEx, bests]
  );

  return (
    <div className="slide-up" style={{ padding: 18 }}>
      <div className="mb-2" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 3, fontWeight: 700 }}>
        ÜBUNG
      </div>
      <select
        value={progEx}
        onChange={e => setProgEx(e.target.value)}
        className="w-full rounded-xl mb-4 outline-none cursor-pointer transition-all"
        style={{
          padding: '12px 14px',
          background: 'var(--surface)', color: 'var(--text)',
          border: '1px solid var(--border)', fontSize: 13,
        }}
      >
        {allEx.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <div className="grid grid-cols-4 gap-2 mb-3.5">
        <StatCard label="Sessions" value={total || '–'} accent={accent} />
        <StatCard label="Start" value={first ? `${first} kg` : '–'} accent={accent} />
        <StatCard label="Jetzt" value={last ? `${last} kg` : '–'} accent={accent} />
        <StatCard label="Zuwachs" value={diff !== null ? `${+diff >= 0 ? '+' : ''}${diff} kg` : '–'} accent={accent} />
      </div>

      <div
        className="rounded-2xl mb-3.5"
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: '14px 8px 6px',
        }}
      >
        {total >= 2 ? (
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 14, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--progress)" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="var(--progress)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} width={40} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 10, fontSize: 12,
                  }}
                  labelStyle={{ color: 'var(--text-muted)' }}
                  itemStyle={{ color: 'var(--progress)' }}
                  formatter={(v: number) => [`${v} kg`, 'Max']}
                />
                <Area
                  type="monotone" dataKey="weight"
                  stroke="var(--progress)" strokeWidth={2.5}
                  fill="url(#ag)" dot={{ fill: 'var(--progress)', r: 3.5 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center" style={{ padding: 36, color: 'var(--text-muted)', fontSize: 13 }}>
            Noch keine Daten für diese Übung.
          </div>
        )}
      </div>

      {total > 1 && (
        <div
          className="rounded-xl mb-3.5 flex gap-2 items-center"
          style={{
            padding: '12px 14px',
            background: 'color-mix(in oklab, var(--progress) 10%, transparent)',
            border: '1px solid color-mix(in oklab, var(--progress) 25%, var(--border))',
            fontSize: 12, lineHeight: 1.5,
          }}
        >
          <TrendingUp size={16} style={{ color: 'var(--progress)', flexShrink: 0 }} />
          <div>
            Von <strong style={{ color: 'var(--progress)' }}>{first} kg</strong> auf{' '}
            <strong style={{ color: 'var(--progress)' }}>{last} kg</strong> —{' '}
            <strong style={{ color: 'var(--progress)' }}>
              {diff && +diff >= 0 ? '+' : ''}{diff} kg
            </strong>{' '}
            in {total} Sessions.
          </div>
        </div>
      )}

      {prs.length > 0 && (
        <>
          <div className="mb-2.5" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2.5, fontWeight: 700 }}>
            PERSÖNLICHE BESTLEISTUNGEN
          </div>
          {prs.slice(0, 8).map((p, i) => (
            <div
              key={p.n}
              className="rounded-xl mb-2 flex justify-between items-center"
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                padding: '11px 14px',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="font-bold"
                  style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}
                >
                  {i + 1}.
                </div>
                <div className="font-semibold" style={{ fontSize: 13 }}>{p.n}</div>
              </div>
              <div className="font-mono-num font-bold" style={{ fontSize: 15, color: 'var(--progress)' }}>
                {p.b} kg
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

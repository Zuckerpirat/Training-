import { useStore } from '../../store/useStore';
import { ACCENT_VAR } from '../../constants/plan';

export default function DayTabs() {
  const plan = useStore(s => s.plan);
  const selPlan = useStore(s => s.selPlan);
  const setSelPlan = useStore(s => s.setSelPlan);

  return (
    <div className="flex gap-2" style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
      {Object.keys(plan).map(k => {
        const active = selPlan === k;
        const a = ACCENT_VAR[k] || 'var(--push)';
        return (
          <button
            key={k}
            onClick={() => setSelPlan(k)}
            className="flex-1 rounded-xl transition-all active:scale-[0.97] cursor-pointer"
            style={{
              padding: '11px 4px',
              border: `2px solid ${active ? a : 'var(--border)'}`,
              background: active ? `color-mix(in oklab, ${a} 15%, transparent)` : 'transparent',
              color: active ? a : 'var(--text-muted)',
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
              boxShadow: active ? `0 4px 16px color-mix(in oklab, ${a} 18%, transparent)` : 'none',
            }}
          >
            <div className="mb-0.5" style={{ fontSize: 16 }}>{plan[k].ic}</div>
            {plan[k].lb}
          </button>
        );
      })}
    </div>
  );
}

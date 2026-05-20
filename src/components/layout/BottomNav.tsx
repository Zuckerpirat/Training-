import { Home, ClipboardList, Dumbbell, TrendingUp, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ACCENT_VAR } from '../../constants/plan';

const TABS = [
  { key: 'home',     label: 'Home',     Icon: Home,          accent: 'var(--home)' },
  { key: 'plan',     label: 'Plan',     Icon: ClipboardList, accent: 'var(--pull)' },
  { key: 'workout',  label: 'Training', Icon: Dumbbell,      accent: 'var(--push)' },
  { key: 'progress', label: 'Ziele',    Icon: TrendingUp,    accent: 'var(--progress)' },
  { key: 'profile',  label: 'Profil',   Icon: User,          accent: 'var(--profile)' },
] as const;

export default function BottomNav() {
  const view = useStore(s => s.view);
  const setView = useStore(s => s.setView);
  return (
    <div
      className="glass fixed bottom-0 left-1/2 -translate-x-1/2 w-full flex"
      style={{
        maxWidth: 480,
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      }}
    >
      {TABS.map(({ key, label, Icon, accent }) => {
        const active = view === key;
        const _ = ACCENT_VAR;
        return (
          <button
            key={key}
            onClick={() => setView(key as any)}
            className="flex-1 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              padding: '10px 2px 6px',
              background: 'transparent',
              border: 'none',
              color: active ? accent : 'var(--text-muted)',
              borderTop: `2px solid ${active ? accent : 'transparent'}`,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
            <div
              className="mt-1"
              style={{ fontSize: 9, letterSpacing: '1px', fontWeight: active ? 700 : 500 }}
            >
              {label.toUpperCase()}
            </div>
          </button>
        );
      })}
    </div>
  );
}

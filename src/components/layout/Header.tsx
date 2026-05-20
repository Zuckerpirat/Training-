import { useStore } from '../../store/useStore';
import ThemePicker from '../ui/ThemePicker';

const TITLES: Record<string, string> = {
  home: '🏠 Home',
  plan: '📋 Trainingsplan',
  workout: '💪 Training',
  progress: '📈 Fortschritt',
  profile: '👤 Profil',
};

export default function Header() {
  const view = useStore(s => s.view);
  return (
    <div
      className="glass sticky top-0 z-20 flex items-center justify-between"
      style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="font-bold tracking-tight" style={{ fontSize: 16 }}>
        {TITLES[view]}
      </div>
      <ThemePicker />
    </div>
  );
}

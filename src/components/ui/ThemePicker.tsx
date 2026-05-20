import { useStore } from '../../store/useStore';
import { THEMES } from '../../constants/themes';

export default function ThemePicker() {
  const theme = useStore(s => s.theme);
  const setTheme = useStore(s => s.setTheme);
  return (
    <div className="flex gap-1.5">
      {THEMES.map(t => {
        const active = theme === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTheme(t.key)}
            className="rounded-full transition-all duration-200 active:scale-90"
            style={{
              width: 30, height: 30,
              border: active ? '2.5px solid var(--push)' : '2px solid var(--border)',
              background: t.bg,
              fontSize: 12,
              boxShadow: active ? '0 0 0 3px color-mix(in oklab, var(--push) 20%, transparent)' : undefined,
            }}
            aria-label={t.label}
          >
            {t.emoji}
          </button>
        );
      })}
    </div>
  );
}

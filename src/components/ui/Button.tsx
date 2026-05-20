import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  accent?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children, variant = 'primary', accent = 'var(--push)', size = 'md',
  className = '', style, ...rest
}: Props) {
  const padding = size === 'sm' ? '8px 12px' : size === 'lg' ? '14px 22px' : '11px 16px';
  const fontSize = size === 'sm' ? 12 : size === 'lg' ? 14 : 13;

  const styles: React.CSSProperties = { padding, fontSize, ...style };

  if (variant === 'primary') {
    Object.assign(styles, {
      background: accent,
      color: '#fff',
      border: 'none',
      boxShadow: `0 4px 20px color-mix(in oklab, ${accent} 40%, transparent)`,
    });
  } else if (variant === 'secondary') {
    Object.assign(styles, {
      background: `color-mix(in oklab, ${accent} 10%, transparent)`,
      color: accent,
      border: `1px solid color-mix(in oklab, ${accent} 35%, var(--border))`,
    });
  } else if (variant === 'ghost') {
    Object.assign(styles, {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)',
    });
  } else if (variant === 'danger') {
    Object.assign(styles, {
      background: 'rgba(255,68,68,0.04)',
      color: '#ff6666',
      border: '1px solid rgba(255,68,68,0.2)',
    });
  }

  return (
    <button
      {...rest}
      className={`rounded-xl font-bold tracking-wide cursor-pointer transition-all duration-200 active:scale-[0.97] disabled:opacity-50 ${className}`}
      style={styles}
    >
      {children}
    </button>
  );
}

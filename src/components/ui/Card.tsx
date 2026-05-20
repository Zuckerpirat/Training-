import { ReactNode, CSSProperties } from 'react';

interface Props {
  children: ReactNode;
  accent?: string;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({ children, accent, glow, className = '', style, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border transition-all duration-200 ${className}`}
      style={{
        background: 'var(--surface)',
        borderColor: accent ? `color-mix(in oklab, ${accent} 35%, var(--border))` : 'var(--border)',
        boxShadow: glow && accent ? `0 4px 24px color-mix(in oklab, ${accent} 22%, transparent)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

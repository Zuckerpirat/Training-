import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  accent?: string;
  filled?: boolean;
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { accent = 'var(--push)', filled, className = '', style, ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      {...rest}
      className={`w-full rounded-[10px] outline-none transition-all duration-150 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--push)_25%,transparent)] ${className}`}
      style={{
        padding: '10px 12px',
        background: 'var(--input-bg)',
        color: 'var(--text)',
        border: `1px solid ${filled ? `color-mix(in oklab, ${accent} 50%, var(--border))` : 'var(--border)'}`,
        fontSize: 14,
        ...style,
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 0 0 3px color-mix(in oklab, ${accent} 25%, transparent)`;
        rest.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = filled
          ? `color-mix(in oklab, ${accent} 50%, var(--border))`
          : 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        rest.onBlur?.(e);
      }}
    />
  );
});

export default Input;

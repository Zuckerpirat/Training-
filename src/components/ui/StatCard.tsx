interface Props {
  label: string;
  value: string | number;
  accent: string;
}

export default function StatCard({ label, value, accent }: Props) {
  return (
    <div
      className="rounded-2xl text-center transition-all duration-200"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        padding: '14px 8px',
      }}
    >
      <div className="font-mono-num font-bold" style={{ fontSize: 15, color: accent }}>
        {value}
      </div>
      <div
        className="font-semibold mt-1"
        style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px' }}
      >
        {label.toUpperCase()}
      </div>
    </div>
  );
}

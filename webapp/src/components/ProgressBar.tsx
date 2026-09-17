export default function ProgressBar({ pct, color = 'var(--accent)', height = 5 }: { pct: number; color?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: '#EDEAE4', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 99, background: color, width: `${pct}%`, transition: 'width .25s ease' }} />
    </div>
  );
}

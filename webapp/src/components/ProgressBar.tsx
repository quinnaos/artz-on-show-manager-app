export default function ProgressBar({ pct, color = 'var(--accent)', height = 7 }: { pct: number; color?: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: 'rgba(124,58,237,.1)', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 99, background: color, width: `${pct}%`, transition: 'width .25s ease' }} />
    </div>
  );
}

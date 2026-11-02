import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AdminHeader({
  kicker,
  title,
  backHref,
  backLabel,
}: {
  kicker: string;
  title: ReactNode;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #4c1d95, #6d28d9)',
        padding: '20px 20px 22px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.65)' }}>
            {kicker}
          </div>
          <div style={{ marginTop: 5, font: "600 22px/1.2 var(--font-sans)", letterSpacing: '-.02em', color: '#fff' }}>{title}</div>
        </div>
        <Link
          href={backHref}
          style={{
            flex: 'none',
            padding: '9px 15px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.16)',
            font: "500 13px/1 var(--font-sans)",
            color: '#fff',
            whiteSpace: 'nowrap',
          }}
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

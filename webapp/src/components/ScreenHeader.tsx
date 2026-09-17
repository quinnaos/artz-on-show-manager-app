'use client';

import Link from 'next/link';

export default function ScreenHeader({
  kicker,
  title,
  backHref,
}: {
  kicker?: string;
  title?: string;
  backHref?: string;
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flex: 'none',
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '18px 20px 15px',
        paddingTop: 'max(18px, env(safe-area-inset-top))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 32 }}>
        {backHref && (
          <Link
            href={backHref}
            style={{
              width: 31,
              height: 31,
              flex: 'none',
              borderRadius: 99,
              background: '#F0EEEA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              font: "400 19px/1 var(--font-sans)",
              color: 'var(--ink)',
              paddingBottom: 3,
            }}
          >
            &lsaquo;
          </Link>
        )}
        {(kicker || title) && (
          <div style={{ minWidth: 0, flex: 1 }}>
            {kicker && (
              <div style={{ font: "500 9.5px/1 var(--font-mono)", letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {kicker}
              </div>
            )}
            {title && (
              <div
                style={{
                  marginTop: 5,
                  font: "500 18.5px/1.15 var(--font-sans)",
                  letterSpacing: '-.015em',
                  color: 'var(--ink)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

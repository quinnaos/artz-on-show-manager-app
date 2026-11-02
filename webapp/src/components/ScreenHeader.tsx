'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

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
        flex: 'none',
        padding: '20px 20px 18px',
        paddingTop: 'max(20px, env(safe-area-inset-top))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 36 }}>
        {backHref && (
          <Link
            href={backHref}
            style={{
              width: 36,
              height: 36,
              flex: 'none',
              borderRadius: 999,
              background: 'var(--glass-bg-strong)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              boxShadow: 'var(--shadow-glass)',
              border: 'var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)',
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.4} />
          </Link>
        )}
        {(kicker || title) && (
          <div style={{ minWidth: 0, flex: 1 }}>
            {kicker && (
              <div style={{ font: "600 10px/1 var(--font-sans)", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                {kicker}
              </div>
            )}
            {title && (
              <div
                style={{
                  marginTop: 5,
                  font: "600 22px/1.15 var(--font-sans)",
                  letterSpacing: '-.02em',
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

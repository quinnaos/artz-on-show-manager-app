'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export default function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        marginTop: 22,
        padding: 14,
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: 'var(--glass-border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-glass)',
        textAlign: 'center',
        font: "600 13.5px/1 var(--font-sans)",
        color: 'var(--accent)',
      }}
    >
      {children}
    </Link>
  );
}

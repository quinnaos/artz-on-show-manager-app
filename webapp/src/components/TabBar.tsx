'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar({ hubId }: { hubId: string }) {
  const pathname = usePathname();
  const base = `/hub/${hubId}`;

  const tabs = [
    { id: 'home', name: 'Today', href: base, radius: '99px' },
    { id: 'checklists', name: 'Checklists', href: `${base}/checklists`, radius: '4px' },
    { id: 'points', name: 'Points', href: `${base}/points`, radius: '2px' },
    { id: 'welcome', name: 'Welcome', href: `${base}/welcome`, radius: '99px' },
    { id: 'info', name: 'Info', href: `${base}/info`, radius: '99px' },
  ];

  const isActive = (href: string) => (href === base ? pathname === base : pathname.startsWith(href));

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        maxWidth: 480,
        margin: '0 auto',
        zIndex: 40,
        background: '#fff',
        borderTop: '1px solid var(--border)',
        padding: '9px 12px',
        paddingBottom: 'max(9px, env(safe-area-inset-bottom))',
        display: 'flex',
      }}
    >
      {tabs.map((t) => {
        const active = isActive(t.href);
        const color = active ? 'var(--accent)' : 'var(--ink-faint)';
        return (
          <Link
            key={t.id}
            href={t.href}
            style={{
              flex: 1,
              padding: '8px 2px',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              background: active ? '#F5F1FE' : 'transparent',
            }}
          >
            <div
              style={{
                width: 17,
                height: 17,
                borderRadius: t.radius,
                border: `1.8px solid ${color}`,
                background: active ? color : 'transparent',
              }}
            />
            <div style={{ font: "500 9.5px/1 var(--font-sans)", color, whiteSpace: 'nowrap' }}>{t.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

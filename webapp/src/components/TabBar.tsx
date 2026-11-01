'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, Trophy, Sparkles, Info } from 'lucide-react';

export default function TabBar({ hubId }: { hubId: string }) {
  const pathname = usePathname();
  const base = `/hub/${hubId}`;

  const tabs = [
    { id: 'home', name: 'Today', href: base, Icon: Home },
    { id: 'checklists', name: 'Checklists', href: `${base}/checklists`, Icon: ListChecks },
    { id: 'points', name: 'Points', href: `${base}/points`, Icon: Trophy },
    { id: 'welcome', name: 'Welcome', href: `${base}/welcome`, Icon: Sparkles },
    { id: 'info', name: 'Info', href: `${base}/info`, Icon: Info },
  ];

  const isActive = (href: string) => (href === base ? pathname === base : pathname.startsWith(href));

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
        pointerEvents: 'none',
      }}
    >
      <div
        className="app-shell"
        style={{
          display: 'flex',
          gap: 2,
          margin: '0 14px',
          padding: 6,
          background: 'rgba(255,255,255,.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 999,
          boxShadow: 'var(--shadow-soft)',
          border: '1px solid rgba(255,255,255,.6)',
          pointerEvents: 'auto',
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
                padding: '9px 2px',
                borderRadius: 999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                background: active ? 'var(--accent-light)' : 'transparent',
              }}
            >
              <t.Icon size={19} strokeWidth={2.2} color={color} />
              <div style={{ font: "600 9.5px/1 var(--font-sans)", color, whiteSpace: 'nowrap' }}>{t.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

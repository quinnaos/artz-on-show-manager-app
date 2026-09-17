'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { WELCOME } from '@/lib/data/welcome';
import { showsAt } from '@/lib/logic';
import ScreenHeader from '@/components/ScreenHeader';

export default function MorningWelcomePage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);

  const sections = WELCOME.map((sec) => ({
    ...sec,
    items: sec.items.filter((it) => showsAt(it, hub.id)),
  })).filter((sec) => sec.items.length > 0);

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Morning Welcome" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ font: "400 13.5px/1.55 var(--font-sans)", color: 'var(--ink-muted)' }}>
          Cover these in the Daily Welcome at approx 9:20am, groups sitting in their lines.
        </div>
        {sections.map((sec) => {
          const show = sec.tone === 'show';
          const venue = sec.tone === 'venue';
          const labelColor = show ? 'var(--accent)' : 'var(--ink-faint)';
          const bg = show ? '#F7F4FE' : '#fff';
          const border = show ? '#DDD0FB' : 'var(--border)';
          const rule = show ? '#E8DFFC' : '#EFEDE9';
          const dot = show ? 'var(--accent)' : venue ? '#C2410C' : '#CFCBC3';
          return (
            <div key={sec.name} style={{ marginTop: 22 }}>
              <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: labelColor }}>
                {sec.name}
              </div>
              <div style={{ marginTop: 11, background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '4px 16px' }}>
                {sec.items.map((it, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '13px 0',
                      borderBottom: i === sec.items.length - 1 ? 'none' : `1px solid ${rule}`,
                    }}
                  >
                    <div style={{ width: 6, height: 6, flex: 'none', borderRadius: 99, background: dot, marginTop: 7 }} />
                    <div style={{ flex: 1, minWidth: 0, font: "400 14px/1.5 var(--font-sans)", color: 'var(--ink)' }}>{it.t}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <Link
          href={`/hub/${hub.id}`}
          style={{
            display: 'block',
            marginTop: 22,
            padding: 14,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 13,
            textAlign: 'center',
            font: "500 13.5px/1 var(--font-sans)",
            color: 'var(--accent)',
          }}
        >
          &lsaquo; Back to hub home
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { ALL_LISTS } from '@/lib/data/checklists';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';

export default function ChecklistsListPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { progress } = useHubData();

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Checklists" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
          Daily Admin runs every day. The day checklist changes with the programme.
        </div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ALL_LISTS.map((l) => {
            const p = progress(l.id);
            const complete = p.total > 0 && p.done === p.total;
            const isDaily = l.id === 'admin' || l.id === 'certs';
            const barColor = complete ? 'var(--good)' : p.done ? 'var(--accent)' : 'rgba(27,26,31,.35)';
            return (
              <Link
                key={l.id}
                href={`/hub/${hub.id}/checklists/${l.id}`}
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'var(--glass-blur)',
                  WebkitBackdropFilter: 'var(--glass-blur)',
                  border: 'var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-glass)',
                  padding: '15px 17px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flex: 'none',
                    borderRadius: 12,
                    background: isDaily ? 'var(--ink)' : 'var(--accent-light)',
                    color: isDaily ? '#fff' : '#5B21B6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    font: "700 12px/1 var(--font-sans)",
                  }}
                >
                  {l.abbr}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "700 15.5px/1.2 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{l.name}</div>
                  <div style={{ marginTop: 4, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>
                    {(l.subAlt || {})[hub.id] || l.sub}
                  </div>
                </div>
                <div style={{ font: "700 11.5px/1 var(--font-sans)", color: barColor }}>
                  {p.done}/{p.total}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

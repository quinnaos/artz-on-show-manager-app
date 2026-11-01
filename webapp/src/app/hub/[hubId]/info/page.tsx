'use client';

import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { CONTACTS } from '@/lib/data/contacts';
import ScreenHeader from '@/components/ScreenHeader';
import BackLink from '@/components/BackLink';

export default function InfoPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Venue and Contacts" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '4px 20px 32px' }}>
        <div
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-glass)',
            padding: 17,
          }}
        >
          <div className="section-label">Venue</div>
          <div style={{ marginTop: 10, font: "400 15px/1.45 var(--font-sans)", color: 'var(--ink)' }}>{hub.venue}</div>
        </div>

        <div
          style={{
            marginTop: 12,
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-glass)',
            padding: '4px 17px',
          }}
        >
          {CONTACTS.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i === CONTACTS.length - 1 ? 'none' : '1px solid rgba(27,26,31,.08)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "600 14.5px/1.25 var(--font-sans)", color: 'var(--ink)' }}>{c.name}</div>
                <div style={{ marginTop: 3, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>{c.role}</div>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ font: "700 12.5px/1 var(--font-sans)", color: 'var(--accent)' }}>
                {c.phone}
              </a>
            </div>
          ))}
        </div>

        <BackLink href="/hubs">Switch hub</BackLink>
      </div>
    </div>
  );
}

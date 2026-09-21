'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { CONTACTS } from '@/lib/data/contacts';
import ScreenHeader from '@/components/ScreenHeader';

export default function InfoPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Venue and Contacts" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 17 }}>
          <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Venue</div>
          <div style={{ marginTop: 10, font: "400 15px/1.45 var(--font-sans)", color: 'var(--ink)' }}>{hub.venue}</div>
        </div>

        <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '4px 17px' }}>
          {CONTACTS.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i === CONTACTS.length - 1 ? 'none' : '1px solid #EFEDE9' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "500 14.5px/1.25 var(--font-sans)", color: 'var(--ink)' }}>{c.name}</div>
                <div style={{ marginTop: 3, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>{c.role}</div>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ font: "500 12.5px/1 var(--font-mono)", color: 'var(--accent)' }}>
                {c.phone}
              </a>
            </div>
          ))}
        </div>

        <Link
          href="/hubs"
          style={{
            display: 'block',
            marginTop: 14,
            padding: '15px 17px',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 14,
            textAlign: 'center',
            font: "500 13.5px/1 var(--font-sans)",
            color: 'var(--accent)',
          }}
        >
          Switch hub
        </Link>
      </div>
    </div>
  );
}

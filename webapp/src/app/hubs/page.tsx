import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { HUBS } from '@/lib/data/hubs';
import { ADMIN, listById } from '@/lib/data/checklists';
import { progressOf, type TickMap } from '@/lib/logic';
import SignOutButton from '@/components/SignOutButton';

export default async function HubsPage() {
  const profile = await getProfile();
  if (!profile) redirect('/pending');

  const hubs = profile.role === 'owner' ? HUBS : HUBS.filter((h) => profile.hubIds.includes(h.id));

  const supabase = await createClient();
  const tickMap: TickMap = {};
  if (hubs.length) {
    const { data: ticks } = await supabase
      .from('ticks')
      .select('hub_id, scope, item_index, ticked_at')
      .in(
        'hub_id',
        hubs.map((h) => h.id)
      );
    (ticks ?? []).forEach((r) => {
      tickMap[`${r.hub_id}|${r.scope}|${r.item_index}`] = r.ticked_at;
    });
  }

  const dayList = listById('mon');
  const cards = hubs.map((h) => {
    const admin = progressOf(ADMIN, h.id, 'mon', tickMap);
    const day = progressOf(dayList, h.id, 'mon', tickMap);
    const done = admin.done + day.done;
    const total = admin.total + day.total;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const color = pct === 0 ? '#C2410C' : pct >= 90 ? 'var(--good)' : 'var(--accent)';
    return { hub: h, pct, color };
  });

  const name = profile.name || profile.email.split('@')[0];
  const todayLabel = new Date().toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ minHeight: '100vh', maxWidth: 480, margin: '0 auto', background: 'var(--surface)' }}>
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid var(--border)',
          padding: '18px 20px 15px',
          paddingTop: 'max(18px, env(safe-area-inset-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Image src="/logo-black.png" alt="Artz On Show" height={27} width={140} style={{ height: 27, width: 'auto' }} priority />
        <SignOutButton />
      </div>

      <div style={{ padding: '24px 20px 32px' }}>
        <div style={{ font: "400 22px/1.25 var(--font-sans)", letterSpacing: '-.02em', color: 'var(--ink)' }}>Hello {name}!</div>
        <div style={{ marginTop: 5, font: "400 14px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>{todayLabel}</div>

        <div style={{ margin: '26px 0 10px', font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
          {profile.role === 'owner' ? 'Operation hubs' : 'Your hubs'}
        </div>

        {cards.length === 0 && (
          <div style={{ padding: '16px 17px', background: '#fff', border: '1px dashed var(--border)', borderRadius: 14, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
            You&rsquo;re not assigned to a hub yet. Ask your admin to add you to one.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cards.map(({ hub, pct, color }) => (
            <Link
              key={hub.id}
              href={`/hub/${hub.id}`}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 17px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "500 16.5px/1.2 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{hub.name}</div>
                <div style={{ marginTop: 4, font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hub.venue}
                </div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 70, height: 5, borderRadius: 99, background: '#EDEAE4', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: color, width: `${pct}%` }} />
                  </div>
                  <div style={{ font: "500 11.5px/1 var(--font-mono)", color }}>{pct}%</div>
                </div>
              </div>
              <div style={{ font: "400 20px/1 var(--font-sans)", color: 'rgba(27,26,31,.28)' }}>&rsaquo;</div>
            </Link>
          ))}
        </div>

        {profile.role === 'owner' && (
          <Link
            href="/admin"
            style={{
              display: 'block',
              marginTop: 22,
              padding: '14px 17px',
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 13,
              textAlign: 'center',
              font: "500 13.5px/1 var(--font-sans)",
              color: 'var(--accent)',
            }}
          >
            Manage Managers
          </Link>
        )}
      </div>
    </div>
  );
}

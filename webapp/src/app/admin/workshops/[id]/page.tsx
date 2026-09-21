import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { hubById } from '@/lib/data/hubs';
import { listById, allItems } from '@/lib/data/checklists';
import { GROUPS } from '@/lib/data/groups';
import { parseScope } from '@/lib/logic';

function formatDate(d: Date) {
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso)
    .toLocaleString('en-NZ', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, ' ');
}

export default async function WorkshopHistoryPage({ params }: PageProps<'/admin/workshops/[id]'>) {
  const { id } = await params;
  const workshopId = Number(id);

  const profile = await getProfile();
  if (!profile) redirect('/pending');
  if (profile.role !== 'owner') redirect('/hubs');

  const supabase = await createClient();
  const [{ data: workshop }, { data: ticks }, { data: awards }, { data: signOffs }] = await Promise.all([
    supabase.from('workshops').select('hub_id, start_date, label').eq('id', workshopId).maybeSingle(),
    supabase.from('ticks').select('scope, item_index, ticked_at, ticked_by').eq('workshop_id', workshopId).order('ticked_at'),
    supabase.from('points_awards').select('group_id, delta, awarded_by').eq('workshop_id', workshopId).order('created_at'),
    supabase.from('sign_offs').select('scope, signed_by, signed_at').eq('workshop_id', workshopId).order('signed_at'),
  ]);
  if (!workshop) notFound();

  const hub = hubById(workshop.hub_id);
  const start = new Date(`${workshop.start_date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  const peopleIds = Array.from(
    new Set(
      [
        ...(ticks ?? []).map((t) => t.ticked_by),
        ...(awards ?? []).map((a) => a.awarded_by),
        ...(signOffs ?? []).map((s) => s.signed_by),
      ].filter((v): v is string => !!v)
    )
  );
  const { data: people } =
    peopleIds.length > 0 ? await supabase.from('profiles').select('id, name, email').in('id', peopleIds) : { data: [] };
  const nameFor = (id: string | null) => {
    if (!id) return 'Unknown';
    const p = (people ?? []).find((p) => p.id === id);
    return p ? p.name || p.email.split('@')[0] : 'Unknown';
  };

  // Group ticks by which checklist they belong to.
  const byList = new Map<string, { time: string; by: string; text: string }[]>();
  (ticks ?? []).forEach((t) => {
    const { listId } = parseScope(t.scope);
    const list = listById(listId);
    const item = allItems(list)[t.item_index];
    if (!item) return;
    const rows = byList.get(listId) ?? [];
    rows.push({ time: formatTime(t.ticked_at), by: nameFor(t.ticked_by), text: item.t });
    byList.set(listId, rows);
  });

  const groups = GROUPS[hub.id] ?? [];
  const pointsTotals = groups.map((g) => ({
    group: g,
    total: (awards ?? []).filter((a) => a.group_id === g.id).reduce((sum, a) => sum + a.delta, 0),
  }));

  return (
    <div style={{ minHeight: '100vh', maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
            {hub.name}
          </div>
          <h1 style={{ margin: '6px 0 0', font: "400 24px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>{workshop.label || 'Workshop'}</h1>
          <div style={{ marginTop: 4, font: "400 13px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>
            {formatDate(start)} &ndash; {formatDate(end)}
          </div>
        </div>
        <Link href="/admin" style={{ font: "500 13.5px/1 var(--font-sans)", color: 'var(--accent)' }}>
          &lsaquo; Back to admin
        </Link>
      </div>

      {(!ticks || ticks.length === 0) && (!awards || awards.length === 0) && (!signOffs || signOffs.length === 0) && (
        <div style={{ marginTop: 24, padding: 16, background: '#fff', border: '1px dashed var(--border)', borderRadius: 14, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
          No records for this workshop &mdash; either nothing was ticked, or its detailed records have already aged out (records are
          automatically cleared 4 weeks after a workshop&rsquo;s Day 5).
        </div>
      )}

      {byList.size > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
            Checklists
          </h2>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Array.from(byList.entries()).map(([listId, rows]) => (
              <div key={listId} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <div style={{ font: "500 15px/1.3 var(--font-sans)" }}>{listById(listId).name}</div>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                      <div style={{ flex: 1, font: "400 13.5px/1.4 var(--font-sans)" }}>{r.text}</div>
                      <div style={{ font: "400 12px/1.4 var(--font-mono)", color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                        {r.by} &middot; {r.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {groups.length > 0 && awards && awards.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
            Points
          </h2>
          <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {pointsTotals.map(({ group, total }) => (
              <div key={group.id}>
                <div style={{ font: "500 11px/1 var(--font-mono)", color: group.color }}>{group.name}</div>
                <div style={{ marginTop: 4, font: "500 24px/1 var(--font-sans)" }}>{total}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {signOffs && signOffs.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-faint)', margin: 0 }}>
            Sign-offs
          </h2>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signOffs.map((s) => {
              const { listId } = parseScope(s.scope);
              return (
                <div key={s.scope} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ font: "500 14px/1.3 var(--font-sans)" }}>{listById(listId).name}</div>
                  <div style={{ font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                    {nameFor(s.signed_by)} &middot; {formatTime(s.signed_at)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

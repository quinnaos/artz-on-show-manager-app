import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfile } from '@/lib/auth';
import { nzNow } from '@/lib/logic';
import { loadWorkshopRecords, formatDate } from '@/lib/workshopRecords';

export default async function WorkshopHistoryPage({ params }: PageProps<'/admin/workshops/[id]'>) {
  const { id } = await params;
  const workshopId = Number(id);

  const profile = await getProfile();
  if (!profile) redirect('/pending');
  if (profile.role !== 'owner') redirect('/hubs');

  const records = await loadWorkshopRecords(workshopId);
  if (!records) notFound();
  const { hub, start, end, checklists, points, hasAwards, signOffs } = records;

  const exportedAt = nzNow().toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div style={{ minHeight: '100vh', maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="section-label">{hub.name}</div>
          <h1 style={{ margin: '6px 0 0', font: "400 24px/1.2 var(--font-sans)", letterSpacing: '-.02em' }}>{records.label || 'Workshop'}</h1>
          <div style={{ marginTop: 4, font: "400 13px/1.4 var(--font-sans)", color: 'var(--ink-muted)' }}>
            {formatDate(start)} &ndash; {formatDate(end)}
          </div>
          <div style={{ marginTop: 2, font: "400 11.5px/1.4 var(--font-sans)", color: 'var(--ink-faint)' }}>Exported {exportedAt} NZT</div>
        </div>
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {/* Plain <a>, not <Link>: it's a file download, not a page. */}
          <a
            href={`/admin/workshops/${workshopId}/pdf`}
            download
            style={{
              padding: '9px 15px',
              borderRadius: 99,
              border: '1px solid var(--border)',
              background: '#fff',
              font: "500 13px/1 var(--font-sans)",
              color: 'var(--accent)',
              whiteSpace: 'nowrap',
            }}
          >
            Download PDF
          </a>
          <Link href="/admin" style={{ font: "500 13.5px/1 var(--font-sans)", color: 'var(--accent)' }}>
            &lsaquo; Back to admin
          </Link>
        </div>
      </div>

      {checklists.length === 0 && !hasAwards && signOffs.length === 0 && (
        <div style={{ marginTop: 24, padding: 16, background: '#fff', border: '1px dashed var(--border)', borderRadius: 14, font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
          No records for this workshop &mdash; either nothing was ticked, or its detailed records have already aged out (records are
          automatically cleared 4 weeks after a workshop&rsquo;s Day 5).
        </div>
      )}

      {checklists.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink)', margin: 0 }}>
            Checklists
          </h2>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {checklists.map((section) => (
              <div key={section.key} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <div style={{ font: "500 15px/1.3 var(--font-sans)" }}>{section.title}</div>
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {section.rows.map((r) => (
                    <div key={r.index} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
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

      {points.length > 0 && hasAwards && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink)', margin: 0 }}>
            Points
          </h2>
          <div style={{ marginTop: 12, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 16, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {points.map(({ group, total }) => (
              <div key={group.id}>
                <div style={{ font: "500 11px/1 var(--font-mono)", color: group.color }}>{group.name}</div>
                <div style={{ marginTop: 4, font: "500 24px/1 var(--font-sans)" }}>{total}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {signOffs.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ font: "500 13px/1 var(--font-mono)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink)', margin: 0 }}>
            Sign-offs
          </h2>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {signOffs.map((s) => (
              <div key={s.key} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ font: "500 14px/1.3 var(--font-sans)" }}>{s.title}</div>
                <div style={{ font: "400 12.5px/1.4 var(--font-sans)", color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                  {s.by} &middot; {s.time}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

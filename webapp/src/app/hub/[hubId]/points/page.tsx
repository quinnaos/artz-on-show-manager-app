'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { GROUPS } from '@/lib/data/groups';
import { DAYS } from '@/lib/data/checklists';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';

export default function PointsPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { dayId, pointsTotal, award, canUndo, lastAwardLabel, undoLastAward } = useHubData();

  const groups = GROUPS[hub.id] ?? [];
  const scores = groups.map((g) => pointsTotal(dayId, g.id));
  const top = Math.max(0, ...scores);
  const dayName = (DAYS.find((d) => d.id === dayId) ?? DAYS[0]).name;

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Points" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>Tap to award. Points can never be taken away.</div>
          <div style={{ font: "500 10.5px/1 var(--font-mono)", color: 'var(--ink-faint)' }}>{dayName}</div>
        </div>

        {groups.length === 0 && (
          <div style={{ marginTop: 16, padding: '14px 16px', background: '#fff', border: '1px dashed #D6D2CB', borderRadius: 12, font: "400 13px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
            No colour groups set up for {hub.name} yet. Ask your admin to add them.
          </div>
        )}

        {groups.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {groups.map((g, i) => {
              const n = scores[i];
              const lead = n > 0 && n === top;
              return (
                <div key={g.id} style={{ background: g.bg, border: `1.5px solid ${lead ? g.color : g.border}`, borderRadius: 16, padding: '15px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: "500 15px/1.2 var(--font-sans)", letterSpacing: '-.01em', color: g.color }}>{g.name}</div>
                      {lead && (
                        <div style={{ marginTop: 5, display: 'inline-flex', padding: '3px 8px', borderRadius: 99, background: g.color, font: "500 9px/1.35 var(--font-mono)", letterSpacing: '.09em', textTransform: 'uppercase', color: '#fff' }}>
                          Leading
                        </div>
                      )}
                    </div>
                    <div style={{ font: "500 40px/1 var(--font-sans)", letterSpacing: '-.03em', color: g.color, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
                  </div>
                  <div style={{ marginTop: 13, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[1, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => award(g.id, n)}
                        style={{ padding: '13px 0', borderRadius: 11, background: '#fff', border: `1px solid ${g.border}`, textAlign: 'center', font: "500 15px/1 var(--font-sans)", color: g.color, userSelect: 'none' }}
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={undoLastAward}
          disabled={!canUndo}
          style={{
            marginTop: 14,
            width: '100%',
            padding: 13,
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 12,
            textAlign: 'center',
            font: "500 13px/1 var(--font-sans)",
            color: canUndo ? 'var(--accent)' : 'rgba(27,26,31,.35)',
          }}
        >
          {lastAwardLabel || 'Nothing to undo'}
        </button>

        {groups.length > 0 && (
          <div style={{ marginTop: 14, padding: '13px 15px', background: '#F7F4FE', border: '1px solid #DDD0FB', borderRadius: 12, font: "400 12.5px/1.55 var(--font-sans)", color: '#3F2A6B' }}>
            Totals reset with each day. Add all points to the whiteboard and announce in order at Group Time, beginning with Orange. If groups are far apart, bump up the lower ones.
          </div>
        )}

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

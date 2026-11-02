'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { GROUP_PALETTE, GROUP_IDS } from '@/lib/data/groups';
import { DAYS } from '@/lib/data/checklists';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';
import BackLink from '@/components/BackLink';
import { Undo2, Info, Settings2, Check } from 'lucide-react';

export default function PointsPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { dayId, pointsTotal, award, canUndo, lastAwardLabel, undoLastAward, resetPoints, groups, groupIds, updateGroupIds } = useHubData();
  const [editingGroups, setEditingGroups] = useState(false);

  const scores = groups.map((g) => pointsTotal(dayId, g.id));
  const top = Math.max(0, ...scores);
  const dayName = (DAYS.find((d) => d.id === dayId) ?? DAYS[0]).name;

  const toggleGroup = (id: string) => {
    const next = groupIds.includes(id) ? groupIds.filter((g) => g !== id) : [...groupIds, id];
    updateGroupIds(GROUP_IDS.filter((g) => next.includes(g)));
  };

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Points" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '4px 20px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ font: "400 13.5px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>Tap to award. Points can never be taken away.</div>
          <div style={{ font: "600 10.5px/1 var(--font-sans)", letterSpacing: '.04em', color: 'var(--ink-faint)' }}>{dayName}</div>
        </div>

        <button
          onClick={() => setEditingGroups((v) => !v)}
          style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, background: 'var(--brand-orange-tint)', font: "500 12.5px/1 var(--font-sans)", color: 'var(--brand-orange-text)' }}
        >
          <Settings2 size={14} strokeWidth={2.4} />
          {editingGroups ? 'Done editing groups' : 'Edit groups'}
        </button>

        {editingGroups && (
          <div className="glass-pop" style={{ marginTop: 10, padding: '14px 15px', background: 'var(--brand-orange-tint)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-pop)' }}>
            <div style={{ font: "400 12.5px/1.5 var(--font-sans)", color: 'var(--brand-orange-text)' }}>
              Choose up to six colour groups for this workshop. Changes apply straight away.
            </div>
            <div style={{ marginTop: 11, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {GROUP_IDS.map((id) => {
                const g = GROUP_PALETTE[id];
                const active = groupIds.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleGroup(id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 13px',
                      borderRadius: 999,
                      background: active ? g.bg : '#fff',
                      border: `1.5px solid ${active ? g.color : 'var(--border)'}`,
                      font: "500 12.5px/1 var(--font-sans)",
                      color: active ? g.color : 'var(--ink-faint)',
                    }}
                  >
                    {active && <Check size={13} strokeWidth={3} />}
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {groups.length === 0 && (
          <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur)', border: 'var(--glass-border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-glass)', font: "400 13px/1.5 var(--font-sans)", color: 'var(--ink-muted)' }}>
            No colour groups set up for {hub.name} yet. Tap &ldquo;Edit groups&rdquo; above to add some.
          </div>
        )}

        {groups.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {groups.map((g, i) => {
              const n = scores[i];
              const lead = n > 0 && n === top;
              return (
                <div
                  key={g.id}
                  style={{
                    background: g.bg,
                    border: `1.5px solid ${lead ? g.color : 'transparent'}`,
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    padding: '16px 17px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: "600 15px/1.2 var(--font-sans)", letterSpacing: '-.01em', color: g.color }}>{g.name}</div>
                      {lead && (
                        <div style={{ marginTop: 5, display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: g.color, font: "600 9px/1.35 var(--font-sans)", letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff' }}>
                          Leading
                        </div>
                      )}
                    </div>
                    <div style={{ font: "600 40px/1 var(--font-sans)", letterSpacing: '-.03em', color: g.color, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
                  </div>
                  <div style={{ marginTop: 13, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[1, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => award(g.id, n)}
                        style={{ padding: '13px 0', borderRadius: 999, background: '#fff', boxShadow: 'var(--shadow-soft)', textAlign: 'center', font: "600 15px/1 var(--font-sans)", color: g.color, userSelect: 'none' }}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            background: 'var(--glass-bg)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            border: 'var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-glass)',
            textAlign: 'center',
            font: "500 13px/1 var(--font-sans)",
            color: canUndo ? 'var(--accent)' : 'rgba(27,26,31,.35)',
          }}
        >
          <Undo2 size={15} strokeWidth={2.4} />
          {lastAwardLabel || 'Nothing to undo'}
        </button>

        {groups.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm(`Reset every group back to 0 for ${dayName}? This can't be undone.`)) resetPoints();
            }}
            style={{
              marginTop: 10,
              width: '100%',
              padding: 13,
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: 'var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-glass)',
              textAlign: 'center',
              font: "500 13px/1 var(--font-sans)",
              color: '#9B1C1C',
            }}
          >
            Reset Points
          </button>
        )}

        {groups.length > 0 && (
          <div style={{ marginTop: 14, padding: '13px 15px', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 9 }}>
            <Info size={15} strokeWidth={2.4} color="#5B21B6" style={{ flex: 'none', marginTop: 2 }} />
            <div style={{ font: "400 12.5px/1.55 var(--font-sans)", color: '#3F2A6B' }}>
              Totals reset with each day. Add all points to the whiteboard and announce in order at Group Time, beginning with Orange. If groups are far apart, bump up the lower ones.
            </div>
          </div>
        )}

        <BackLink href={`/hub/${hub.id}`}>&lsaquo; Back to hub home</BackLink>
      </div>
    </div>
  );
}

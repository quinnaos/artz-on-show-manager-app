'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ChecklistItem } from '@/lib/types';

function formatTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, '')
    .toLowerCase();
}

export default function ChecklistItemRow({
  item,
  tickedAt,
  onTick,
}: {
  item: ChecklistItem;
  tickedAt: string | null;
  onTick: () => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const on = !!tickedAt;

  // Plain opaque cards here rather than the frosted-glass treatment used
  // elsewhere - checklists can run to dozens of rows, and stacking that many
  // backdrop-filter blurs at once is a real jank risk on lower-end devices.
  return (
    <div style={{ background: on ? 'var(--good-bg)' : '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '14px 15px' }}>
      <button onClick={onTick} style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 24,
            height: 24,
            flex: 'none',
            borderRadius: 99,
            border: `1.5px solid ${on ? 'var(--good)' : '#CFCBC3'}`,
            background: on ? 'var(--good)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          {on && <Check size={14} strokeWidth={3} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "500 14.5px/1.4 var(--font-sans)", color: on ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: on ? 'line-through' : 'none' }}>
            {item.t}
          </div>
          {item.sub && (
            <div style={{ marginTop: 5, font: "400 12.5px/1.45 var(--font-sans)", color: 'var(--ink-muted)' }}>{item.sub}</div>
          )}
          {item.chip && (
            <div
              style={{
                marginTop: 9,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 99,
                background: 'var(--accent-light)',
                font: "600 10px/1.35 var(--font-sans)",
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                color: '#5B21B6',
              }}
            >
              {item.chip}
            </div>
          )}
          {on && (
            <div
              style={{
                marginTop: 9,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 99,
                background: '#fff',
                font: "600 10px/1.35 var(--font-sans)",
                letterSpacing: '.04em',
                textTransform: 'uppercase',
                color: 'var(--good)',
              }}
            >
              Ticked {formatTime(tickedAt!)}
            </div>
          )}
        </div>
      </button>
      {item.more && (
        <div style={{ margin: '9px 0 0 37px' }}>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 11px',
              borderRadius: 99,
              background: 'var(--brand-orange-tint)',
              font: "600 10px/1.35 var(--font-sans)",
              letterSpacing: '.04em',
              textTransform: 'uppercase',
              color: 'var(--brand-orange)',
            }}
          >
            {moreOpen ? 'Less' : 'More'}
          </button>
          {moreOpen && (
            <div
              className="glass-pop"
              style={{
                marginTop: 9,
                padding: '12px 14px',
                background: 'var(--brand-orange-tint)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-pop)',
                font: "400 12.5px/1.55 var(--font-sans)",
                color: 'var(--brand-orange-text)',
                whiteSpace: 'pre-line',
              }}
            >
              {item.more}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

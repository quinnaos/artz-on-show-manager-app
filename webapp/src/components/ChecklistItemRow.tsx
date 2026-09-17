'use client';

import { useState } from 'react';
import type { ChecklistItem } from '@/lib/types';

function formatTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit', hour12: true })
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

  return (
    <div style={{ background: on ? '#F7FBF8' : '#fff', border: `1px solid ${on ? 'var(--good-border)' : 'var(--border)'}`, borderRadius: 13, padding: '14px 15px' }}>
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
            font: "500 13px/1 var(--font-sans)",
            color: '#fff',
          }}
        >
          {on ? '✓' : ''}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "400 14.5px/1.4 var(--font-sans)", color: on ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: on ? 'line-through' : 'none' }}>
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
                padding: '4px 9px',
                borderRadius: 99,
                background: 'var(--accent-light)',
                font: "500 10px/1.35 var(--font-mono)",
                letterSpacing: '.07em',
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
                padding: '4px 9px',
                borderRadius: 99,
                background: 'var(--good-bg)',
                font: "500 10px/1.35 var(--font-mono)",
                letterSpacing: '.07em',
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
              padding: '4px 10px',
              borderRadius: 99,
              border: '1px solid #DDD0FB',
              background: '#F7F4FE',
              font: "500 10px/1.35 var(--font-mono)",
              letterSpacing: '.07em',
              textTransform: 'uppercase',
              color: '#5B21B6',
            }}
          >
            {moreOpen ? 'Less' : 'More'}
          </button>
          {moreOpen && (
            <div
              style={{
                marginTop: 9,
                padding: '11px 13px',
                background: '#F7F4FE',
                borderLeft: '2px solid #C4B5FD',
                borderRadius: '0 10px 10px 0',
                font: "400 12.5px/1.55 var(--font-sans)",
                color: '#4A3A6B',
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

'use client';

import { useState } from 'react';

export default function BriefCard({ lead, full }: { lead: string; full: string }) {
  const [open, setOpen] = useState(false);
  if (!lead && !full) return null;

  return (
    <div style={{ margin: '16px 20px 0', padding: '16px 17px', background: '#F7F4FE', border: '1px solid #DDD0FB', borderRadius: 14 }}>
      <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--accent)' }}>
        Brief
      </div>
      {lead && (
        <div style={{ marginTop: 10, font: "500 14px/1.55 var(--font-sans)", color: 'var(--ink)' }}>{lead}</div>
      )}
      {full && (
        <div style={{ marginTop: 11 }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: 99,
              border: '1px solid #DDD0FB',
              background: '#fff',
              font: "500 10px/1.35 var(--font-mono)",
              letterSpacing: '.07em',
              textTransform: 'uppercase',
              color: '#5B21B6',
            }}
          >
            {open ? 'Hide' : 'Read more'}
          </button>
          {open && (
            <div style={{ marginTop: 10, font: "400 13.5px/1.6 var(--font-sans)", color: '#3F2A6B' }}>{full}</div>
          )}
        </div>
      )}
    </div>
  );
}

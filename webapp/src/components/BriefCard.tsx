'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';

export default function BriefCard({ lead, full }: { lead: string; full: string }) {
  const [open, setOpen] = useState(false);
  if (!lead && !full) return null;

  return (
    <div style={{ margin: '16px 20px 0', padding: '16px 17px', background: 'var(--brand-orange-tint)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: "600 10.5px/1 var(--font-sans)", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--brand-orange)' }}>
        <Info size={12} strokeWidth={2.6} />
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
              padding: '5px 11px',
              borderRadius: 99,
              background: '#fff',
              font: "600 10px/1.35 var(--font-sans)",
              letterSpacing: '.05em',
              textTransform: 'uppercase',
              color: 'var(--brand-orange)',
            }}
          >
            {open ? 'Hide' : 'Read more'}
          </button>
          {open && (
            <div
              className="glass-pop"
              style={{
                marginTop: 10,
                padding: '12px 14px',
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-pop)',
                font: "400 13.5px/1.6 var(--font-sans)",
                color: 'var(--brand-orange-text)',
              }}
            >
              {full}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

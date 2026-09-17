'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { GROUPTIME } from '@/lib/data/groupTime';
import ScreenHeader from '@/components/ScreenHeader';

export default function GroupTimePage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Group Time" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ font: "400 13.5px/1.55 var(--font-sans)", color: 'var(--ink-muted)' }}>
          Group Time starts at 3:45pm. Work through in order.
        </div>
        {GROUPTIME.map((sec) => (
          <div key={sec.name} style={{ marginTop: 22 }}>
            <div style={{ font: "500 10.5px/1 var(--font-mono)", letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>
              {sec.name}
            </div>
            <div style={{ marginTop: 11, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '4px 16px' }}>
              {sec.items.map((it, i) => {
                const isNote = !!it.i;
                const dot = isNote ? '#DDD0FB' : '#CFCBC3';
                return (
                  <div
                    key={i}
                    style={{ display: 'flex', gap: 12, padding: '13px 0', borderBottom: i === sec.items.length - 1 ? 'none' : '1px solid #EFEDE9' }}
                  >
                    <div style={{ width: 6, height: 6, flex: 'none', borderRadius: 99, background: dot, marginTop: 7 }} />
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        font: "400 14px/1.5 var(--font-sans)",
                        color: isNote ? 'var(--ink-muted)' : 'var(--ink)',
                        fontStyle: isNote ? 'italic' : 'normal',
                      }}
                    >
                      {it.b && (
                        <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{it.b} </strong>
                      )}
                      {it.t || it.i}
                      {it.note && (
                        <div
                          style={{
                            marginTop: 7,
                            padding: '9px 12px',
                            background: '#F7F4FE',
                            borderLeft: '2px solid var(--accent)',
                            borderRadius: '0 9px 9px 0',
                            font: "400 13px/1.5 var(--font-sans)",
                            color: '#3F2A6B',
                          }}
                        >
                          {it.note}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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

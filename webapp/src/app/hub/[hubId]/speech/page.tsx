'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { SPEECH } from '@/lib/data/speech';
import ScreenHeader from '@/components/ScreenHeader';

export default function ClosingSpeechPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Closing Speech" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ font: "400 13.5px/1.55 var(--font-sans)", color: 'var(--ink-muted)' }}>
          Delivered by the Manager at the end of the show on Day 5.
        </div>
        <div style={{ marginTop: 14, padding: '12px 14px', background: '#F7F4FE', border: '1px solid #DDD0FB', borderRadius: 12, font: "400 12.5px/1.55 var(--font-sans)", color: '#3F2A6B' }}>
          Anything in <span style={{ color: '#6D28D9', fontStyle: 'italic' }}>[square brackets]</span> is a gap for you to fill with the week&rsquo;s detail.
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SPEECH.map((p, i) => {
            const parts = p.t.split(/(\[[^\]]*\])/).filter((x) => x !== '');
            return (
              <div key={i} style={{ background: p.cue ? '#F1ECFE' : 'transparent', padding: p.cue ? '13px 15px' : 0, borderRadius: p.cue ? 12 : 0 }}>
                <div style={{ fontSize: 15, lineHeight: 1.75, fontFamily: 'var(--font-sans)', whiteSpace: 'pre-line' }}>
                  {parts.map((part, j) => {
                    const fill = part.charAt(0) === '[';
                    return (
                      <span
                        key={j}
                        style={{
                          fontWeight: p.cue ? 500 : 400,
                          color: fill ? '#6D28D9' : p.cue ? '#4C1D95' : 'var(--ink)',
                          fontStyle: fill ? 'italic' : 'normal',
                        }}
                      >
                        {part}
                      </span>
                    );
                  })}
                </div>
                {p.hints && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {p.hints.map((h, k) => (
                      <div key={k} style={{ paddingLeft: 11, borderLeft: '2px solid var(--border)', font: "400 12.5px/1.5 var(--font-sans)", color: 'rgba(27,26,31,.52)' }}>
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { ADMIN, DAYS } from '@/lib/data/checklists';
import { currentBlock, ampm, nowTimeLabel } from '@/lib/logic';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';
import ProgressBar from '@/components/ProgressBar';

export default function HubHomePage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { dayId, setDayId, progress } = useHubData();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const day = DAYS.find((d) => d.id === dayId) ?? DAYS[0];
  const pAdmin = progress('admin');
  const pDay = progress(dayId);
  const homeCount = `${pAdmin.done + pDay.done}/${pAdmin.total + pDay.total}`;

  const { cur, next } = currentBlock(hub.id, dayId, now);
  let nowPart: string;
  let nowNote: string;
  let openHref: string;
  if (!cur) {
    nowPart = 'Before the Day Starts';
    nowNote = next ? `${next.name} at ${ampm(next.t)}. ${next.note}` : '';
    openHref = `/hub/${hub.id}/checklists/${dayId}`;
  } else {
    nowPart = cur.name;
    nowNote = cur.note + (next ? ` Next: ${next.name} at ${ampm(next.t)}.` : '');
    openHref =
      cur.go === 'welcome' ? `/hub/${hub.id}/welcome` : cur.go === 'group' ? `/hub/${hub.id}/group-time` : `/hub/${hub.id}/checklists/${dayId}`;
  }
  if (!cur && !next) {
    nowPart = 'Morning Welcome';
    nowNote = 'Approx 9:20am, groups sitting in their lines. Everything to cover before classes start.';
    openHref = `/hub/${hub.id}/welcome`;
  }

  const listCard = (l: typeof ADMIN) => {
    const p = progress(l.id);
    const barColor = p.done === p.total && p.total ? 'var(--good)' : p.done ? 'var(--accent)' : 'rgba(27,26,31,.35)';
    return (
      <Link
        key={l.id}
        href={`/hub/${hub.id}/checklists/${l.id}`}
        style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 17px' }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <div style={{ flex: 1, font: "500 15.5px/1.25 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{l.name}</div>
          <div style={{ font: "500 11.5px/1 var(--font-mono)", color: barColor }}>
            {p.done}/{p.total}
          </div>
        </div>
        <div style={{ marginTop: 5, font: "400 12.5px/1.45 var(--font-sans)", color: 'var(--ink-muted)' }}>
          {(l.subAlt || {})[hub.id] || l.sub}
        </div>
        <div style={{ marginTop: 12 }}>
          <ProgressBar pct={p.pct} color={barColor} />
        </div>
      </Link>
    );
  };

  const shortcuts = [
    { tag: '01', name: 'All Checklists', href: `/hub/${hub.id}/checklists` },
    { tag: '02', name: 'Morning Welcome', href: `/hub/${hub.id}/welcome` },
    { tag: '03', name: 'Certificates and Points', href: `/hub/${hub.id}/checklists/certs` },
    { tag: '04', name: 'Group Time', href: `/hub/${hub.id}/group-time` },
    { tag: '05', name: 'Closing Speech', href: `/hub/${hub.id}/speech` },
    { tag: '06', name: 'Venue and Contacts', href: `/hub/${hub.id}/info` },
  ];

  return (
    <div>
      <ScreenHeader kicker="Operation hub" title={hub.name} backHref="/hubs" />
      <div style={{ padding: '20px 20px 32px' }}>
        <div style={{ background: 'var(--ink)', borderRadius: 16, padding: '18px 19px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
            <div style={{ font: "500 9.5px/1 var(--font-mono)", letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
              On now &middot; {nowTimeLabel(now)}
            </div>
            <div style={{ font: "500 11.5px/1 var(--font-mono)", color: '#C4B5FD' }}>{homeCount} today</div>
          </div>
          <div style={{ marginTop: 12, font: "400 23px/1.15 var(--font-sans)", letterSpacing: '-.02em' }}>{nowPart}</div>
          <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'rgba(255,255,255,.62)' }}>{nowNote}</div>
          <Link
            href={openHref}
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'var(--accent)',
              borderRadius: 99,
              padding: '10px 16px',
              font: "500 13px/1 var(--font-sans)",
              color: '#fff',
            }}
          >
            Open instructions &rsaquo;
          </Link>
        </div>

        <div style={{ margin: '26px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div className="section-label">Today&rsquo;s checklists</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {DAYS.map((d) => {
              const on = d.id === dayId;
              const p = progress(d.id);
              const complete = p.total > 0 && p.done === p.total;
              return (
                <button
                  key={d.id}
                  onClick={() => setDayId(d.id)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: 8,
                    background: on ? 'var(--accent)' : complete ? '#E7F4EA' : '#fff',
                    border: `1px solid ${on ? 'var(--accent)' : complete ? 'var(--good-border)' : 'var(--border)'}`,
                    font: "500 10px/1 var(--font-mono)",
                    letterSpacing: '.05em',
                    color: on ? '#fff' : complete ? 'var(--good)' : 'rgba(27,26,31,.6)',
                  }}
                >
                  {d.abbr}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listCard(ADMIN)}
          {listCard(day)}
        </div>

        <div className="section-label" style={{ margin: '26px 0 10px' }}>
          Shortcuts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {shortcuts.map((s) => (
            <Link
              key={s.tag}
              href={s.href}
              style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '15px 15px 16px',
                minHeight: 80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div style={{ font: "500 11px/1 var(--font-mono)", color: 'var(--accent)' }}>{s.tag}</div>
              <div style={{ font: "500 14.5px/1.25 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{s.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

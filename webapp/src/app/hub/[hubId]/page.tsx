'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { ADMIN, DAYS } from '@/lib/data/checklists';
import { currentBlock, ampm, nowTimeLabel, nzNow } from '@/lib/logic';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';
import ProgressBar from '@/components/ProgressBar';
import { Clock, ClipboardCheck, Check, ListChecks, Sparkles, Trophy, Users, Mic2, MapPin, type LucideIcon } from 'lucide-react';

export default function HubHomePage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { dayId, setDayId, progress } = useHubData();
  const [now, setNow] = useState(() => nzNow());

  useEffect(() => {
    const id = setInterval(() => setNow(nzNow()), 30000);
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
        style={{ background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', padding: '16px 17px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 34,
              height: 34,
              flex: 'none',
              borderRadius: 12,
              background: 'var(--accent-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ClipboardCheck size={17} strokeWidth={2.2} color="var(--accent)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 15.5px/1.25 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{l.name}</div>
            <div style={{ marginTop: 2, font: "400 12.5px/1.45 var(--font-sans)", color: 'var(--ink-muted)' }}>
              {(l.subAlt || {})[hub.id] || l.sub}
            </div>
          </div>
          <div style={{ font: "700 13px/1 var(--font-sans)", color: barColor }}>
            {p.done}/{p.total}
          </div>
        </div>
        <div style={{ marginTop: 13 }}>
          <ProgressBar pct={p.pct} color={barColor} />
        </div>
      </Link>
    );
  };

  const shortcuts: { name: string; href: string; Icon: LucideIcon }[] = [
    { name: 'All Checklists', href: `/hub/${hub.id}/checklists`, Icon: ListChecks },
    { name: 'Morning Welcome', href: `/hub/${hub.id}/welcome`, Icon: Sparkles },
    { name: 'Certificates and Points', href: `/hub/${hub.id}/checklists/certs`, Icon: Trophy },
    { name: 'Group Time', href: `/hub/${hub.id}/group-time`, Icon: Users },
    { name: 'Closing Speech', href: `/hub/${hub.id}/speech`, Icon: Mic2 },
    { name: 'Venue and Contacts', href: `/hub/${hub.id}/info`, Icon: MapPin },
  ];

  return (
    <div>
      <ScreenHeader kicker="Operation hub" title={hub.name} backHref="/hubs" />
      <div style={{ padding: '4px 20px 32px' }}>
        <div style={{ background: 'var(--ink)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', padding: '19px 20px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: "700 10px/1 var(--font-sans)", letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
              <Clock size={13} strokeWidth={2.4} />
              On now &middot; {nowTimeLabel(now)}
            </div>
            <div style={{ font: "700 11.5px/1 var(--font-sans)", color: '#C4B5FD' }}>{homeCount} today</div>
          </div>
          <div style={{ marginTop: 13, font: "700 23px/1.15 var(--font-sans)", letterSpacing: '-.02em' }}>{nowPart}</div>
          <div style={{ marginTop: 8, font: "400 13.5px/1.5 var(--font-sans)", color: 'rgba(255,255,255,.62)' }}>{nowNote}</div>
          <Link
            href={openHref}
            style={{
              marginTop: 16,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'var(--accent)',
              borderRadius: 999,
              padding: '10px 17px',
              font: "600 13px/1 var(--font-sans)",
              color: '#fff',
            }}
          >
            Open instructions &rsaquo;
          </Link>
        </div>

        <div style={{ margin: '26px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ font: "700 13px/1.3 var(--font-sans)", letterSpacing: '-.01em', color: 'var(--ink)' }}>Today&rsquo;s checklists</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DAYS.map((d) => {
              const on = d.id === dayId;
              const p = progress(d.id);
              const complete = p.total > 0 && p.done === p.total;
              return (
                <button
                  key={d.id}
                  onClick={() => setDayId(d.id)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: on ? 'var(--accent)' : complete ? 'var(--good-bg)' : '#fff',
                    boxShadow: on ? 'var(--shadow-soft)' : 'none',
                    border: `1px solid ${on ? 'var(--accent)' : complete ? 'var(--good-border)' : 'var(--border)'}`,
                    font: "700 10.5px/1 var(--font-sans)",
                    color: on ? '#fff' : complete ? 'var(--good)' : 'rgba(27,26,31,.6)',
                  }}
                >
                  {complete && !on ? <Check size={14} strokeWidth={3} /> : d.abbr}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listCard(ADMIN)}
          {listCard(day)}
        </div>

        <div style={{ margin: '26px 0 10px', font: "700 13px/1.3 var(--font-sans)", letterSpacing: '-.01em', color: 'var(--ink)' }}>
          Shortcuts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {shortcuts.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-card)',
                padding: '15px 15px 16px',
                minHeight: 86,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: 'var(--accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <s.Icon size={15} strokeWidth={2.2} color="var(--accent)" />
              </div>
              <div style={{ font: "600 14.5px/1.25 var(--font-sans)", letterSpacing: '-.015em', color: 'var(--ink)' }}>{s.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

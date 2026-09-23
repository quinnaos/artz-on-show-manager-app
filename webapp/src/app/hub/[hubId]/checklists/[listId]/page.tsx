'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { listById } from '@/lib/data/checklists';
import { showsAt } from '@/lib/logic';
import { useHubData } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';
import ProgressBar from '@/components/ProgressBar';
import BriefCard from '@/components/BriefCard';
import ChecklistItemRow from '@/components/ChecklistItemRow';

export default function SingleChecklistPage() {
  const { hubId, listId } = useParams<{ hubId: string; listId: string }>();
  const hub = hubById(hubId);
  const l = listById(listId);
  const { progress, tickedAt, toggleTick, signedOff, signOff, scopeForList, profile } = useHubData();

  const p = progress(l.id);
  const blurb = (l.blurbAlt || {})[hub.id] || l.blurb;
  const alt = (l.briefAlt || {})[hub.id] || {};
  const briefLead = alt.lead || l.briefLead || '';
  const briefFull = alt.brief || l.brief || '';

  const scope = scopeForList(l.id);
  const sentRow = signedOff(scope);
  const complete = p.total > 0 && p.done === p.total;

  let submitLabel: string;
  let submitBg: string;
  let submitFg: string;
  if (sentRow) {
    submitLabel = 'Sent to head office ✓';
    submitBg = 'var(--good-bg)';
    submitFg = 'var(--good)';
  } else if (complete) {
    submitLabel = 'Sign off and send to head office';
    submitBg = 'var(--accent)';
    submitFg = '#fff';
  } else {
    submitLabel = `Sign off (${p.total - p.done} remaining)`;
    submitBg = '#EDEAE4';
    submitFg = 'rgba(27,26,31,.4)';
  }
  const submitNote = sentRow
    ? `Signed off by ${profile.name || profile.email.split('@')[0]}. Reopen any item to amend.`
    : 'Head office sees your progress live either way.';

  // Item indexes are global across the whole checklist (stable across hubs),
  // not local to each section, so ticks stay pinned to the right item.
  type VisibleSection = { name: string; items: { item: (typeof l.sections)[number]['items'][number]; index: number }[] };
  const { sections } = l.sections.reduce<{ cursor: number; sections: VisibleSection[] }>(
    (acc, sec) => {
      const visible = sec.items.map((item, i) => ({ item, index: acc.cursor + i })).filter(({ item }) => showsAt(item, hub.id));
      return { cursor: acc.cursor + sec.items.length, sections: [...acc.sections, { name: sec.name, items: visible }] };
    },
    { cursor: 0, sections: [] }
  );

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title={l.name} backHref={`/hub/${hub.id}`} />
      <div>
        <div style={{ padding: '15px 20px 17px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <div style={{ flex: 1, font: "400 13.5px/1.45 var(--font-sans)", color: 'var(--ink-muted)' }}>{blurb}</div>
            <div style={{ font: "500 13px/1 var(--font-mono)", color: 'var(--accent)' }}>
              {p.done} of {p.total}
            </div>
          </div>
          <div style={{ marginTop: 13 }}>
            <ProgressBar pct={p.pct} height={6} />
          </div>
        </div>

        {(briefLead || briefFull) && <BriefCard lead={briefLead} full={briefFull} />}

        {sections.map(
          (sec) =>
            sec.items.length > 0 && (
              <div key={sec.name} style={{ padding: '22px 20px 0' }}>
                <div className="section-label">{sec.name}</div>
                <div style={{ marginTop: 11, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sec.items.map(({ item, index }) => (
                    <ChecklistItemRow key={index} item={item} tickedAt={tickedAt(l.id, index)} onTick={() => toggleTick(l.id, index)} />
                  ))}
                </div>
              </div>
            )
        )}

        <div style={{ padding: '26px 20px 0' }}>
          <button
            onClick={() => complete && !sentRow && signOff(l.id)}
            style={{ width: '100%', background: submitBg, borderRadius: 13, padding: 16, textAlign: 'center', font: "500 14.5px/1 var(--font-sans)", color: submitFg }}
          >
            {submitLabel}
          </button>
          <div style={{ marginTop: 10, textAlign: 'center', font: "400 12px/1.5 var(--font-sans)", color: 'var(--ink-faint)' }}>{submitNote}</div>
          <Link
            href={`/hub/${hub.id}`}
            style={{
              display: 'block',
              marginTop: 14,
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
    </div>
  );
}

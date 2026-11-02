'use client';

import { useParams } from 'next/navigation';
import { hubById } from '@/lib/data/hubs';
import { SPEECH } from '@/lib/data/speech';
import { useHubData, type Tutor } from '@/lib/hubData';
import ScreenHeader from '@/components/ScreenHeader';
import BackLink from '@/components/BackLink';
import { Plus, X } from 'lucide-react';

const fieldStyle = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: 'var(--radius-sm)',
  border: 'none',
  background: '#fff',
  boxShadow: 'var(--shadow-card)',
  font: "400 14px/1 var(--font-sans)",
};

export default function ClosingSpeechPage() {
  const { hubId } = useParams<{ hubId: string }>();
  const hub = hubById(hubId);
  const { speechDetails, updateSpeechDetails } = useHubData();
  const { theme, dates, tutors } = speechDetails;

  const updateTutor = (idx: number, patch: Partial<Tutor>) => {
    updateSpeechDetails({ tutors: tutors.map((t, i) => (i === idx ? { ...t, ...patch } : t)) });
  };
  const addTutor = () => updateSpeechDetails({ tutors: [...tutors, { name: '', discipline: '' }] });
  const removeTutor = (idx: number) => updateSpeechDetails({ tutors: tutors.filter((_, i) => i !== idx) });

  return (
    <div>
      <ScreenHeader kicker={`${hub.name} hub`} title="Closing Speech" backHref={`/hub/${hub.id}`} />
      <div style={{ padding: '4px 20px 32px' }}>
        <div style={{ font: "400 13.5px/1.55 var(--font-sans)", color: 'var(--ink-muted)' }}>
          Delivered by the Manager at the end of the show on Day 5.
        </div>
        <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', font: "400 12.5px/1.55 var(--font-sans)", color: '#3F2A6B' }}>
          Fill in the details below and they&rsquo;ll drop straight into the speech text in place of the{' '}
          <span style={{ color: '#6D28D9', fontStyle: 'italic' }}>[square bracket]</span> placeholders.
        </div>

        <div className="section-label" style={{ marginTop: 22 }}>
          Next Workshop
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={theme}
            onChange={(e) => updateSpeechDetails({ theme: e.target.value })}
            placeholder="Theme, e.g. The Lighthouse Clock"
            style={fieldStyle}
          />
          <input
            value={dates}
            onChange={(e) => updateSpeechDetails({ dates: e.target.value })}
            placeholder="Dates, e.g. 12-16 January 2027"
            style={fieldStyle}
          />
        </div>

        <div className="section-label" style={{ marginTop: 22 }}>
          Tutors
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tutors.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={t.name}
                onChange={(e) => updateTutor(i, { name: e.target.value })}
                placeholder="Tutor name"
                style={{ ...fieldStyle, flex: '1 1 50%' }}
              />
              <input
                value={t.discipline}
                onChange={(e) => updateTutor(i, { discipline: e.target.value })}
                placeholder="Discipline, e.g. Dance"
                style={{ ...fieldStyle, flex: '1 1 50%' }}
              />
              <button
                onClick={() => removeTutor(i)}
                aria-label="Remove tutor"
                style={{ flex: 'none', width: 36, height: 36, borderRadius: '50%', background: '#fff', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-faint)' }}
              >
                <X size={16} strokeWidth={2.4} />
              </button>
            </div>
          ))}
          <button
            onClick={addTutor}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', padding: '8px 14px', borderRadius: 999, background: 'var(--accent-light)', font: "500 12.5px/1 var(--font-sans)", color: '#5B21B6' }}
          >
            <Plus size={14} strokeWidth={2.6} />
            Add tutor
          </button>
        </div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SPEECH.map((p, i) => {
            if (p.slot === 'tutors' && tutors.length > 0) {
              return (
                <div key={i}>
                  <div style={{ fontSize: 15, lineHeight: 1.75, fontFamily: 'var(--font-sans)', color: 'var(--ink)' }}>
                    {tutors.map((t, k) => (
                      <div key={k}>
                        {t.name || '[Tutor name]'} teaching {t.discipline || '[discipline]'}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const parts = p.t.split(/(\[[^\]]*\])/).filter((x) => x !== '');
            return (
              <div key={i} style={{ background: p.cue ? 'var(--accent-light)' : 'transparent', padding: p.cue ? '13px 15px' : 0, borderRadius: p.cue ? 'var(--radius-md)' : 0 }}>
                <div style={{ fontSize: 15, lineHeight: 1.75, fontFamily: 'var(--font-sans)', whiteSpace: 'pre-line' }}>
                  {parts.map((part, j) => {
                    if (part === '[theme]' && theme) {
                      return (
                        <span key={j} style={{ fontWeight: p.cue ? 500 : 400, color: p.cue ? '#4C1D95' : 'var(--ink)' }}>
                          {theme}
                        </span>
                      );
                    }
                    if (part === '[dates]' && dates) {
                      return (
                        <span key={j} style={{ fontWeight: p.cue ? 500 : 400, color: p.cue ? '#4C1D95' : 'var(--ink)' }}>
                          {dates}
                        </span>
                      );
                    }
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
        <BackLink href={`/hub/${hub.id}`}>&lsaquo; Back to hub home</BackLink>
      </div>
    </div>
  );
}

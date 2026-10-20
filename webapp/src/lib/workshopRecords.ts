import { createClient } from '@/lib/supabase/server';
import { hubById } from '@/lib/data/hubs';
import { listById, allItems, DAYS } from '@/lib/data/checklists';
import { GROUPS } from '@/lib/data/groups';
import { parseScope } from '@/lib/logic';
import type { ColorGroup, Hub } from '@/lib/types';

export type RecordRow = { index: number; text: string; by: string; time: string };
export type RecordSection = { key: string; title: string; rows: RecordRow[] };
export type SignOffRecord = { key: string; title: string; by: string; time: string };

export type WorkshopRecords = {
  hub: Hub;
  label: string | null;
  start: Date;
  end: Date;
  checklists: RecordSection[];
  points: { group: ColorGroup; total: number }[];
  hasAwards: boolean;
  signOffs: SignOffRecord[];
};

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(iso: string) {
  return new Date(iso)
    .toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, ' ');
}

// 'YYYY-MM-DD' of an instant, in NZ time.
function nzDateKey(iso: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

function addDays(dateKey: string, n: number) {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const DAY_ORDER = DAYS.map((d) => d.id);
const LIST_ORDER = (listId: string) => (listId === 'admin' ? 1 : listId === 'certs' ? 2 : 0);

// Display title + sort key for a stored scope. Daily Admin and Certificates
// repeat every day, so they're split out per day rather than merged into one.
function describeScope(scope: string) {
  const { listId, dayId } = parseScope(scope);
  const list = listById(listId);
  const daily = listId === 'admin' || listId === 'certs';
  const dayName = DAYS.find((d) => d.id === dayId)?.name ?? dayId;
  const key = scope.split('#')[0];
  return {
    key,
    listId,
    title: daily ? `${list.name} — ${dayName}` : list.name,
    sort: DAY_ORDER.indexOf(dayId) * 10 + LIST_ORDER(listId),
  };
}

// Everything recorded for one workshop, shared by the history page and its
// PDF download so both always show the same thing.
//
// Ticks/sign-offs are normally tagged with workshop_id, but only if the
// workshop already existed and covered "today" when they were made. Anything
// recorded at the same hub during the workshop's dates without a tag (e.g.
// the workshop was added to admin after the fact) is folded in too, so the
// export isn't missing tasks.
export async function loadWorkshopRecords(workshopId: number): Promise<WorkshopRecords | null> {
  const supabase = await createClient();
  const { data: workshop } = await supabase.from('workshops').select('hub_id, start_date, label').eq('id', workshopId).maybeSingle();
  if (!workshop) return null;

  const startKey: string = workshop.start_date;
  const endKey = addDays(startKey, 4);
  // Widened by a day either side for the NZ/UTC offset; trimmed exactly below.
  const fromIso = `${addDays(startKey, -1)}T00:00:00Z`;
  const toIso = `${addDays(endKey, 2)}T00:00:00Z`;
  const inRange = (iso: string) => {
    const k = nzDateKey(iso);
    return k >= startKey && k <= endKey;
  };

  const [tagged, untagged, { data: awards }, taggedSigns, untaggedSigns] = await Promise.all([
    supabase.from('ticks').select('scope, item_index, ticked_at, ticked_by').eq('workshop_id', workshopId),
    supabase
      .from('ticks')
      .select('scope, item_index, ticked_at, ticked_by')
      .eq('hub_id', workshop.hub_id)
      .is('workshop_id', null)
      .gte('ticked_at', fromIso)
      .lt('ticked_at', toIso),
    supabase.from('points_awards').select('group_id, delta, awarded_by').eq('workshop_id', workshopId).order('created_at'),
    supabase.from('sign_offs').select('scope, signed_by, signed_at').eq('workshop_id', workshopId),
    supabase
      .from('sign_offs')
      .select('scope, signed_by, signed_at')
      .eq('hub_id', workshop.hub_id)
      .is('workshop_id', null)
      .gte('signed_at', fromIso)
      .lt('signed_at', toIso),
  ]);
  for (const r of [tagged, untagged, taggedSigns, untaggedSigns]) {
    if (r.error) throw new Error(r.error.message);
  }

  const ticks = [...(tagged.data ?? []), ...(untagged.data ?? []).filter((t) => inRange(t.ticked_at))];
  const signs = [...(taggedSigns.data ?? []), ...(untaggedSigns.data ?? []).filter((s) => inRange(s.signed_at))];

  const peopleIds = Array.from(
    new Set(
      [...ticks.map((t) => t.ticked_by), ...(awards ?? []).map((a) => a.awarded_by), ...signs.map((s) => s.signed_by)].filter(
        (v): v is string => !!v
      )
    )
  );
  const { data: people } =
    peopleIds.length > 0 ? await supabase.from('profiles').select('id, name, email').in('id', peopleIds) : { data: [] };
  const nameFor = (id: string | null) => {
    if (!id) return 'Unknown';
    const p = (people ?? []).find((p) => p.id === id);
    return p ? p.name || p.email.split('@')[0] : 'Unknown';
  };

  // One row per task, keeping its latest (final) tick time.
  const latest = new Map<string, { scope: string; item_index: number; ticked_at: string; ticked_by: string | null }>();
  ticks.forEach((t) => {
    const k = `${t.scope.split('#')[0]}|${t.item_index}`;
    const prev = latest.get(k);
    if (!prev || prev.ticked_at < t.ticked_at) latest.set(k, t);
  });

  const sections = new Map<string, RecordSection & { sort: number }>();
  latest.forEach((t) => {
    const s = describeScope(t.scope);
    const item = allItems(listById(s.listId))[t.item_index];
    if (!item) return;
    const section = sections.get(s.key) ?? { key: s.key, title: s.title, sort: s.sort, rows: [] };
    section.rows.push({ index: t.item_index, text: item.t, by: nameFor(t.ticked_by), time: formatTime(t.ticked_at) });
    sections.set(s.key, section);
  });
  const checklists = Array.from(sections.values())
    .sort((a, b) => a.sort - b.sort)
    .map(({ key, title, rows }) => ({ key, title, rows: rows.sort((a, b) => a.index - b.index) }));

  const latestSign = new Map<string, (typeof signs)[number]>();
  signs.forEach((s) => {
    const k = s.scope.split('#')[0];
    const prev = latestSign.get(k);
    if (!prev || prev.signed_at < s.signed_at) latestSign.set(k, s);
  });
  const signOffs = Array.from(latestSign.values())
    .map((s) => ({ ...describeScope(s.scope), by: nameFor(s.signed_by), time: formatTime(s.signed_at) }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ key, title, by, time }) => ({ key, title, by, time }));

  const hub = hubById(workshop.hub_id);
  const groups = GROUPS[hub.id] ?? [];
  const start = new Date(`${startKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  return {
    hub,
    label: workshop.label,
    start,
    end,
    checklists,
    points: groups.map((g) => ({
      group: g,
      total: (awards ?? []).filter((a) => a.group_id === g.id).reduce((sum, a) => sum + a.delta, 0),
    })),
    hasAwards: (awards ?? []).length > 0,
    signOffs,
  };
}

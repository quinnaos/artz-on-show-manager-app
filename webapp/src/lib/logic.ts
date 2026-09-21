import type { ChecklistDef, ChecklistItem, ScheduleBlock } from '@/lib/types';
import { allItems } from '@/lib/data/checklists';
import { SCHEDULES } from '@/lib/data/schedules';

// Some checklist items only apply at certain locations. Indices stay stable
// across hubs so a tick recorded at one hub never lands on a different item
// at another hub.
export function showsAt(it: { hubs?: string[]; notHubs?: string[] }, hubId: string): boolean {
  if (it.hubs) return it.hubs.includes(hubId);
  if (it.notHubs) return !it.notHubs.includes(hubId);
  return true;
}

export function visibleIndexes(l: ChecklistDef, hubId: string): number[] {
  const out: number[] = [];
  allItems(l).forEach((it, i) => {
    if (showsAt(it, hubId)) out.push(i);
  });
  return out;
}

// Daily Admin and Certificates & Points run every day, so their ticks (and
// sign-off) are scoped per day too. The five day checklists are each already
// a specific day, so they don't need the extra scoping.
//
// A hub can run the same workshop occasion (Day 3, say) many times a year,
// so while a workshop is live, its id is folded into the scope too - that's
// what makes each occurrence's ticks independent of every other occurrence's,
// rather than the checklist permanently showing whatever was last ticked at
// that hub. Outside any workshop window, workshopId is omitted and behaves
// exactly as before (a single shared, un-scoped bucket).
export function scopeFor(listId: string, dayId: string, workshopId?: number | null): string {
  const daily = listId === 'admin' || listId === 'certs';
  const base = daily ? `${listId}@${dayId}` : listId;
  return workshopId != null ? `${base}#${workshopId}` : base;
}

// Inverse of scopeFor - used by the history viewer to work out which
// checklist and day a stored scope string belongs to.
export function parseScope(scope: string): { listId: string; dayId: string } {
  const [base] = scope.split('#');
  if (base.includes('@')) {
    const [listId, dayId] = base.split('@');
    return { listId, dayId };
  }
  return { listId: base, dayId: base };
}

export type TickMap = Record<string, string>; // `${hubId}|${scope}|${index}` -> ISO time

export function tickKey(hubId: string, listId: string, dayId: string, i: number, workshopId?: number | null): string {
  return `${hubId}|${scopeFor(listId, dayId, workshopId)}|${i}`;
}

export function progressOf(
  l: ChecklistDef,
  hubId: string,
  dayId: string,
  ticks: TickMap,
  workshopId?: number | null
): { done: number; total: number; pct: number } {
  const idx = visibleIndexes(l, hubId);
  const total = idx.length;
  let done = 0;
  idx.forEach((i) => {
    if (ticks[tickKey(hubId, l.id, dayId, i, workshopId)]) done++;
  });
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

// "08:50" -> "8.50am", "16:00" -> "4pm"
export function ampm(t: string): string {
  const h24 = +t.slice(0, 2);
  const m = t.slice(3);
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const suffix = h24 < 12 ? 'am' : 'pm';
  return h + (m === '00' ? '' : '.' + m) + suffix;
}

export function nowTimeLabel(d: Date): string {
  return d
    .toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(/\s/g, '')
    .toLowerCase();
}

export function scheduleFor(hubId: string, dayId: string): ScheduleBlock[] | null {
  const key = `${hubId === 'epsom' ? 'epsom' : 'other'}:${dayId === 'fri' ? 'fri' : 'standard'}`;
  return SCHEDULES[key] ?? null;
}

export function currentBlock(
  hubId: string,
  dayId: string,
  now: Date
): { cur: ScheduleBlock | null; next: ScheduleBlock | null } {
  const sched = scheduleFor(hubId, dayId);
  if (!sched) return { cur: null, next: null };
  const mins = now.getHours() * 60 + now.getMinutes();
  const isDay1 = dayId === 'mon';
  const blocks = sched.filter((b) => (b.day1 ? isDay1 : !(b.t === '08:15' && isDay1)));
  const toM = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3);
  let cur: ScheduleBlock | null = null;
  let next: ScheduleBlock | null = null;
  blocks.forEach((b) => {
    if (toM(b.t) <= mins) cur = b;
    else if (!next) next = b;
  });
  return { cur, next };
}

export function itemsWithVisibility(l: ChecklistDef, hubId: string): { item: ChecklistItem; index: number }[] {
  return allItems(l)
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => showsAt(item, hubId));
}

const WORKDAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri'];

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Given a workshop's Day 1 date, returns which D1-D5 id "today" falls on,
// or null if today is outside that workshop's Monday-Friday week.
export function dayIdForWorkshop(startDateISO: string, today: Date): string | null {
  const start = dateOnly(new Date(startDateISO + 'T00:00:00'));
  const diffDays = Math.round((dateOnly(today).getTime() - start.getTime()) / 86400000);
  if (diffDays < 0 || diffDays > 4) return null;
  return WORKDAY_IDS[diffDays];
}

// Finds whichever workshop (if any) covers today for this hub. Regions run
// independent weeks, so a hub can have several workshops across a year, but
// at most one should ever cover a given date.
export function activeWorkshop<T extends { start_date: string }>(workshops: T[], today: Date): T | null {
  for (const w of workshops) {
    if (dayIdForWorkshop(w.start_date, today)) return w;
  }
  return null;
}

export function activeWorkshopDay(workshops: { start_date: string }[], today: Date): string | null {
  const w = activeWorkshop(workshops, today);
  return w ? dayIdForWorkshop(w.start_date, today) : null;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

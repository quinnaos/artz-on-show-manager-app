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
export function scopeFor(listId: string, dayId: string): string {
  const daily = listId === 'admin' || listId === 'certs';
  return daily ? `${listId}@${dayId}` : listId;
}

export type TickMap = Record<string, string>; // `${hubId}|${scope}|${index}` -> ISO time

export function tickKey(hubId: string, listId: string, dayId: string, i: number): string {
  return `${hubId}|${scopeFor(listId, dayId)}|${i}`;
}

export function progressOf(
  l: ChecklistDef,
  hubId: string,
  dayId: string,
  ticks: TickMap
): { done: number; total: number; pct: number } {
  const idx = visibleIndexes(l, hubId);
  const total = idx.length;
  let done = 0;
  idx.forEach((i) => {
    if (ticks[tickKey(hubId, l.id, dayId, i)]) done++;
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

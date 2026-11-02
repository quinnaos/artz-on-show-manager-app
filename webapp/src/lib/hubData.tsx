'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { scopeFor, visibleIndexes, activeWorkshop, dayIdForWorkshop, dateKey, nzNow } from '@/lib/logic';
import { listById } from '@/lib/data/checklists';
import { groupsFromIds, DEFAULT_GROUP_IDS } from '@/lib/data/groups';
import type { Profile, ColorGroup } from '@/lib/types';

type TickRow = { hub_id: string; scope: string; item_index: number; ticked_at: string; ticked_by: string | null; workshop_id: number | null };
type AwardRow = {
  id: number;
  hub_id: string;
  day_id: string;
  group_id: string;
  delta: number;
  awarded_by: string | null;
  created_at: string;
  workshop_id: number | null;
};
type SignOffRow = { hub_id: string; scope: string; signed_by: string | null; signed_at: string; workshop_id: number | null };
type WorkshopRow = { id: number; hub_id: string; start_date: string; label: string | null };
export type Tutor = { name: string; discipline: string };
type SpeechDetailsRow = { id: number; hub_id: string; workshop_id: number | null; theme: string; dates: string; tutors: Tutor[] };
type HubGroupsRow = { id: number; hub_id: string; workshop_id: number | null; group_ids: string[] };

const DAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri'];

type HubDataValue = {
  hubId: string;
  profile: Profile;
  dayId: string;
  setDayId: (d: string) => void;
  loading: boolean;
  tickedAt: (listId: string, i: number) => string | null;
  toggleTick: (listId: string, i: number) => void;
  progress: (listId: string) => { done: number; total: number; pct: number };
  pointsTotal: (dayId: string, groupId: string) => number;
  award: (groupId: string, delta: number) => void;
  canUndo: boolean;
  lastAwardLabel: string | null;
  undoLastAward: () => void;
  resetPoints: () => void;
  signedOff: (scope: string) => SignOffRow | null;
  signOff: (listId: string) => void;
  scopeForList: (listId: string) => string;
  speechDetails: { theme: string; dates: string; tutors: Tutor[] };
  updateSpeechDetails: (patch: Partial<{ theme: string; dates: string; tutors: Tutor[] }>) => void;
  groups: ColorGroup[];
  groupIds: string[];
  updateGroupIds: (ids: string[]) => void;
};

const HubDataContext = createContext<HubDataValue | null>(null);

export function useHubData() {
  const ctx = useContext(HubDataContext);
  if (!ctx) throw new Error('useHubData must be used within HubDataProvider');
  return ctx;
}

function dayStorageKey(hubId: string) {
  return `aos:${hubId}:dayId`;
}

export function HubDataProvider({
  hubId,
  profile,
  children,
}: {
  hubId: string;
  profile: Profile;
  children: React.ReactNode;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [ticks, setTicks] = useState<Map<string, TickRow>>(new Map());
  const [awards, setAwards] = useState<AwardRow[]>([]);
  const [signOffs, setSignOffs] = useState<Map<string, SignOffRow>>(new Map());
  const [lastAward, setLastAward] = useState<AwardRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayId, setDayIdState] = useState('mon');
  const [workshops, setWorkshops] = useState<WorkshopRow[]>([]);
  const [speechDetailsRows, setSpeechDetailsRows] = useState<SpeechDetailsRow[]>([]);
  const speechSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hubGroupsRows, setHubGroupsRows] = useState<HubGroupsRow[]>([]);
  const groupsSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // While a workshop is genuinely running today, every tick/award/sign-off
  // made during the session belongs to that one occurrence - regardless of
  // which D1-D5 day is currently being viewed - so a hub that runs the same
  // "Day 3" many times a year gets independent records each time instead of
  // one that's permanently reused. Outside any workshop window this is null,
  // which keeps the old shared, un-scoped behaviour for manual/off-season use.
  const activeWorkshopId = useMemo(() => activeWorkshop(workshops, nzNow())?.id ?? null, [workshops]);

  useEffect(() => {
    // Reads a per-viewer UI preference (which day's checklist is showing)
    // out of localStorage. Deliberately done post-mount, not via a lazy
    // useState initializer, so server and first client render both produce
    // 'mon' and hydration never mismatches.
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(dayStorageKey(hubId)) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDayIdState(stored && DAY_IDS.includes(stored) ? stored : 'mon');
  }, [hubId]);

  const setDayId = useCallback(
    (d: string) => {
      setDayIdState(d);
      if (typeof window !== 'undefined') window.localStorage.setItem(dayStorageKey(hubId), d);
    },
    [hubId]
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [t, a, s, w, sd, hg] = await Promise.all([
        supabase.from('ticks').select('hub_id, scope, item_index, ticked_at, ticked_by, workshop_id').eq('hub_id', hubId),
        supabase.from('points_awards').select('id, hub_id, day_id, group_id, delta, awarded_by, created_at, workshop_id').eq('hub_id', hubId),
        supabase.from('sign_offs').select('hub_id, scope, signed_by, signed_at, workshop_id').eq('hub_id', hubId),
        supabase.from('workshops').select('id, hub_id, start_date, label').eq('hub_id', hubId),
        supabase.from('speech_details').select('id, hub_id, workshop_id, theme, dates, tutors').eq('hub_id', hubId),
        supabase.from('hub_groups').select('id, hub_id, workshop_id, group_ids').eq('hub_id', hubId),
      ]);
      if (cancelled) return;
      const tm = new Map<string, TickRow>();
      (t.data ?? []).forEach((r: TickRow) => tm.set(`${r.scope}|${r.item_index}`, r));
      setTicks(tm);
      setAwards((a.data ?? []) as AwardRow[]);
      const sm = new Map<string, SignOffRow>();
      (s.data ?? []).forEach((r: SignOffRow) => sm.set(r.scope, r));
      setSignOffs(sm);
      setSpeechDetailsRows(
        (sd.data ?? []).map((r) => ({ ...r, theme: r.theme ?? '', dates: r.dates ?? '', tutors: (r.tutors ?? []) as Tutor[] })) as SpeechDetailsRow[]
      );
      setHubGroupsRows((hg.data ?? []) as HubGroupsRow[]);

      const workshopRows = (w.data ?? []) as WorkshopRow[];
      setWorkshops(workshopRows);

      // Once per calendar day, auto-advance to whichever D1-D5 day today
      // falls on for this hub's current workshop (if any is running). A
      // manual pill tap later the same day is left alone until tomorrow.
      if (typeof window !== 'undefined') {
        const now = nzNow();
        const todayKey = dateKey(now);
        const syncKey = `aos:${hubId}:syncedDate`;
        if (window.localStorage.getItem(syncKey) !== todayKey) {
          const current = activeWorkshop(workshopRows, now);
          const autoDay = current ? dayIdForWorkshop(current.start_date, now) : null;
          if (autoDay) {
            setDayIdState(autoDay);
            window.localStorage.setItem(dayStorageKey(hubId), autoDay);
          }
          window.localStorage.setItem(syncKey, todayKey);
        }
      }

      setLoading(false);
    }
    load();

    const channel = supabase
      .channel(`hub-${hubId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticks', filter: `hub_id=eq.${hubId}` }, (payload) => {
        setTicks((prev) => {
          const next = new Map(prev);
          if (payload.eventType === 'DELETE') {
            const old = payload.old as TickRow;
            next.delete(`${old.scope}|${old.item_index}`);
          } else {
            const row = payload.new as TickRow;
            next.set(`${row.scope}|${row.item_index}`, row);
          }
          return next;
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'points_awards', filter: `hub_id=eq.${hubId}` }, (payload) => {
        setAwards((prev) => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as AwardRow;
            return prev.filter((r) => r.id !== old.id);
          }
          const row = payload.new as AwardRow;
          if (prev.some((r) => r.id === row.id)) return prev;
          return [...prev, row];
        });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sign_offs', filter: `hub_id=eq.${hubId}` }, (payload) => {
        setSignOffs((prev) => {
          const next = new Map(prev);
          if (payload.eventType === 'DELETE') {
            const old = payload.old as SignOffRow;
            next.delete(old.scope);
          } else {
            const row = payload.new as SignOffRow;
            next.set(row.scope, row);
          }
          return next;
        });
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hubId]);

  const scopeForList = useCallback((listId: string) => scopeFor(listId, dayId, activeWorkshopId), [dayId, activeWorkshopId]);

  const tickedAt = useCallback(
    (listId: string, i: number) => {
      const row = ticks.get(`${scopeForList(listId)}|${i}`);
      return row ? row.ticked_at : null;
    },
    [ticks, scopeForList]
  );

  const toggleTick = useCallback(
    (listId: string, i: number) => {
      const scope = scopeForList(listId);
      const key = `${scope}|${i}`;
      const existing = ticks.get(key);
      if (existing) {
        setTicks((prev) => {
          const next = new Map(prev);
          next.delete(key);
          return next;
        });
        supabase.from('ticks').delete().eq('hub_id', hubId).eq('scope', scope).eq('item_index', i).then();
      } else {
        const row: TickRow = {
          hub_id: hubId,
          scope,
          item_index: i,
          ticked_at: new Date().toISOString(),
          ticked_by: profile.id,
          workshop_id: activeWorkshopId,
        };
        setTicks((prev) => {
          const next = new Map(prev);
          next.set(key, row);
          return next;
        });
        supabase.from('ticks').upsert(row).then();
      }
    },
    [ticks, scopeForList, hubId, profile.id, activeWorkshopId, supabase]
  );

  const progress = useCallback(
    (listId: string) => {
      const l = listById(listId);
      const idx = visibleIndexes(l, hubId);
      const total = idx.length;
      let done = 0;
      const scope = scopeForList(listId);
      idx.forEach((i) => {
        if (ticks.has(`${scope}|${i}`)) done++;
      });
      return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    },
    [ticks, scopeForList, hubId]
  );

  const pointsTotal = useCallback(
    (d: string, groupId: string) =>
      awards
        .filter((a) => a.day_id === d && a.group_id === groupId && a.workshop_id === activeWorkshopId)
        .reduce((sum, a) => sum + a.delta, 0),
    [awards, activeWorkshopId]
  );

  const award = useCallback(
    (groupId: string, delta: number) => {
      const optimisticId = -Date.now();
      const row: AwardRow = {
        id: optimisticId,
        hub_id: hubId,
        day_id: dayId,
        group_id: groupId,
        delta,
        awarded_by: profile.id,
        created_at: new Date().toISOString(),
        workshop_id: activeWorkshopId,
      };
      setAwards((prev) => [...prev, row]);
      setLastAward(row);
      supabase
        .from('points_awards')
        .insert({ hub_id: hubId, day_id: dayId, group_id: groupId, delta, awarded_by: profile.id, workshop_id: activeWorkshopId })
        .select()
        .single()
        .then(({ data }) => {
          if (data) {
            setAwards((prev) => prev.map((a) => (a.id === optimisticId ? (data as AwardRow) : a)));
            setLastAward((prev) => (prev?.id === optimisticId ? (data as AwardRow) : prev));
          }
        });
    },
    [hubId, dayId, profile.id, activeWorkshopId, supabase]
  );

  const undoLastAward = useCallback(() => {
    if (!lastAward) return;
    const id = lastAward.id;
    setAwards((prev) => prev.filter((a) => a.id !== id));
    setLastAward(null);
    if (id > 0) supabase.from('points_awards').delete().eq('id', id).then();
  }, [lastAward, supabase]);

  // Clears every group's total for the day/workshop currently being viewed.
  // Only that scope is touched - other days and other workshops keep their
  // own totals untouched.
  const resetPoints = useCallback(() => {
    setAwards((prev) => prev.filter((a) => !(a.day_id === dayId && a.workshop_id === activeWorkshopId)));
    setLastAward((prev) => (prev && prev.day_id === dayId && prev.workshop_id === activeWorkshopId ? null : prev));
    let query = supabase.from('points_awards').delete().eq('hub_id', hubId).eq('day_id', dayId);
    query = activeWorkshopId == null ? query.is('workshop_id', null) : query.eq('workshop_id', activeWorkshopId);
    query.then();
  }, [dayId, activeWorkshopId, hubId, supabase]);

  const signedOff = useCallback((scope: string) => signOffs.get(scope) ?? null, [signOffs]);

  const signOff = useCallback(
    (listId: string) => {
      const scope = scopeForList(listId);
      const row: SignOffRow = { hub_id: hubId, scope, signed_by: profile.id, signed_at: new Date().toISOString(), workshop_id: activeWorkshopId };
      setSignOffs((prev) => {
        const next = new Map(prev);
        next.set(scope, row);
        return next;
      });
      supabase.from('sign_offs').upsert(row).then();
    },
    [scopeForList, hubId, profile.id, activeWorkshopId, supabase]
  );

  const speechDetails = useMemo(() => {
    const row = speechDetailsRows.find((r) => r.workshop_id === activeWorkshopId);
    return { theme: row?.theme ?? '', dates: row?.dates ?? '', tutors: row?.tutors ?? [] };
  }, [speechDetailsRows, activeWorkshopId]);

  // Debounced so a burst of keystrokes across the Theme/Dates/Tutor fields
  // becomes one write, not one per field per keystroke - and so there's only
  // ever one save in flight, which avoids inserting duplicate rows before the
  // first insert has come back with a real id.
  const updateSpeechDetails = useCallback(
    (patch: Partial<{ theme: string; dates: string; tutors: Tutor[] }>) => {
      setSpeechDetailsRows((prev) => {
        const idx = prev.findIndex((r) => r.workshop_id === activeWorkshopId);
        if (idx === -1) {
          return [...prev, { id: 0, hub_id: hubId, workshop_id: activeWorkshopId, theme: '', dates: '', tutors: [], ...patch }];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], ...patch };
        return next;
      });

      if (speechSaveTimer.current) clearTimeout(speechSaveTimer.current);
      speechSaveTimer.current = setTimeout(() => {
        setSpeechDetailsRows((current) => {
          const row = current.find((r) => r.workshop_id === activeWorkshopId);
          if (!row) return current;
          const payload = { theme: row.theme, dates: row.dates, tutors: row.tutors, updated_at: new Date().toISOString(), updated_by: profile.id };
          if (row.id > 0) {
            supabase.from('speech_details').update(payload).eq('id', row.id).then();
          } else {
            supabase
              .from('speech_details')
              .insert({ hub_id: hubId, workshop_id: activeWorkshopId, ...payload })
              .select()
              .single()
              .then(({ data }) => {
                if (data) {
                  const saved = data as { id: number; workshop_id: number | null; theme: string | null; dates: string | null; tutors: Tutor[] };
                  setSpeechDetailsRows((p) =>
                    p.map((r) =>
                      r.workshop_id === activeWorkshopId
                        ? { ...r, id: saved.id, theme: saved.theme ?? '', dates: saved.dates ?? '', tutors: saved.tutors ?? [] }
                        : r
                    )
                  );
                }
              });
          }
          return current;
        });
      }, 700);
    },
    [activeWorkshopId, hubId, profile.id, supabase]
  );

  useEffect(() => {
    return () => {
      if (speechSaveTimer.current) clearTimeout(speechSaveTimer.current);
    };
  }, []);

  const groupIds = useMemo(() => {
    const row = hubGroupsRows.find((r) => r.workshop_id === activeWorkshopId);
    return row ? row.group_ids : (DEFAULT_GROUP_IDS[hubId] ?? []);
  }, [hubGroupsRows, activeWorkshopId, hubId]);

  const groups = useMemo(() => groupsFromIds(groupIds), [groupIds]);

  // Same debounced update-or-insert pattern as updateSpeechDetails above.
  const updateGroupIds = useCallback(
    (ids: string[]) => {
      setHubGroupsRows((prev) => {
        const idx = prev.findIndex((r) => r.workshop_id === activeWorkshopId);
        if (idx === -1) {
          return [...prev, { id: 0, hub_id: hubId, workshop_id: activeWorkshopId, group_ids: ids }];
        }
        const next = [...prev];
        next[idx] = { ...next[idx], group_ids: ids };
        return next;
      });

      if (groupsSaveTimer.current) clearTimeout(groupsSaveTimer.current);
      groupsSaveTimer.current = setTimeout(() => {
        setHubGroupsRows((current) => {
          const row = current.find((r) => r.workshop_id === activeWorkshopId);
          if (!row) return current;
          const payload = { group_ids: row.group_ids, updated_at: new Date().toISOString(), updated_by: profile.id };
          if (row.id > 0) {
            supabase.from('hub_groups').update(payload).eq('id', row.id).then();
          } else {
            supabase
              .from('hub_groups')
              .insert({ hub_id: hubId, workshop_id: activeWorkshopId, ...payload })
              .select()
              .single()
              .then(({ data }) => {
                if (data) {
                  const saved = data as { id: number; workshop_id: number | null; group_ids: string[] };
                  setHubGroupsRows((p) =>
                    p.map((r) => (r.workshop_id === activeWorkshopId ? { ...r, id: saved.id, group_ids: saved.group_ids ?? [] } : r))
                  );
                }
              });
          }
          return current;
        });
      }, 700);
    },
    [activeWorkshopId, hubId, profile.id, supabase]
  );

  useEffect(() => {
    return () => {
      if (groupsSaveTimer.current) clearTimeout(groupsSaveTimer.current);
    };
  }, []);

  const value: HubDataValue = {
    hubId,
    profile,
    dayId,
    setDayId,
    loading,
    tickedAt,
    toggleTick,
    progress,
    pointsTotal,
    award,
    canUndo: !!lastAward,
    lastAwardLabel: lastAward ? `Undo last +${lastAward.delta}` : null,
    undoLastAward,
    resetPoints,
    signedOff,
    signOff,
    speechDetails,
    updateSpeechDetails,
    groups,
    groupIds,
    updateGroupIds,
    scopeForList,
  };

  return <HubDataContext.Provider value={value}>{children}</HubDataContext.Provider>;
}

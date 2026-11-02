import type { ColorGroup } from '@/lib/types';

// The fixed set of colour groups a hub can run points for. Hubs pick a
// subset of these (see DEFAULT_GROUP_IDS below for the fallback used before
// a manager has set anything up for the current workshop) - order here is
// also the canonical announce order ("beginning with Orange") regardless of
// which subset is active or what order they were added in.
export const GROUP_PALETTE: Record<string, ColorGroup> = {
  orange: { id: 'orange', name: 'Orange', color: '#C2410C', bg: '#FFF1E7', border: '#F3D3BC' },
  green: { id: 'green', name: 'Green', color: '#15803D', bg: '#E7F4EA', border: '#BBE0C4' },
  yellow: { id: 'yellow', name: 'Yellow', color: '#8A6100', bg: '#FFF8E3', border: '#EFE0B0' },
  red: { id: 'red', name: 'Red', color: '#9B1C1C', bg: '#FDEDED', border: '#F3C6C6' },
  silver: { id: 'silver', name: 'Silver', color: '#4B5563', bg: '#F3F4F6', border: '#DCDFE4' },
  black: { id: 'black', name: 'Black', color: '#1B1A1F', bg: '#F2F1EF', border: '#D8D5D0' },
};

export const GROUP_IDS = ['orange', 'green', 'yellow', 'red', 'silver', 'black'];

// Used only as a fallback when no hub_groups row exists yet for the current
// hub/workshop (e.g. before any manager has touched the new group editor).
// Epsom is the only location that's historically run four colour groups; the
// rest run three.
export const DEFAULT_GROUP_IDS: Record<string, string[]> = {
  epsom: ['orange', 'yellow', 'silver', 'black'],
  karaka: ['orange', 'yellow', 'silver'],
  hamilton: ['orange', 'yellow', 'silver'],
  northshore: ['orange', 'yellow', 'silver'],
  howick: ['orange', 'yellow', 'silver'],
};

export function groupsFromIds(ids: string[]): ColorGroup[] {
  return GROUP_IDS.filter((id) => ids.includes(id)).map((id) => GROUP_PALETTE[id]);
}

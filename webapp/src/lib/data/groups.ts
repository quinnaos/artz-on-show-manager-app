import type { ColorGroup } from '@/lib/types';

const G = {
  orange: { id: 'orange', name: 'Orange', color: '#C2410C', bg: '#FFF1E7', border: '#F3D3BC' },
  yellow: { id: 'yellow', name: 'Yellow', color: '#8A6100', bg: '#FFF8E3', border: '#EFE0B0' },
  silver: { id: 'silver', name: 'Silver', color: '#4B5563', bg: '#F3F4F6', border: '#DCDFE4' },
  black: { id: 'black', name: 'Black', color: '#1B1A1F', bg: '#F2F1EF', border: '#D8D5D0' },
} satisfies Record<string, ColorGroup>;

// Epsom is the only location running four colour groups; the rest run three.
export const GROUPS: Record<string, ColorGroup[]> = {
  epsom: [G.orange, G.yellow, G.silver, G.black],
  karaka: [G.orange, G.yellow, G.silver],
  hamilton: [G.orange, G.yellow, G.silver],
  northshore: [G.orange, G.yellow, G.silver],
  howick: [G.orange, G.yellow, G.silver],
};

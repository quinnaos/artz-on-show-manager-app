import type { Hub } from '@/lib/types';

export const HUBS: Hub[] = [
  { id: 'epsom', name: 'Epsom', venue: 'Raye Freedman Arts Centre, Silver Road, Newmarket' },
  { id: 'karaka', name: 'Karaka', venue: 'Karaka Memorial Hall, 319 Linwood Road' },
  { id: 'hamilton', name: 'Hamilton', venue: 'Southwell School, 200 Peachgrove Road' },
  { id: 'northshore', name: 'North Shore', venue: 'Takapuna Normal Intermediate School, 26 Northcote Road' },
  { id: 'howick', name: 'Howick', venue: 'Howick College, 25 Sandspit Road, Howick' },
];

export function hubById(id: string): Hub {
  return HUBS.find((h) => h.id === id) ?? HUBS[0];
}

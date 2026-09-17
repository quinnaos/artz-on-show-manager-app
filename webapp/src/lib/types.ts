export type Role = 'owner' | 'manager';

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  hubIds: string[];
};

export type ChecklistItem = {
  t: string;
  sub?: string;
  more?: string;
  chip?: string;
  hubs?: string[];
  notHubs?: string[];
};

export type ChecklistSection = {
  name: string;
  items: ChecklistItem[];
};

export type ChecklistDef = {
  id: string;
  name: string;
  abbr: string;
  sub: string;
  subAlt?: Record<string, string>;
  blurb: string;
  blurbAlt?: Record<string, string>;
  briefLead?: string;
  brief?: string;
  briefAlt?: Record<string, { lead?: string; brief?: string }>;
  sections: ChecklistSection[];
};

export type Hub = {
  id: string;
  name: string;
  venue: string;
};

export type ScheduleBlock = {
  t: string;
  name: string;
  note: string;
  day1?: boolean;
  go?: 'list' | 'welcome' | 'group';
};

export type ColorGroup = {
  id: string;
  name: string;
  color: string;
  bg: string;
  border: string;
};

export type Contact = {
  name: string;
  role: string;
  phone: string;
};

export type GroupTimeItem = { t?: string; i?: string; b?: string; note?: string };
export type GroupTimeSection = { name: string; items: GroupTimeItem[] };

export const GROUPTIME: GroupTimeSection[] = [
  { name: 'Before Group Time', items: [
    { t: 'Please ensure doors are shut well in advance of Group Time.' },
    { b: 'Bags:', t: 'Before parents enter, please ensure all bags are tidy and students are seated quietly and ready.' },
    { b: 'Dances:', t: 'Check in with the Dance Tutors and have up to two dances prepared, a combination of Jazz and Hip-Hop. Dances are to be shown Monday, Tuesday, and Wednesday only.' },
    { b: '5 Volunteers:', t: 'Choose 5 volunteers (prior to Group Time so they can practice) to talk about their day. They must clearly state their name, age, school, and favourite class of the day. Encourage them to speak loudly and practice projecting their voice so everyone can hear.' },
  ]},
  { name: 'Group Time', items: [
    { t: 'Open the doors and Welcome the parents in.' },
    { t: 'Begin with our volunteers and group dances.' },
    { b: 'Today:', t: 'Talk about what the children got up to today and any exciting things that happened. Specialist classes, dances, auditions, lines, Photography Day, Art, blocking etc.' },
    { b: 'Tomorrow:', t: 'Build excitement for the next day. Provide a preview for the next day, especially Specialist Classes.' },
    { i: 'If it is Photography Day, remind students to bring a brush or comb, not to share these items, and to come ready with big smiles.' },
  ]},
  { name: 'Show Day Announcements (Wednesday and Thursday)', items: [
    { b: 'What to wear:', t: 'All black clothing, hair neat and up. Staff will assist with makeup and final hair touches.' },
    { b: 'Footwear:', t: 'No crocs or light up shoes please - huge Health and Safety issue!!' },
    { b: 'Show Newsletter:', t: 'If parents have not received it, there are copies free to take on the Admin table.' },
    { b: 'At home:', t: 'Get a good night’s sleep, bring plenty of water and food, and practise their lines and dances.' },
    { t: 'Check in with staff for any additional reminders.' },
  ]},
  { name: 'Points & Certificates', items: [
    { t: 'Invite tutors to present a certificate to one student each, ensuring they clearly explain why the student is receiving it and celebrate effort, attitude, and growth.' },
    { t: 'Photograph the Certificate Winners.', note: 'Any winner with a blue dot is photographed on their own with the Tutor who awarded them.' },
    { t: 'Briefly explain to parents how the points system works. Announce points in group colour order, beginning with Orange always' },
  ]},
  { name: 'Home Time', items: [
    { t: 'All students must remain inside or in the designated area until their parent or caregiver arrives. Dismiss groups to collect their bags one group at a time. Please send Orange Group first to help with smooth collection and visibility.' },
  ]},
  { name: 'One Day Students', items: [
    { t: 'Try and catch One Day Students before they leave to chat about how they found the day and discuss the option of returning for another day.' },
  ]},
];

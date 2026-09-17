export type WelcomeItem = { t: string; hubs?: string[] };
export type WelcomeSection = { name: string; tone?: 'venue' | 'show'; items: WelcomeItem[] };

export const WELCOME: WelcomeSection[] = [
  { name: 'Morning Welcome', items: [
    { t: 'Each staff member to introduce themselves to the children. Please do not ask staff to share their age. Introduce other Tutor’s not rostered on and what they will be teaching (so children know what to expect), they can introduce themselves properly when they arrive.' },
    { t: 'Announce and discuss the theme.' },
    { t: 'Announce Specialist Classes.' },
    { t: 'Talk about expectations with name tags eg. not food, no decorating them.' },
    { t: 'Classrooms and toilets' },
    { t: 'Ziggy, Ziggy, Ziggy/There was a hush from the crowd/Clapping/Numbers 10, 9, 8, etc.' },
    { t: 'Discuss how we move between classes. E.g. lining up and walking' },
    { t: 'No running, chewing gum, or cell phones.' },
    { t: 'Evacuation procedure' },
    { t: 'First aid kit / sunscreen' },
    { t: 'Discuss boundaries, personal space and how we talk to each other.' },
    { t: 'Set expectations for Quiet Time. Show the children what activities are available, and how we look after them and each other while using them.' },
    { t: 'Points system: All groups start from 0 each class. Children can earn points, but there is no taking away points. Listening, effort, respect, kindness. Ask the children who won at the previous Workshop (make it fun). We do not want the same group to win again.' },
  ]},
  { name: 'Venue specific', tone: 'venue', items: [
    { t: 'Southwell: No going on the oval as it is a sacred piece of land.', hubs: ['hamilton'] },
    { t: 'Karaka: No playing with the Play Centre mud kitchen at all. Please remind children of this daily.', hubs: ['karaka'] },
  ]},
  { name: 'SHOW DAY', tone: 'show', items: [
    { t: 'Expectations for when in the theatre and how to behave on the stage' },
    { t: 'Use your listening ears!' },
    { t: 'Remind children that its okay to feel nervous or have butterflies in your stomach. Nerves mean you care!' },
  ]},
];

// Closing Speech. Anything in [square brackets] is a gap the Manager fills
// with the week's detail. `cue` lines are stage directions / applause cues.
export type SpeechPara = { t: string; cue?: boolean; hints?: string[] };

export const SPEECH: SpeechPara[] = [
  { cue: true, t: 'Firstly, can we give a huge round of applause to all of our incredible performers!' },
  { t: 'What you have just seen on stage is the result of an amazing week of learning, creating, rehearsing and working together.' },
  { t: 'This week, we have watched our children [e.g. grow in confidence, make new friendships, work incredibly hard, step outside their comfort zones].' },
  { t: 'A real stand out moment this week was [a stand out moment from the week], and it has been so wonderful watching how the children have [something they have done as a group].',
    hints: ['Stand out moment: the whole cast nailing the finale for the first time, hearing them all sing together on stage for the first time, how quickly they picked up their scenes',
      'As a group: supported and encouraged each other, come together as one cast, grown in confidence together, made everyone feel included'] },
  { t: 'For many of our children, getting up on stage and performing in front of an audience is a huge achievement. Whether it was [e.g. learning some tricky choreography, projecting their lines, performing a part that is completely out of their comfort zone, trying a new style, getting on stage for the first time], every child has achieved something to be proud of this week.' },
  { t: 'And how amazing was [e.g. a favourite dance, funny scene, song, character or special moment from the show]!' },
  { t: 'We are incredibly proud of every single one of them.' },
  { t: 'A massive thank you as well to our wonderful Tutors who have encouraged, taught and supported the children throughout the week. We have had:' },
  { t: '[Tutor name] teaching [discipline]\n[Tutor name] teaching [discipline]\n[Tutor name] teaching [discipline]\n[Tutor name] teaching [discipline]' },
  { cue: true, t: 'Can we please give our Tutors a huge round of applause!' },
  { t: 'And of course, a huge thank you to all of our families. Thank you for trusting us with your children and for being here today to celebrate them. We absolutely love creating a space where children can be creative, build their confidence, make friends, try new things and feel proud of themselves.' },
  { t: 'Our next Artz On Show Workshop is [theme], running [dates]. We would absolutely love to see lots of familiar faces back again!' },
  { t: 'In just a moment, we are going to take the children back for around 10 more minutes for our final points, lollipops and prizes, and then we will send them back out to you.' },
  { t: 'But before we do, to all of our performers: you should be so proud of yourselves!' },
  { t: 'Thank you for bringing your [e.g. energy, kindness, enthusiasm, creativity, humour] to Artz On Show this week. It has been an absolute pleasure having you with us.' },
  { cue: true, t: 'And for one final time, can we make some noise and give a massive round of applause to our [theme] cast!' },
];

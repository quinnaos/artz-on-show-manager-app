import type { ChecklistDef } from '@/lib/types';

export const ADMIN: ChecklistDef = {
  id: 'admin', name: 'Daily Admin', abbr: 'ADM', sub: 'To be ticked off every day',
  blurb: 'These need to be ticked off every day.',
  sections: [
    { name: 'Roll and absences', items: [
      { t: 'For children who have not arrived: Check the roll for days attending & any notes.', more: 'Using the enrolment form, call parent to see why child/ren have not turned up. Please type the reason why in the notes column on the roll so we know in the office as well as in the debrief.' },
      { t: 'If a child is not attending at all for the week (unable to attend or sick) please add this to your Debrief. The office will sort this on the roll.' },
    ]},
    { name: 'Enrolments and sales', items: [
      { t: 'Finish adding the enrolments as required – if you need any support with this, please email artz@artzonshow.co.nz. Please add children to all tabs on the roll' },
      { t: 'If you sold any additional photos, please make sure these have been added to the roll.' },
      { t: 'Count merch on Day 1 and the final day and check against the stock on Shopify.', chip: 'Day 1 and Day 5' },
    ]},
    { name: 'Parent communication', items: [
      { t: 'Send a quick message to new parents around 10.30am to update them with their child’s progress and enjoyment.  To be done anytime a child is unsettled at drop off.' },
    ]},
    { name: 'Friday only', items: [
      { t: 'FRIDAY: Bag each individual and sibling photos using the sealable bags in the Admin box.', chip: 'Day 5 only', more: 'Individual and sibling photos are to be placed in the same bag, both facing upwards. Use the photo sheet to make sure each child’s photo is accounted for. If any prints are missing, please notify the primary caregiver of the child so they are aware before arriving - inform them a print will be organised and posted to them.' },
    ]},
  ],
};

const TABLES_TIDY = { t: 'Tables are in a tidy manner', more: 'Merch laid out nicely, tablecloths straight, posters visible, QR stands are visible etc. Please maintain a tidy Admin area throughout the week. HWK – please use the vacuum when and where needed throughout the week.' };
const WIFI_POS = { t: 'Wifi / iPad and Shopify / POS are connected, roll is open', more: 'See green or red bar at the top of the screen for POS connection. Complete Merch and Photo sales through Shopify POS app. Link email address and child’s name for customer.' };
const EMAILS = { t: 'Check Workshop emails for last minute enrolments.', more: 'Make a name tag!' };
const WELCOME_ITEM = { t: 'Welcome every child and parent by their name', more: 'Every parent and child must be welcomed by their name, ticked off on the digital roll, given their lanyard and be welcomed into the main room. Bags are to be put under their colour group sign. Please delegate a tutor to help you with welcoming children.' };
const MERCH_SALES = { t: 'Complete any Merch and Photograph sales' };
const TUTORS_MAIN_ROOM = { t: 'Tutors are to be in the main room to comfort and manage students' };
const WARM_UP = { t: 'One or two tutors are to start a Warm up from 8:50am - no later.', more: 'Please add variety to your Warm ups – Drama, Vocals, Dance, Jump Jam, ice breakers.' };
const DANCE_INTRO = { t: 'Please ensure Dance Tutors are running Intro/Finale as part of the Warm Up' };
const DAILY_WELCOME_LINE = { t: 'At 9:20am approx, groups will sit in their lines for Daily Welcome/Introductions/Check ins' };
const FRONT_DOOR = { t: 'Front door to be locked for security reasons once all children are inside (if you can).' };
const NOTES_ACTIONED = { t: 'Check you have no notes to be actioned/put notes from arrival into daily debrief/ask office to action.' };
const DAILY_ADMIN_CHECK = { t: 'Check off Daily Admin Tasks' };
const CHECK_TUTORS = { t: 'Check on tutors and make sure classes are running smoothly.', more: 'Please watch/observe/help in classes as much as you can. Write any notes or observations of tutors/classes in the debrief.' };
const TWO_LINES = { t: 'Children are to walk quietly and in two lines when moving between classes.', more: 'Remind tutors and children that some classes may still be learning.\n\nThis is an expectation that must be taught. Manager and Tutors to model what to do and what not to do.' };
const BRAIN_BREAKS = { t: 'Brain Breaks - Optional for older groups', more: 'This can be used for toilet breaks, snacks, or a game. Tutors must closely supervise their group.' };
const PHOTOS_VIDEOS = { t: 'Photos and Videos for Marketing', sub: 'Children with blue stickers cannot be photographed.', more: 'Please take quality photos AND videos throughout the day. Message your photos and videos to Sara/Quinn before the end of each day.' };
const WORKSHOP_ASSISTANTS = { t: 'Workshop Assistants', more: 'Support your Workshop Assistants as much as you can by observing them regularly, giving feedback, discussing their progress, and working through their checklist with them.' };
const MORNING_TEA = { t: 'Morning Tea after Session 2', more: 'Please ensure you have 2 staff members actively on duty. If you have more than 70 children, you will need 3 staff members on.' };
const BACK_FROM_TEA = { t: 'Students come back from morning tea, roll is called (not marked) and send students off to their classes.', more: 'Manager needs to announce where groups are going for Session 3 and 4 using the Timetable. Do this first, mark the first groups roll and send them off etc.' };
const LUNCH = { t: 'Lunch time begins at 1pm. Remind children to drink water and eat what they have!', more: 'Please ensure you have 2 staff members actively on duty. If you have more than 70 children, you will need 3 staff members on.' };
const QUIET_TIME = { t: 'After Lunch, students will come in for ‘quiet time’. How each child expresses this is fine, as long as it is quiet.' };
const RUBBISH = { t: 'All children are to help pick up any rubbish and tidy their bags. Please ensure all lost property is handed out.' };
const PM_ROLL = { t: 'PM roll is marked before going off for the afternoon classes.', more: 'Manager needs to announce where groups are going for Session 5 and 6 using the Timetable. Do this first, mark the first groups roll and send them off etc.' };
const LANYARDS_TIDY = { t: 'Students Lanyards are to be collected and displayed on the admin table in a TIDY MANNER.' };
const CERTS_POINTS_ORG = { t: 'Get Certificates and Points organised.' };
const INTRO_FINALE = { t: 'Intro/Finale Rehearsal at 3.15pm.' };
const GROUP_TIME_STARTS = { t: 'At 3:45pm group times starts.' };
const MEDICINE = { t: 'Return any students medicine.' };
const FINISH_ON_TIME = { t: 'AOS Workshops must finish on time every day, at 4pm.' };
const ROOMS_LOCKED = { t: 'Tutors are responsible for their rooms: lights out, windows closed, lost property collected. Lock rooms.' };
const LATE_PARENTS = { t: 'Ring late parents at 4.15 pm to check that they are on their way.' };
const DEBRIEF = { t: 'Daily Debrief', more: 'Talk through the debrief with your team and record on JotForm link in Teams. This is to be a GROUP conversation with your team so that everyone is on the same page. Send staff home by 4:30pm.' };
const TIMESHEETS = { t: 'Staff Timesheets – Daily', more: 'Check that the timesheets have been filled out by each tutor. The Manager must sign the timesheet. Ensure all the timesheets round to the nearest 5 minutes.' };
const ROAD_SIGN_IN = { t: 'Bring Artz on Show road sign inside.' };
const LOCK_UP = { t: 'Ensure all doors and windows are securely locked before you set an alarm and leave for the night.' };
const SPOTIFY = { t: 'Use the themed Spotify playlist to play very quietly during the Welcome. Put the speaker out of reach.' };
const DANCES_SCENES_WATCH = { t: 'Dances and scenes - Please watch!', more: 'Do your best to watch dances and scenes. Provide support to ensure the dances are clean and high energy. Children are to sing the Jazz and Intro/Finale dances – please encourage this. Watch scenes and ensure the Drama tutor is beginning to block these. This will make Thursday afternoon and show rehearsals a lot smoother. Encourage children to project their voices.' };

export const DAYS: ChecklistDef[] = [
  { id: 'mon', name: 'Day 1', abbr: 'D1', sub: 'Welcome and introductions',
    blurb: 'Welcome, introductions and setting expectations for the week.',
    briefLead: 'Day 1 sets the tone for the week. Teach routines, expectations and boundaries clearly, and get staff learning names from the start.',
    brief: 'Take the time to clearly explain routines, expectations, and boundaries, ensuring both new and returning children understand how the Workshop will run. These expectations should be reinforced throughout the week. Encourage all staff to begin building positive relationships with the children from the very first day. Learning names, creating a welcoming environment, and making every child feel valued will have a significant impact on their overall experience.',
    sections: [
      { name: 'Before doors open', items: [
        { t: 'Unlock all rooms and spaces' },
        { t: 'Hold a Staff Briefing' },
        { t: 'Road sign out' },
        TABLES_TIDY, WIFI_POS, EMAILS,
        { t: 'Put the Colouring sheets and pencils in the main room', more: 'Children do not have to do one, but they are there as an option to help calm their nerves.' },
      ]},
      { name: 'Arrival and welcome', items: [
        WELCOME_ITEM, MERCH_SALES, TUTORS_MAIN_ROOM, WARM_UP, DAILY_WELCOME_LINE, FRONT_DOOR, NOTES_ACTIONED, DAILY_ADMIN_CHECK,
      ]},
      { name: 'Morning sessions', items: [
        CHECK_TUTORS, TWO_LINES, BRAIN_BREAKS, PHOTOS_VIDEOS, WORKSHOP_ASSISTANTS, MORNING_TEA, BACK_FROM_TEA,
      ]},
      { name: 'Lunch and quiet time', items: [
        LUNCH, QUIET_TIME, RUBBISH, PM_ROLL, LANYARDS_TIDY,
      ]},
      { name: 'Afternoon', items: [
        CERTS_POINTS_ORG, INTRO_FINALE, GROUP_TIME_STARTS, MEDICINE, FINISH_ON_TIME,
      ]},
      { name: 'Close of day', items: [
        ROOMS_LOCKED, LATE_PARENTS, DEBRIEF, TIMESHEETS, ROAD_SIGN_IN, LOCK_UP,
      ]},
    ]},
  { id: 'tue', name: 'Day 2', abbr: 'D2', sub: 'Photography Day · drama script', subAlt: { epsom: 'Drama script printed and handed out' },
    blurb: 'Photography day, be ready to start at 9am. Drama script printed and handed out.',
    blurbAlt: { epsom: 'Drama script printed, organised and handed out.' },
    briefLead: 'Day 2 builds on Day 1. Reinforce yesterday’s routines, run Photography Day smoothly, and hand out scripts.',
    briefAlt: { epsom: {
      lead: 'Day 2 builds on Day 1. Reinforce yesterday’s routines and hand out scripts.',
      brief: 'Day 2 is all about building on the foundations set on Day 1. Continue to reinforce the routines, expectations, and boundaries established yesterday, while encouraging staff to keep building positive relationships with the children. Scripts should be printed, organised, and handed out to the children, taking time to explain how they will be used and looked after throughout the week. By now, children should be starting to settle into the Workshop, so keep encouraging confidence, participation, and a positive team environment.',
    }},
    brief: 'Day 2 is all about building on the foundations set on Day 1. Continue to reinforce the routines, expectations, and boundaries established yesterday, while encouraging staff to keep building positive relationships with the children. Day 2 is also Photography Day, so ensure children and staff are prepared and that photography runs smoothly alongside the Workshop schedule. Scripts should be printed, organised, and handed out to the children, taking time to explain how they will be used and looked after throughout the week. By now, children should be starting to settle into the Workshop, so keep encouraging confidence, participation, and a positive team environment.',
    sections: [
      { name: 'Before doors open', items: [
        { t: 'Unlock all rooms and spaces' }, { t: 'Road sign out' }, TABLES_TIDY, WIFI_POS, EMAILS,
        { t: 'Drama Script - Is it ready to print?', more: 'Check that you have received the script with casting from the Drama Tutor. Begin printing scripts, please ensure this does not take you away from welcoming each child by their name. The number of children in a scene = the number of copies printed for that scene. Once done, staple scenes together and highlight the lines for each child.' },
        { t: 'Photography Day. Ensure you are ready to start at 9am', notHubs: ['epsom'], more: 'All children are listed on the Photo Sheet, so if any payments, please just change the number in the correct columns. Eg. each child has a 1 for individual photo, if they purchase another, they will have a 2. Print out 2 copies of photo sheet for Photographer and you. Ensure all children get their photo and sibling photo if paid for. Before the photographer leaves, please copy his references to your copy of the photo sheet. Groups need to be picked up from their class and taken to the photographer. They must wait in a line sitting down. Once groups are all completed, do the sibling photos. Confirm with the photographer, they have done all the siblings and have all additional prints recorded.' },
        SPOTIFY,
      ]},
      { name: 'Arrival and welcome', items: [
        WELCOME_ITEM, MERCH_SALES, TUTORS_MAIN_ROOM, WARM_UP, DANCE_INTRO, DAILY_WELCOME_LINE, FRONT_DOOR, NOTES_ACTIONED, DAILY_ADMIN_CHECK,
      ]},
      { name: 'Morning sessions', items: [
        CHECK_TUTORS, TWO_LINES, BRAIN_BREAKS, PHOTOS_VIDEOS, WORKSHOP_ASSISTANTS, MORNING_TEA, BACK_FROM_TEA,
      ]},
      { name: 'Lunch and quiet time', items: [
        LUNCH, QUIET_TIME, RUBBISH, PM_ROLL, LANYARDS_TIDY,
      ]},
      { name: 'Afternoon', items: [
        CERTS_POINTS_ORG, INTRO_FINALE, GROUP_TIME_STARTS, MEDICINE, FINISH_ON_TIME,
      ]},
      { name: 'Close of day', items: [
        ROOMS_LOCKED, LATE_PARENTS, DEBRIEF, TIMESHEETS, ROAD_SIGN_IN, LOCK_UP,
      ]},
    ]},
  { id: 'wed', name: 'Day 3', abbr: 'D3', sub: 'Dances finished, learning lines', subAlt: { epsom: 'Photography Day · dances finished, learning lines' },
    blurb: 'Dances finished and children well into learning their lines. Confirm speech and Intro/Finale leaders today.',
    blurbAlt: { epsom: 'Photography day, be ready to start at 9am. Dances finished and children well into learning their lines.' },
    briefLead: 'Day 3 is hump day. Energy may dip, so bring patience and encouragement. Dances finished and lines well underway by the end of today.',
    brief: 'Day 3 can often feel like the ‘hump day’ of the Workshop. Children may be starting to feel tired as they reach the middle of a busy week, so continue to bring plenty of positive energy, encouragement, and patience throughout the day. Keep reinforcing the expectations and routines established earlier in the week, particularly if energy or focus begins to drop. By the end of Day 3, dances should be finished and children should be well into learning their lines, with a strong understanding of their scenes and what is expected of them. This is a great day to celebrate how much has already been achieved while keeping everyone motivated and focused for the final two days.',
    sections: [
      { name: 'Before doors open', items: [
        { t: 'Unlock all rooms and spaces' }, { t: 'Road sign out' }, TABLES_TIDY, WIFI_POS, EMAILS,
        { t: 'Photography Day. Ensure you are ready to start at 9am', hubs: ['epsom'], more: 'All children are listed on the Photo Sheet, so if any payments, please just change the number in the correct columns. Eg. each child has a 1 for individual photo, if they purchase another, they will have a 2. Print out 2 copies of photo sheet for Photographer and you. Ensure all children get their photo and sibling photo if paid for. Before the photographer leaves, please copy his references to your copy of the photo sheet. Groups need to be picked up from their class and taken to the photographer. They must wait in a line sitting down. Once groups are all completed, do the sibling photos. Confirm with the photographer, they have done all the siblings and have all additional prints recorded.' },
        { t: 'Make sure all Art Gear is clean, packed up and Art room is tidy and ready to leave venue Friday.' },
        SPOTIFY,
      ]},
      { name: 'Arrival and welcome', items: [
        WELCOME_ITEM, MERCH_SALES, TUTORS_MAIN_ROOM, WARM_UP, DANCE_INTRO, DAILY_WELCOME_LINE, FRONT_DOOR, NOTES_ACTIONED, DAILY_ADMIN_CHECK,
        { t: 'Count lollipops and prizes and let Sara know if you have enough.' },
      ]},
      { name: 'Morning sessions', items: [
        CHECK_TUTORS, TWO_LINES, DANCES_SCENES_WATCH,
        { t: 'Opening speech people - these should be confirmed today.' },
        BRAIN_BREAKS, PHOTOS_VIDEOS, WORKSHOP_ASSISTANTS, MORNING_TEA, BACK_FROM_TEA,
      ]},
      { name: 'Lunch and quiet time', items: [
        LUNCH, QUIET_TIME, RUBBISH, PM_ROLL, LANYARDS_TIDY,
      ]},
      { name: 'Afternoon', items: [
        CERTS_POINTS_ORG, INTRO_FINALE,
        { t: 'Intro/Finale Leaders - these should be confirmed today.' },
        GROUP_TIME_STARTS, MEDICINE, FINISH_ON_TIME,
      ]},
      { name: 'Close of day', items: [
        ROOMS_LOCKED, LATE_PARENTS,
        { t: 'Let ALL staff know, unless they’re working next week, they need to Return uniform Friday after the show.' },
        DEBRIEF, TIMESHEETS, ROAD_SIGN_IN, LOCK_UP,
      ]},
    ]},
  { id: 'thu', name: 'Day 4', abbr: 'D4', sub: 'Run sheet and show prep',
    blurb: 'Run sheet built today. Team briefed on the show day plan.',
    briefLead: 'Day 4 brings it all together. Clean and refine each piece, work transitions, and run larger sections. Children should leave feeling prepared.',
    brief: 'Day 4 is about bringing everything together and getting performance ready. By now, children should be confident with their dances, lines, scenes, and overall structure of the show. Use today to clean and refine each piece, work on transitions, entrances and exits, and begin running larger sections of the performance together. Continue to reinforce expectations and encourage children to stay focused as excitement for tomorrow begins to build. Identify anything that still needs extra attention and make sure staff are clear on what needs to be prioritised before the end of the day. Children should leave Day 4 feeling confident, prepared, and excited to perform.',
    sections: [
      { name: 'Before doors open', items: [
        { t: 'Unlock all rooms and spaces' }, { t: 'Road sign out' }, TABLES_TIDY, WIFI_POS, EMAILS, SPOTIFY,
      ]},
      { name: 'Arrival and welcome', items: [
        WELCOME_ITEM, MERCH_SALES, TUTORS_MAIN_ROOM, WARM_UP, DANCE_INTRO, DAILY_WELCOME_LINE, FRONT_DOOR, NOTES_ACTIONED, DAILY_ADMIN_CHECK,
        { t: 'Run sheet - Template on Teams MUST be used.', more: 'Have a detailed run sheet prepared for the tutors to use for the show. The run sheet must include the children in each scene, their group and costume.' },
      ]},
      { name: 'Morning sessions', items: [
        { t: 'Begin Show Preparation' },
        { t: 'Start preparing the art for display.', sub: 'Cut out, blu tacked and ready to go.' },
        CHECK_TUTORS, DANCES_SCENES_WATCH, TWO_LINES, BRAIN_BREAKS, PHOTOS_VIDEOS, WORKSHOP_ASSISTANTS, MORNING_TEA, BACK_FROM_TEA,
      ]},
      { name: 'Lunch and quiet time', items: [
        LUNCH, QUIET_TIME, RUBBISH,
        { t: 'PM roll is marked before beginning blocking.' },
      ]},
      { name: 'Afternoon', items: [
        { t: 'Detach student lanyards from plastic name pockets.', more: 'Bundle plastic pockets & name tags in a rubber band and place into Admin box. Lanyards are to be placed into laundry bag in Admin Box' },
        CERTS_POINTS_ORG, INTRO_FINALE,
        { t: 'At 3:45pm group times starts. Do not show any dances today.' },
        MEDICINE, FINISH_ON_TIME,
      ]},
      { name: 'Close of day', items: [
        ROOMS_LOCKED, LATE_PARENTS, DEBRIEF,
        { t: 'Recap outline for SHOW DAY. Does your team know the plan?' },
        TIMESHEETS, ROAD_SIGN_IN, LOCK_UP,
      ]},
    ]},
  { id: 'fri', name: 'Day 5', abbr: 'D5', sub: 'SHOW DAY',
    blurb: 'Show starts at 4pm. Pack out follows.',
    briefLead: 'Show day. Build confidence, keep the atmosphere calm, and make sure certificates, costumes, props and spaces are ready.',
    brief: 'Day 5 is show day! The focus today is on building confidence, celebrating everything the children have achieved, and preparing for a fantastic final performance. Complete a full run-through of the show, tidy any final details, and make sure children understand their entrances, exits, transitions, and performance expectations. Keep the atmosphere positive and calm as excitement builds, while continuing to reinforce the routines and expectations that have been in place throughout the week. Ensure certificates, costumes, props, performance spaces, and any parent-facing areas are organised and ready. Most importantly, encourage the children to enjoy the experience, support one another, and feel proud of everything they have accomplished throughout the week.',
    sections: [
      { name: 'Before doors open', items: [
        { t: 'Unlock all rooms and spaces' }, { t: 'Road sign out' }, TABLES_TIDY, WIFI_POS, SPOTIFY,
        { t: 'Give every staff member and the Venue Tech their own copy of the Run Sheet.' },
        { t: 'Confirm every Tutor knows where they need to be and what their role is.' },
      ]},
      { name: 'Arrival and welcome', items: [
        { t: 'Welcome every child and parent by their name - No lanyards', more: 'Every parent and child must be welcomed by their name, ticked off on the digital roll, and be welcomed into the main room. Bags are to be put under their colour group sign. Please delegate a tutor to help you with welcoming children.' },
        MERCH_SALES, TUTORS_MAIN_ROOM, WARM_UP, DANCE_INTRO,
        { t: 'At 9:20am approx, groups will sit in their lines for Daily Welcome/Introductions/Check ins/house keeping for Show Day' },
        FRONT_DOOR, NOTES_ACTIONED, DAILY_ADMIN_CHECK,
      ]},
      { name: 'Rehearsals', items: [
        { t: 'Continue any unfinished Show Preparation.' },
        { t: 'Make sure whoever is running tech, Venue Tech or a Tutor, has the music and the PowerPoint if one is needed.' },
        { t: 'Prepare for the show by displaying Art on stage.', sub: 'Can only be displayed on the Art boards. Use Gunstapler in Admin box. Black Group love helping with this', more: 'The art should already be cut out and ready to go up from Day 4.', hubs: ['epsom'] },
        { t: 'Prepare for the show by displaying Art on stage.', sub: 'Front of the stage and side stage walls.', more: 'The art should already be cut out and ready to go up from Day 4.', hubs: ['howick'] },
        { t: 'Prepare for the show by displaying Art on stage.', sub: 'White wall at the back of the stage and front of stage', more: 'The art should already be cut out and ready to go up from Day 4.', hubs: ['karaka'] },
        { t: 'Prepare for the show by displaying Art on stage.', sub: 'Front of stage only', more: 'The art should already be cut out and ready to go up from Day 4.', hubs: ['hamilton'] },
        { t: 'Prepare for the show by displaying Art on stage.', sub: 'Front of stage and anywhere else you can make it work', more: 'The art should already be cut out and ready to go up from Day 4.', hubs: ['northshore'] },
        { t: 'Finish the blocking before morning tea.', sub: 'It should have movement and action throughout.' },
        { t: 'Follow the timetable for Show rehearsals.', more: 'Do your best to watch dances and scenes. Provide support to ensure the dances are clean and high energy. Children are to sing the Jazz and Intro/Finale dances – please encourage this. Watch scenes and ensure the Drama tutor is beginning to block these. Encourage children to project their voices.' },
        { t: 'Morning Tea', sub: 'Please do your best to ensure the children get fresh air.', more: 'Please ensure you have 2 staff members actively on duty. If you have more than 70 children, you will need 3 staff members on.' },
        { t: 'Students come back from morning tea, roll is called (not marked) and begin next Show run.' },
        { t: 'Run one show rehearsal that the children get to watch, finished before lunch.', sub: 'Practise transitions and stage etiquette if they need work.' },
        { t: 'Make sure the Opening Speech children have practised with the microphones.' },
        { t: 'Make sure the Drama Tutor is organised to prompt and has had practice during at least one rehearsal.' },
        PHOTOS_VIDEOS, WORKSHOP_ASSISTANTS,
      ]},
      { name: 'Lunch and quiet time', items: [
        LUNCH, QUIET_TIME, RUBBISH,
        { t: 'PM roll is marked.' },
      ]},
      { name: 'Hair, make up and final rehearsal', items: [
        { t: 'Begin Hair and Make Up as per the timetable.', more: 'Please ensure children line up nicely when waiting for hairspray and make up. If children are using their own make up, the bathrooms must be left clean.' },
        { t: 'FINAL SHOW REHEARSAL in black clothes, props, and hair and make up, with full tech.' },
        { t: 'After final rehearsal, make sure all Children are clean, tidy and looking presentable.' },
        { t: 'Back in the main room with the children by about 3:30pm for a pre-show warm up or circle time.' },
        { t: 'Make sure the room all the children are waiting in the main room. Bags are tidy and sorted. Make one last toilet call!!  WISH ALL THE CHILDREN GOOD LUCK and reassure them that nerves are okay!' },
      ]},
      { name: 'The show', items: [
        { t: 'Have points, prizes and certificates ready to go.' },
        { t: 'Put all merch on display in the merch box for the duration of the show.' },
        { t: 'Manager in the reception area to welcome parents and direct them to the show.' },
        { t: 'Children ready backstage at 3:45pm, doors open at 3:45pm.' },
        { t: 'Show starts at 4pm sharp.' },
        { t: 'Manager to say Closing Speech at the end of the show.' },
        { t: 'Back in the main room (not on stage!): Final certificates are to be awarded. Group points are to be tallied and winning group announced - Hand out prizes to winning group after the other groups have left.' },
        { t: 'Dismiss students group by group, giving each student a lollipop as they leave.' },
        { t: 'Manager to head out to admin area, meet with parents, help with enrolments. Be prepared to assist with future enrolments before and after the show. Ensure QR codes, forms and POS is ready to go.' },
      ]},
      { name: 'Pack out', items: [
        { t: 'Tutors collect lost property and take down the art immediately after Certificates and Points.' },
        { t: 'Tutors are responsible for helping tidy up: lights out, windows closed, lost property collected. Lock rooms. Begin Pack Out' },
        { t: 'Refer to the Manager Pack Out Checklist to begin packing out.', more: 'Please delegate two tutors to complete the Tutor 1 and Tutor 2 Packout lists. Ensure the Workshop Gear Checklist is completed.' },
        DEBRIEF, TIMESHEETS, LOCK_UP,
      ]},
    ]},
];

export const CERTS: ChecklistDef = {
  id: 'certs', name: 'Certificates and Points', abbr: 'C&P', sub: 'Awarded during Group Time',
  blurb: 'Points tallied and certificates awarded each day.',
  sections: [
    { name: 'Points sheets', items: [
      { t: 'Each Tutor must have a Points sheets and should be adding to this sheet throughout each class. Points cannot be taken away once they have been awarded.' },
      { t: 'Points must be tallied and updated on the whiteboard. If points are significantly far apart, please bump up the lower groups.' },
    ]},
    { name: 'Choosing winners', items: [
      { t: 'Each Tutor must choose a Certificate Winner for each discipline that they teach.', more: 'There should be 6 certificate winners (5 - Epsom) Monday - Wednesday. Thursday and Friday there should be 3. Manager’s are to only award certificates when it is a very well deserved one.' },
      { t: 'Please check off all Certificate Winners on the Certificate tab on the roll. This is to ensure the certificates are evenly spread across each Workshop.' },
      { t: 'Tutors or Manager must write the certificates with neat and tidy handwriting.' },
    ]},
    { name: 'Group Time', items: [
      { t: 'Tutors must award their certificates during Group Time and the Manager to award any certificates for Tutors not rostered on.' },
      { t: 'During Group Time, points are done last and are ALWAYS announced from the youngest group to the oldest.' },
    ]},
  ],
};

export function listById(id: string): ChecklistDef {
  if (id === 'admin') return ADMIN;
  if (id === 'certs') return CERTS;
  return DAYS.find((d) => d.id === id) ?? DAYS[0];
}

export function allItems(l: ChecklistDef) {
  return l.sections.flatMap((s) => s.items);
}

export const ALL_LISTS: ChecklistDef[] = [ADMIN, CERTS, ...DAYS];

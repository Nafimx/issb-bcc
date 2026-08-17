/* topics.js — banks for the Day-1 SDT prompts and the Day-2/3 group tasks. */

/* Self Description Test: the board asks for the same person seen from five sides. */
window.SDT_PARTS = [
  { id: "parents", title: "What your parents think of you",
    hint: "Their honest view — what they praise, what they still correct you for, and how they see your future." },
  { id: "teachers", title: "What your teachers or employers think of you",
    hint: "Academic and work performance, discipline, punctuality, how you take correction, what they expect of you." },
  { id: "friends", title: "What your friends think of you",
    hint: "How you behave in a group, whether you are relied on, what they come to you for, what irritates them." },
  { id: "self", title: "What you think of yourself",
    hint: "Strengths and weaknesses in plain words. Name the weakness and what you are doing about it." },
  { id: "become", title: "The kind of person you want to become",
    hint: "The qualities you are building, and the concrete steps you are taking — not a wish list." },
];

window.SDT_GUIDE = [
  "Write about the same person. Five contradictory pictures are the commonest failure.",
  "Be specific: incidents and habits, not adjectives.",
  "Admit real weaknesses, and say what you are doing about each one.",
  "Do not copy a model answer — the interviewer will ask you about every line.",
  "Keep to the time. Roughly a paragraph for each part.",
];

/* Day 2 — Group Discussion topics */
window.GD_TOPICS = [
  "Should military training be compulsory for all university students in Bangladesh?",
  "Technology has made young people physically weaker.",
  "Discipline matters more than talent.",
  "Bangladesh should invest more in renewable energy than in new power plants.",
  "Social media does more harm than good to teenagers.",
  "Merit or reservation: which builds a stronger force?",
  "Sports should be compulsory in every school.",
  "Is climate change the biggest security threat to Bangladesh?",
  "Online education can never replace the classroom.",
  "Cadet colleges give an unfair advantage in the armed forces.",
  "Rapid urbanisation is destroying our rivers.",
  "A leader is born, not made.",
  "Should mobile phones be banned in secondary schools?",
  "Foreign employment or local industry: which serves the country better?",
  "Population is Bangladesh's greatest asset, not its problem.",
  "Peacekeeping missions build a nation's image more than aid does.",
  "Corruption, not poverty, is our main obstacle.",
  "Women should serve in all combat roles.",
  "The value of physical courage in the age of drones.",
  "Youth should be made to give one year of national service.",
  "English medium education is weakening our culture.",
  "Rivers or roads: where should the next taka go?",
  "Is examination-based assessment fair?",
  "Discipline in the family decides discipline in the nation.",
  "Artificial intelligence will replace more jobs than it creates.",
];

/* Day 2 — Extempore: the speaker is given two topics and picks one */
window.EXTEMPORE_TOPICS = [
  "The person who influenced me most", "A decision I regret", "If I were the Prime Minister for a day",
  "The best day of my life", "Why I want to join the armed forces", "Discipline",
  "My village", "A book that changed my thinking", "Courage", "Failure is a good teacher",
  "The role of youth in nation building", "Teamwork", "My greatest weakness",
  "Honesty in public life", "A moment I felt proud of my country", "Time management",
  "The value of physical fitness", "My favourite personality in history", "Punctuality",
  "What leadership means to me", "A risk worth taking", "The habit I want to break",
  "Friendship", "Patriotism", "The day I learned responsibility", "Digital Bangladesh",
  "Rivers of Bangladesh", "Why sports matter", "The importance of reading",
  "One change I would make in our education system",
];

/* Day 3 — Current Affairs Discussion themes */
window.CAD_TOPICS = [
  "Bangladesh's role in UN peacekeeping operations",
  "Regional cooperation in South Asia",
  "Food security and rising prices",
  "Rohingya displacement and its security implications",
  "Climate adaptation in coastal districts",
  "The Bay of Bengal and blue economy",
  "Cyber security and national defence",
  "Padma Bridge and regional connectivity",
  "Remittance economy and migrant workers",
  "Renewable energy targets",
  "Modernisation of the armed forces",
  "Disaster management: how far have we come since 1991?",
  "Education after the pandemic",
  "Water sharing with neighbouring countries",
  "Youth unemployment and skills training",
  "Freedom of the press and responsibility",
  "Artificial intelligence and national policy",
  "Global conflicts and their effect on our economy",
];

/* Day 3 — Planning Exercise scenarios. Kept in the board's style:
   a group, a map-like setting, several problems at once, limited resources. */
window.PE_SCENARIOS = [
  { title: "Flood in the char",
    text: "Your group of eight is returning from a trek and reaches a river bank at 16:00. Across the river a char village of about 200 people is being cut off by rising water. You have one country boat that carries six, two ropes, a first-aid kit and two mobile phones with weak signal. A pregnant woman needs to reach the upazila health complex 12 km away. A dam breach is expected within four hours. The nearest police outpost is 6 km east, the ferry ghat 9 km north.",
    problems: ["Evacuate the char before the breach", "Move the pregnant woman to hospital", "Get word to the authorities"] },
  { title: "Bus accident at night",
    text: "At 22:30 your group of seven finds an overturned bus on a highway 20 km from the nearest town. Eleven passengers are injured, three of them seriously. One of your men is a trained first-aider. You have one private car (four seats), torches and a working phone. The road is blocked in both directions and a fuel tanker is approaching from the north.",
    problems: ["Treat and evacuate the seriously injured", "Clear and control the road", "Inform police, hospital and fire service"] },
  { title: "Fire in the market",
    text: "A fire starts at 19:00 in a two-storey market with sixty shops. Your group of six is nearby. There is a water body 300 m away, a fire hydrant of unknown condition, and a school with 40 children in evening class next door. The fire service is 25 minutes away. A gas cylinder store sits at the rear of the market.",
    problems: ["Evacuate the school and the market", "Contain the fire until help arrives", "Prevent the cylinder store from catching"] },
  { title: "Missing children on a hill trek",
    text: "Two children of a village have gone missing on a hill trail at 15:00. Your group of nine has three torches, one rope, two water bottles and a hand-drawn map. There are three possible trails, one with a waterfall. Darkness falls at 18:15 and rain is expected. Mobile coverage exists only on the ridge line.",
    problems: ["Search all three trails before dark", "Keep communication with the village", "Arrange for the children's care once found"] },
  { title: "Relief distribution",
    text: "After a cyclone your group of eight must distribute 300 relief packets to four villages, two of which can only be reached by boat. You have one truck, one boat, six hours of daylight and a list of the worst-affected families. A local group is trying to take control of the distribution.",
    problems: ["Reach all four villages before dark", "Keep the distribution fair and orderly", "Report to the upazila administration"] },
  { title: "Robbery on the way to the fair",
    text: "Your group of seven is escorting the collection of a village fair, Tk 4 lakh in a locked box, to the bank 15 km away. Halfway there you learn that a gang plans to intercept you at the bridge. There is a longer route through the fields, a police post 5 km back, and only one working phone.",
    problems: ["Get the money to the bank safely", "Inform the police in time", "Keep every man of the group safe"] },
  { title: "Epidemic in a remote union",
    text: "A waterborne disease has broken out in a union of 5,000 people. Your group of eight arrives with a doctor, limited saline, water purification tablets and a loudspeaker. The single tube-well serving the worst-affected para is suspected. Two patients are critical, the nearest hospital is 18 km away with one ambulance.",
    problems: ["Treat the critical patients", "Stop the source of infection", "Inform and organise the community"] },
  { title: "Bridge collapse before an examination",
    text: "The only bridge to the upazila town collapses at 06:00. Forty students, including your group, must reach the examination centre by 09:00. A boat is available but carries eight per trip and takes 20 minutes each way. There is a longer road route of 25 km with two available vans, and one man is injured in the collapse.",
    problems: ["Get all forty candidates to the centre in time", "Attend to the injured man", "Warn traffic and inform the authorities"] },
];

/* Day 3 — Command Task briefs. One commander, two helpers, one obstacle. */
window.CT_TASKS = [
  { title: "The broken gap", brief: "A 12-foot gap must be crossed with one plank of 9 feet, one rope and one drum. The load is a 40 kg box that must reach the far side without touching the ground." },
  { title: "The high wall", brief: "Your team of three must get over an 8-foot wall with one plank and one rope. No one may touch the red area on top." },
  { title: "The casualty lift", brief: "A casualty (a 50 kg dummy) must be lifted from a pit 6 feet deep using two ropes and one plank, without any helper entering the pit." },
  { title: "The water crossing", brief: "Cross a 10-foot 'water' obstacle with two drums and one plank. The plank may not touch the water, and every man must carry his own load." },
  { title: "The tunnel", brief: "Move a heavy load through a low tunnel and up a 5-foot ledge with one rope. Only two men may work at the ledge at any time." },
  { title: "The ammunition run", brief: "Two boxes must be carried across a broken bridge with one plank and one rope in four minutes. Neither box may be dragged." },
];

/* Day 4 — questions the board's conference effectively answers about you */
window.CONFERENCE_POINTS = [
  "Did he show effective intelligence when the plan failed?",
  "Did he influence the group, or only follow it?",
  "Was his reasoning practical and quick?",
  "Did he take responsibility without being told?",
  "Was he consistent across the psychological tests, the ground tasks and the interview?",
  "Did he keep his composure under pressure and fatigue?",
  "Is he socially adaptable — did the group accept him?",
  "Does he have the stamina and determination the training demands?",
];

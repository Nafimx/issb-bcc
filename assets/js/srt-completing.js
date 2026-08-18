/* srt-completing.js — incomplete sentences the cadet finishes, in the form used
   by HSC "Completing Sentences": a clause plus a connector, left hanging.
   The context is kept to cadet, service and everyday Bangladeshi life so the
   drill trains the ISSB response as well as the grammar.
   {s: stem, m: model completion} — the model continues the stem, it does not
   repeat it. */
window.SRT_COMPLETING = [

/* ---- purpose: so that / in order that / lest ---- */
{s:"He got up before dawn so that", m:"he could finish his run before the sun was high."},
{s:"The section rehearsed the drill again and again in order that", m:"no man would hesitate on the day of the test."},
{s:"He kept a spare alarm clock lest", m:"he should be late for the parade."},
{s:"Carry a torch on the night march lest", m:"you lose the track at the halt."},
{s:"She saved a little each month so that", m:"her brother could sit for the examination."},
{s:"He wrote the plan on paper in order that", m:"every man in the group knew his own task."},
{s:"Keep the rifle clean daily lest", m:"it fail you when it is needed most."},
{s:"He explained the route twice so that", m:"nobody would be left behind in the dark."},

/* ---- result: so ... that / such ... that / too ... to ---- */
{s:"The current was so strong that", m:"we crossed only with a rope tied between the banks."},
{s:"He was so tired after the march that", m:"he fell asleep before the meal was served."},
{s:"It was such a heavy load that", m:"four of us had to carry it together."},
{s:"The boy was too weak to", m:"climb the wall without a hand from his friends."},
{s:"The road was too narrow for", m:"the ambulance to reach the village."},
{s:"He spoke so clearly that", m:"even the men at the back understood the order."},
{s:"The flood water rose so quickly that", m:"the families had to leave everything behind."},
{s:"He is such an honest man that", m:"the whole village trusts him with its money."},

/* ---- condition: if / unless / provided / in case ---- */
{s:"If you practise every morning,", m:"your timing will improve within a month."},
{s:"If I had known about the accident,", m:"I would have taken the injured man to hospital myself."},
{s:"If I were the group leader,", m:"I would give each man the job that suits his strength."},
{s:"Unless the plan is simple,", m:"the group will not be able to follow it under pressure."},
{s:"Unless you report the fault at once,", m:"a small problem will become a serious one."},
{s:"You may join the expedition provided that", m:"you pass the swimming test first."},
{s:"Take the first-aid kit in case", m:"somebody is hurt on the obstacle course."},
{s:"If the rope had not held,", m:"the whole party would have fallen into the ditch."},
{s:"If he apologises honestly,", m:"the matter will end there."},

/* ---- time: no sooner ... than / hardly ... when / as soon as / until ---- */
{s:"No sooner had the alarm sounded than", m:"the section fell in with full kit."},
{s:"No sooner had we reached the bank than", m:"the boat began to drift away."},
{s:"Hardly had the officer finished speaking when", m:"the men moved to their positions."},
{s:"Scarcely had the rain stopped when", m:"the group started rebuilding the shelter."},
{s:"As soon as he heard the cry for help,", m:"he ran to the pond and pulled the boy out."},
{s:"As soon as the results were published,", m:"he began preparing for the next attempt."},
{s:"He kept working until", m:"the last man of his group had crossed the obstacle."},
{s:"Wait here till", m:"the section commander returns with the orders."},
{s:"While the others were resting,", m:"he checked the ropes for the next task."},

/* ---- concession: though / although / even if / in spite of / despite ---- */
{s:"Though he was the youngest in the group,", m:"he took the heaviest end of the load."},
{s:"Although the ground was unfamiliar,", m:"he read the map correctly and led the patrol in."},
{s:"Even if nobody is watching,", m:"a cadet does his duty properly."},
{s:"In spite of the heavy rain,", m:"the whole company completed the route march."},
{s:"Despite his injury,", m:"he stayed with the team until the task was finished."},
{s:"He did not give up even though", m:"his plan had failed twice already."},

/* ---- reason: because / since / as ---- */
{s:"He was chosen as the leader because", m:"he had never asked another man to do what he would not."},
{s:"Since the bridge was under water,", m:"the group looked for the shallowest crossing point."},
{s:"As the light was failing,", m:"they marked the trail before moving further."},
{s:"The villagers trusted him because", m:"he had kept every promise he made to them."},

/* ---- wish / it is high time / would rather / had better ---- */
{s:"It is high time we", m:"started training seriously for the physical test."},
{s:"It is time you", m:"decided which service you really want to join."},
{s:"I wish I", m:"had learnt to swim when I was younger."},
{s:"He wishes he", m:"had listened to his teacher's advice about mathematics."},
{s:"I would rather admit my mistake than", m:"let another man take the blame for it."},
{s:"You had better", m:"report the injury before it becomes worse."},
{s:"We had better start early lest", m:"the ferry leave without us."},

/* ---- manner and comparison: as if / as though / than ---- */
{s:"He behaves as if", m:"he were already an officer, not a candidate."},
{s:"She spoke as though", m:"she had seen the whole accident herself."},
{s:"He worked harder than", m:"anybody else in the group that day."},
{s:"The task was easier than", m:"we had expected after so much rehearsal."},

/* ---- relative clauses: who / which / that / where ---- */
{s:"The man who", m:"pulled the child from the canal never gave his name."},
{s:"A cadet who cannot admit a mistake", m:"will never be trusted with a command."},
{s:"This is the village where", m:"our group carried out the relief work last year."},
{s:"The plan which the group finally accepted", m:"was the simplest one of all."},
{s:"The officer whose advice I followed", m:"told me to prepare and then stop worrying."},

/* ---- gerunds, infinitives, prepositions ---- */
{s:"He is good at", m:"organising a group when everybody else is arguing."},
{s:"There is no use", m:"complaining about the ground you have been given."},
{s:"He insisted on", m:"carrying the injured man himself."},
{s:"She succeeded in", m:"convincing her family to let her sit for the board."},
{s:"He is used to", m:"waking before dawn for his morning run."},
{s:"We look forward to", m:"serving the country after the training is over."},
{s:"He left the room without", m:"saying a word about who had caused the damage."},

/* ---- correlatives: not only ... but also / either ... or / neither ... nor ---- */
{s:"He is not only a good sportsman but also", m:"a steady man in an emergency."},
{s:"Either you follow the safety drill or", m:"you stay off the obstacle."},
{s:"Neither the rain nor the cold", m:"stopped the group from finishing the task."},
{s:"He lost not only the match but also", m:"the chance to lead the team that season."},

/* ---- everyday situations, ISSB flavour ---- */
{s:"Seeing the smoke from the market,", m:"he raised the alarm and called the fire service."},
{s:"Finding the road blocked by the fallen tree,", m:"the group cleared it before the buses arrived."},
{s:"Having failed twice,", m:"he analysed his weak points and appeared a third time."},
{s:"Being the only swimmer present,", m:"he jumped in and brought the child to the bank."},
{s:"To reach the camp before dark,", m:"they left the halt an hour earlier than planned."},
{s:"The moment he saw the wallet on the seat,", m:"he handed it to the conductor with the owner's name."},
{s:"Whenever a junior asks for help,", m:"he explains the method instead of doing it for him."},
{s:"Wherever he is posted,", m:"he makes himself useful to the people around him."},
{s:"However difficult the task may be,", m:"it is finished before he rests."},
{s:"As long as the group works together,", m:"no obstacle on the ground is impossible."},
{s:"Now that the examination is over,", m:"he has taken up coaching for the village boys."},
{s:"So long as he is in charge,", m:"the stores are counted and the register is honest."}
];

import { BRAND } from "@/lib/brand";

// Module knowledge checks. Scenario-based on purpose: each question has
// distractors that sound reasonable, and some name a real concept from a
// different lesson, so the rep has to apply the idea rather than recognize
// a phrase from the lesson text.

export type QuizQuestion = {
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  // moduleSlug is set when the lesson is in a different module from the quiz (the final exam).
  lesson: { id: string; title: string; moduleSlug?: string };
};

export const PASS_MARK = 4;

export const module1Quiz: QuizQuestion[] = [
  {
    prompt:
      "It's 9:00 a.m. and Maria has 40 cold leads. She spends 25 minutes researching the first merchant, tidies up her CRM, then calls a warm contact who's always friendly. She feels productive. What's actually going on, and what's the best fix?",
    choices: [
      "She's being thorough. Research lowers the risk of a bad call, so she should keep it but cap it at 30 minutes.",
      "Warming up with an easy contact builds momentum. Saving the coldest leads for the afternoon is the right order.",
      "Each substitute task gives her quick relief, and that relief reinforces the avoidance. She should time-box research to 5 minutes and dial before opening email or the CRM.",
      "It's a motivation problem. A bigger daily call target would create the urgency she's missing.",
    ],
    answer: 2,
    explanation:
      "Research past a short cap, CRM cleanup and 'safe' warm calls are classic substitutes, and the relief they bring is what trains the habit. The lesson's fix is a hard boundary: 5 minutes of research, dial before email or CRM, and the coldest leads first thing. Neither more motivation nor a bigger target breaks the loop.",
    lesson: { id: "avoidance-loop", title: "The Avoidance Loop" },
  },
  {
    prompt:
      "A merchant says \"Not interested\" and hangs up mid-sentence. According to the emotion-regulation research in the lessons, which response lowers the sting the most?",
    choices: [
      "Push the feeling down and dial the next number right away, before it can build.",
      "Tell yourself, \"That merchant didn't agree to a conversation today.\"",
      "Tell yourself, \"Doesn't matter, I'm going to crush the next one.\"",
      "Replay the call to find exactly what you did wrong before you dial again.",
    ],
    answer: 1,
    explanation:
      "James Gross's research shows cognitive reappraisal, describing the event accurately, reduces the brain's threat response more than suppressing the feeling (A). Forced positivity (C) is still a prediction, and replaying the call for fault (D) turns one business decision into a story about your ability.",
    lesson: { id: "fear-of-rejection", title: "Fear of Rejection" },
  },
  {
    prompt:
      "Devon made 10 calls: 6 went to voicemail, 3 were short but polite \"not right now\" conversations, and 1 owner was rude. He goes home convinced \"today was terrible.\" Which concept best explains his conclusion?",
    choices: [
      "The impostor phenomenon",
      "The testing effect",
      "Two-factor avoidance learning",
      "The negativity bias",
    ],
    answer: 3,
    explanation:
      "Baumeister's negativity bias: one negative event carries more psychological weight than several neutral or positive ones, so a 9-to-1 day feels like 'a bad day.' The impostor phenomenon is about feeling like a fraud, the testing effect is about recall, and two-factor learning explains why avoidance gets reinforced.",
    lesson: { id: "why-we-hesitate", title: "Why We Hesitate" },
  },
  {
    prompt:
      "Priya knows her pricing well, but when a merchant asks \"So what's your rate?\" she hesitates and hedges. Which preparation does the lesson say will help most?",
    choices: [
      "Re-read the pricing sheet before every call block so the numbers stay fresh.",
      "Say her answers to the 2-3 most common questions out loud before calling, and have one real number ready.",
      "Keep a detailed script on screen that covers every pricing scenario.",
      "Give it time. Confidence on rate questions comes naturally with more months in the role.",
    ],
    answer: 1,
    explanation:
      "The testing effect (Roediger and Karpicke) shows that retrieving and saying information out loud builds fluent recall. Silent re-reading doesn't. Her problem is rehearsal, not knowledge. A full script is a crutch, and tenure alone rarely fixes it: the impostor phenomenon shows up in strong performers too.",
    lesson: { id: "sounding-inexperienced", title: "Fear of Sounding Inexperienced" },
  },
  {
    prompt:
      "Your manager wants one way to judge whether today's call block went well, based on what you actually control. Which is the best measure?",
    choices: [
      "Dials made with your prepared opener, discovery questions asked and follow-ups logged.",
      "Number of merchants who said they were interested.",
      "Number of appointments booked.",
      "Getting through the block without a rude hang-up.",
    ],
    answer: 0,
    explanation:
      "You control preparation, dials, tone, questions, follow-up and reflection. Interest, appointments and a merchant's mood also depend on timing, current contracts and competing priorities, which you don't control. Outcomes still matter, but judging a single block by them punishes you for things outside your control.",
    lesson: { id: "fear-of-rejection", title: "Fear of Rejection" },
  },
];

export const module2Quiz: QuizQuestion[] = [
  {
    prompt:
      "Jordan dials for 90 minutes straight. His notes show the first 25 minutes of calls were sharp; after that his openers got shorter and he started skipping discovery questions. What best explains it, and what's the fix?",
    choices: [
      "Decision fatigue from choosing who to call next. He should move those dials into the midday block.",
      "The vigilance decrement: focus on a monotonous task drops within about 20-30 minutes. He should split the block into 25-minute sprints with a real 5-minute break between them.",
      "Low motivation. A higher daily dial target would keep him pushing through the whole block.",
      "He started with his hardest leads. Opening the block with a few easy callbacks would have kept his energy up.",
    ],
    answer: 1,
    explanation:
      "Mackworth's vigilance research shows attention on effortful, repetitive work reliably fades within 20-30 minutes. The break isn't a reward; it's what lets attention reset. Skipping it is how a 90-minute block turns into 40 minutes of real focus.",
    lesson: { id: "the-call-block", title: "Building Your Call Block" },
  },
  {
    prompt: "Which of these call days follows the lesson's three-block structure?",
    choices: [
      "AM: coldest, highest-friction leads. Midday: fresh prospects from a new list while energy is back after lunch. PM: second pass on AM no-answers.",
      "AM: coldest leads, with quick research and email between dials so nothing piles up. Midday: callbacks and follow-ups. PM: second pass on AM no-answers.",
      "AM: coldest, highest-friction leads. Midday: callbacks and follow-ups only. PM: second pass on AM no-answers.",
      "AM: warm callbacks to build confidence. Midday: coldest leads. PM: second pass on everyone who didn't answer.",
    ],
    answer: 2,
    explanation:
      "The midday block is for callbacks and follow-ups only, with no fresh prospecting, and nothing else happens inside a block: email and research belong before or after it. The coldest leads go first, while willpower is highest.",
    lesson: { id: "the-call-block", title: "Building Your Call Block" },
  },
  {
    prompt:
      "Sam's written target is 35 dials. By 10:30 his first 12 calls were all voicemails or brush-offs, so he lowers today's number to 20 \"to stay realistic.\" According to the lesson, what's the problem?",
    choices: [
      "There isn't one. Adjusting a goal to real conditions is good planning.",
      "He should have set an appointment target instead, since appointments are what really matter.",
      "Shrinking the number on a hard day is exactly how it stops meaning anything. Call 13 doesn't know about the first 12.",
      "He should take a longer break and then reset the target based on how he feels.",
    ],
    answer: 2,
    explanation:
      "A target set from the list, not the mood, only works if it's non-negotiable. Locke and Latham's research shows specific, committed goals drive effort; a number that shrinks when the morning is rough turns back into a 'do your best' goal.",
    lesson: { id: "setting-your-number", title: "Setting a Real Daily Target" },
  },
  {
    prompt:
      "Alex's pre-call routine changes every day. Some days she re-reads account notes, some days she writes a new opener, some days she skips it to save time. She says the variety keeps her fresh. Based on the parole-judge study in the lesson, what's wrong?",
    choices: [
      "Nothing. Varying the routine prevents the vigilance decrement.",
      "Her routine is too short. A proper routine should take at least 20 minutes of preparation.",
      "She should run her routine after the first few dials, once she's warmed up.",
      "Every change brings back decisions right before the dial, when capacity to decide is lowest. The value is in doing the same steps every time.",
    ],
    answer: 3,
    explanation:
      "The judges' favorable rulings fell as each session wore on because their capacity to weigh fresh decisions ran down. A routine works by removing decisions from the moment before a hard dial, and changing it daily recreates exactly those decisions. The vigilance decrement is about sustained attention, not routines.",
    lesson: { id: "the-precall-routine", title: "A Pre-Call Routine That Removes Hesitation" },
  },
  {
    prompt:
      "Three weeks into a new territory, Riley has 0 closed deals but has logged 140 dials, 22 conversations and 9 next steps. Morgan has 2 closed deals (from a warm list they inherited) but has logged 30 dials and no conversations. Who is better positioned for the coming weeks?",
    choices: [
      "Riley. Dials, conversations and next steps are leading indicators of future results; Morgan's deals reflect work done before the territory changed hands.",
      "Morgan. Closed deals are the only number that pays, so they're the best predictor.",
      "They're even. Riley has more activity but Morgan has more results, so it balances out.",
      "There's no way to tell until Riley closes a deal.",
    ],
    answer: 0,
    explanation:
      "Closed deals are lagging indicators: they reflect calls made weeks ago. Riley's logged activity predicts future results and is fully in Riley's control, which, per Deci and Ryan, also sustains motivation better. Morgan's numbers say little about the next month.",
    lesson: { id: "activity-vs-outcome", title: "Track Activity, Not Just Outcomes" },
  },
];

export const module3Quiz: QuizQuestion[] = [
  {
    prompt:
      "Jordan's opener: \"Hi, this is Jordan with Apex Payments, how are you doing today? Great. So Apex has been around for fifteen years and we work with over 4,000 merchants across the Southeast...\" Twenty seconds in, the owner says \"Not interested\" and hangs up. What went wrong?",
    choices: [
      "He didn't build enough rapport before getting to business. The small talk needed more time.",
      "Twenty seconds in, the owner still didn't know why Jordan was calling them. Everything before the reason was time spent deciding without it.",
      "He should have led with the 4,000 merchants. Social proof is the strongest way to open.",
      "He talked too slowly. Speeding up would have fit the whole pitch in before the owner lost interest.",
    ],
    answer: 1,
    explanation:
      "The merchant is silently asking: Who is this? Why are they calling me? Is this worth another thirty seconds? \"How are you today?\" signals a sales call, and a long company introduction delays the one thing that could earn a yes: a reason that's about them. Ambady and Rosenthal's thin-slice research shows those first impressions form fast and stick.",
    lesson: { id: "the-first-ten-seconds", title: "The First Ten Seconds" },
  },
  {
    prompt:
      "Dana finds that several Google reviews for a taqueria mention \"card reader down again, cash only tonight.\" Which reason for calling follows the lesson best?",
    choices: [
      "\"I saw your reviews say your card reader keeps going down, and that's costing you customers.\"",
      "\"We help restaurants lower their processing costs.\" Langer's study showed even an empty reason gets a yes 93% of the time, so any reason will do.",
      "\"I'm calling to see if you're happy with your current processor.\"",
      "\"I noticed a few reviews mention the card reader being down. Owners in that spot are often stuck on older equipment from their processor, and every outage turns into a cash-only night.\"",
    ],
    answer: 3,
    explanation:
      "The observation becomes a likely problem, said as something common rather than an accusation, so the merchant can confirm or correct it. Langer's copy-machine requests were tiny and low-stakes; a merchant on their fifth processing call this week is paying closer attention, so a generic reason gets filed with the others.",
    lesson: { id: "a-reason-about-them", title: "Give Them a Reason That’s About Them" },
  },
  {
    prompt:
      "Priya's opener has a strong reason and a good question, but merchants keep cutting her off. A recording shows she reads it word for word at an even pace, and her voice rises at the end of every sentence: \"It's Priya with "+BRAND.company+"?\" What's the best fix?",
    choices: [
      "Write a longer, more detailed script so she never has to pause or search for words.",
      "Speed up so she reaches the question before the merchant has a chance to interrupt.",
      "Know the three parts well enough to say them in her own words, rehearse out loud, and let her voice come down at the end of her name and reason, saving the rise for the one real question.",
      "Soften the start with \"Sorry to catch you at a busy time\" so the merchant feels respected.",
    ],
    answer: 2,
    explanation:
      "Script voice is a delivery problem: an even pace and a rise at the end of every sentence tell the merchant you're reading, and the rise turns statements into requests for permission. The structure stays; the wording becomes hers through rehearsal. An apology would frame the call as an imposition.",
    lesson: { id: "drop-the-apology", title: "Drop the Apology and the Script Voice" },
  },
  {
    prompt:
      "Marcus is calling a pizzeria owner who just opened a second location. Which closing question fits the lesson best?",
    choices: [
      "\"Did you keep the same processor for both locations?\"",
      "\"Would you be interested in saving money on processing at both locations?\"",
      "\"Do you have a minute to talk about your payment setup?\"",
      "\"What are your biggest challenges with payments right now, and what would the ideal setup look like?\"",
    ],
    answer: 0,
    explanation:
      "A good closing question is specific, about their business, and answerable in about five words. The second is a pitch, the third invites a reflex no, and the fourth takes real thought to answer. Freedman and Fraser's foot-in-the-door research is why the opener aims small: one easy answer makes continuing the conversation the natural next step.",
    lesson: { id: "ask-for-the-next-30-seconds", title: "Ask for the Next 30 Seconds" },
  },
  {
    prompt:
      "After Leah's opener, the owner says: \"We're happy with what we have. We've been with the same processor for eight years and they've been fine.\" Leah writes the call down as a failed opener. Is she right?",
    choices: [
      "Yes. \"We're happy\" means the opener didn't create enough interest.",
      "Yes, but only because she should have asked \"Do you have a minute?\" first to get permission.",
      "No, but only because she can call back in six months when the contract may be up.",
      "No. The owner is talking about their business, which means the opener did its job. That's the handoff to the rest of the call.",
    ],
    answer: 3,
    explanation:
      "The opener's only job is to earn the next thirty seconds. It worked if the merchant is talking about their business, even to say they're happy. It only failed if the call ended before they said anything about their business at all. What happens next is the job of the rest of the call.",
    lesson: { id: "ask-for-the-next-30-seconds", title: "Ask for the Next 30 Seconds" },
  },
];

export const module4Quiz: QuizQuestion[] = [
  {
    prompt:
      "Jess has a list of 30 restaurants and a free hour at 12:00 p.m. What does the lesson suggest?",
    choices: [
      "Call now. Owners are on site at lunch, so you're more likely to reach the decision-maker.",
      "Use the noon hour for something else and call the restaurants in the mid-afternoon lull, roughly 2 to 4 p.m. Calling mid-rush tells the owner you don't know their business.",
      "Call now, but keep each call under 30 seconds so you don't hold them up.",
      "It doesn't matter when you call. A good opener works at any time of day.",
    ],
    answer: 1,
    explanation:
      "Timing is part of relevance. A restaurant owner at 12:15 is in the middle of the rush, and the call itself signals you don't understand their day. Matching the call block to the vertical is the cheapest relevance you'll ever get.",
    lesson: { id: "every-vertical-has-its-own-pain", title: "Every Vertical Has Its Own Pain" },
  },
  {
    prompt:
      "Marco is about to call an HVAC contractor with three service vans. Which opening problem is most likely to be relevant?",
    choices: [
      "Splitting checks and tip adjustments at the end of a shift.",
      "Lower processing rates, since every business wants to save money.",
      "Getting paid on the job instead of chasing invoices after the techs leave.",
      "Inventory that doesn't match what actually sold at the register.",
    ],
    answer: 2,
    explanation:
      "Service businesses in the field usually struggle with getting paid on site, cards on file, and unpaid invoices. Split checks are a restaurant problem, inventory is retail, and lower rates are what every merchant has in common, which is exactly why they don't make anyone lean in.",
    lesson: { id: "every-vertical-has-its-own-pain", title: "Every Vertical Has Its Own Pain" },
  },
  {
    prompt:
      "Which line best follows \"Speak in Their Numbers\" on a first call with a café?",
    choices: [
      "\"We deliver best-in-class efficiency and significant savings across your entire payment stack.\"",
      "\"We'll cut your processing costs by 40%, guaranteed.\"",
      "\"Your average ticket, your monthly volume, your chargeback rate and your tip percentage all improve with us.\"",
      "\"Most cafés your size run around 1,500 to 2,000 transactions a month. Is that close for you?\"",
    ],
    answer: 3,
    explanation:
      "One concrete figure, in the unit the owner already tracks, as a range they can confirm. Hansen and Wänke found concrete wording is judged more likely to be true. The first line is abstract, the second promises savings before seeing a statement, and the third stacks four numbers into a pitch deck.",
    lesson: { id: "speak-in-their-numbers", title: "Speak in Their Numbers" },
  },
  {
    prompt:
      "Priya is calling a nail salon. Her team hasn't set up any salons yet, but she knows the towel study: the closer the comparison, the stronger the effect. What should she say?",
    choices: [
      "\"We just set up a nail salon a few blocks from you.\" It's close enough to true, and it's the strongest comparison.",
      "\"Salons that take bookings online usually tell us no-shows are what hurts most. Are you taking deposits when people book?\"",
      "\"We work with thousands of merchants just like you.\"",
      "Skip examples entirely. Social proof only works when you have a customer to name.",
    ],
    answer: 1,
    explanation:
      "The example only works because it's true; an invented customer is a lie that one follow-up question exposes. With no close match, describe the situation honestly and go back to a question. \"Thousands of merchants\" is the generic hotel sign from Goldstein, Cialdini and Griskevicius's study, the weakest version of the effect.",
    lesson: { id: "lead-with-a-business-like-theirs", title: "Lead With a Business Like Theirs" },
  },
  {
    prompt:
      "A salon owner mentions: \"My front desk types each total into the card machine, and I match the deposits to the booking report every Friday.\" What's the best next move?",
    choices: [
      "Repeat it back in her words and ask how long that takes each week.",
      "Tell her to replace her booking software with yours so everything is in one place.",
      "Promise that your payments will integrate with her booking system so the problem goes away.",
      "Move on to rates, since that's where the real savings are.",
    ],
    answer: 0,
    explanation:
      "Double entry is the clearest sign of an integration problem, and the time it costs is the business case, told in the owner's own words. \"Replace your system\" fights status quo bias (Samuelson and Zeckhauser), and you should never promise an integration you haven't confirmed.",
    lesson: { id: "fit-the-software-they-run", title: "Integrated Payments: Fit the Software They Already Run" },
  },
];

export const module5Quiz: QuizQuestion[] = [
  {
    prompt:
      "Dana gets past the opener with a boutique owner and asks: \"Who do you process with, how long have you been with them, and are you happy with them?\" The owner says \"Square, and it's fine.\" What went wrong?",
    choices: [
      "Nothing. The owner answered, and \"it's fine\" tells Dana there's no opportunity here.",
      "She asked too early. Discovery questions belong at the appointment, not on the cold call.",
      "She stacked three questions, so the owner picked the easiest parts and skipped the rest. One question with a bit of context in front of it would have earned a real answer.",
      "She should have asked about monthly volume first, since that decides whether the account is worth pursuing.",
    ],
    answer: 2,
    explanation:
      "A stacked question lets the merchant answer the easy part and skip the rest. Ask one question, put a short reason in front of it so it feels like it's about their business, then stop talking and let the pause work. Leading with volume is exactly the form-filling that makes discovery feel like an audit.",
    lesson: { id: "discovery-not-interrogation", title: "Discovery Is Not an Interrogation" },
  },
  {
    prompt:
      "Which of these is an impact question, in the sense the lesson uses?",
    choices: [
      "\"When a customer's card gets declined at the counter on a busy Saturday, what does that do to the line and the sale?\"",
      "\"What POS system are you running at the register?\"",
      "\"Wouldn't you agree most merchants your size are overpaying on processing?\"",
      "\"How many terminals do you have across your two locations?\"",
    ],
    answer: 0,
    explanation:
      "Impact questions ask what a problem costs in time, money or customers. The POS and terminal questions are setup questions, which Rackham's research found less successful sellers lean on (and which you can often answer from their website). The \"wouldn't you agree\" line is a pitch with a question mark on the end.",
    lesson: { id: "ask-about-impact", title: "Ask About Impact, Not Just Setup" },
  },
  {
    prompt:
      "A salon owner says: \"Honestly, the last processor was a nightmare. The fees were all over the place.\" What's the best next move?",
    choices: [
      "\"Got it. So how many chairs do you have?\" Keep the call moving through your list.",
      "\"That's exactly why salons switch to us. Our pricing is flat and simple.\"",
      "\"Totally understand. Can I send you some information about our rates?\"",
      "\"All over the place how? Different every month, or just higher than you expected?\"",
    ],
    answer: 3,
    explanation:
      "\"Honestly,\" \"nightmare\" and \"last processor\" are loaded words, and \"all over the place\" needs clarifying. A follow-up built from her own words shows you were listening, which Huang, Brooks and colleagues found is what makes people more likable. Jumping to the next question or straight to a pitch throws away the best material you'll get.",
    lesson: { id: "follow-the-answer", title: "Follow the Answer" },
  },
  {
    prompt:
      "Luis is on with a café owner who has said the delivery apps eat too much of her takeout margin. How should he find out who else is involved in a decision?",
    choices: [
      "\"Are you the decision-maker for payments here?\"",
      "\"Besides you, who else would want to weigh in on something like this?\"",
      "Don't ask. It can offend the owner, so find out at the appointment.",
      "\"Do you need anyone's permission before you can sign up?\"",
    ],
    answer: 1,
    explanation:
      "The lesson's phrasing gets the same information without sounding like you're checking whether she matters, and it helps get everyone who matters into the meeting instead of hearing \"I need to run it by my partner\" afterward. Skipping the question is how that happens.",
    lesson: { id: "what-the-appointment-needs", title: "Know What the Appointment Needs" },
  },
  {
    prompt:
      "Eight minutes in, a contractor has explained that invoices take three weeks to collect, that he and his wife make these decisions together, and that he can pull last month's statement. Sam still has six discovery questions on his list. What should he do?",
    choices: [
      "Work through the remaining six questions so the appointment is fully prepared.",
      "Give him a savings estimate now, based on what he's shared, to make the meeting feel worthwhile.",
      "Stop digging, play back the problem in the contractor's words, and book a time with both him and his wife, statement in hand.",
      "Send a proposal by email instead, since he's clearly interested.",
    ],
    answer: 2,
    explanation:
      "Sam has what the appointment needs: a problem in the merchant's words, who decides, and a statement. More questions risk talking him out of a meeting he's ready to take, and nobody can honestly estimate savings without seeing the statement. The rest of the discovery belongs in the meeting.",
    lesson: { id: "what-the-appointment-needs", title: "Know What the Appointment Needs" },
  },
];

export const module6Quiz: QuizQuestion[] = [
  {
    prompt:
      "Eight seconds into Tasha's call, a pizzeria owner says \"Not interested\" and starts to hang up. What's the best response?",
    choices: [
      "\"I totally get it, but I just need two minutes. We're saving pizzerias like yours thousands a year.\"",
      "\"That's fair, you weren't expecting my call. Before I let you go, when did someone last walk you through your processing statement?\"",
      "\"No problem, have a great day.\" Early objections are final, so move straight to the next dial.",
      "\"Can I ask why? Who do you process with, and when does your contract end?\"",
    ],
    answer: 1,
    explanation:
      "Early \"not interested\" is a reflex, not a verdict. Acknowledge what's true, give a reason, and ask one easy question about their business. Pleading for two minutes with a savings claim is pressure, hanging up gives away a call that hadn't really started, and a stack of questions turns it into an interrogation.",
    lesson: { id: "not-interested", title: "When They Say “Not Interested”" },
  },
  {
    prompt:
      "Ben asked his one question, and the owner said \"Really, I'm not interested\" a second time, politely but firmly. What now?",
    choices: [
      "Try a different angle, since most sales happen after the fifth objection.",
      "Ask for a quick meeting anyway. The worst they can say is no.",
      "Thank them, ask whether it's all right to check back in a few months, and end the call warmly.",
      "Offer a lower rate on the spot to give them a reason to stay on the line.",
    ],
    answer: 2,
    explanation:
      "Pushing past two clear no's rarely turns into an appointment and guarantees a cold reception next time. A warm exit with permission to check back keeps the door open. Offering a rate on the phone is the anchoring mistake from Lesson 4.",
    lesson: { id: "not-interested", title: "When They Say “Not Interested”" },
  },
  {
    prompt:
      "A boutique owner says, \"We're happy with who we have.\" Which response best follows the lesson?",
    choices: [
      "\"Good, that's what you want. No change needed, but if I looked at your last statement, I'd tell you honestly whether you're getting a fair deal. Would that be useful?\"",
      "\"Most people who say that are overpaying and just don't know it yet.\"",
      "\"Your processor is known for hidden fees. You might want to check.\"",
      "\"Okay. Can I send you our pricing sheet so you can compare?\"",
    ],
    answer: 0,
    explanation:
      "Switching feels like a loss, so \"happy\" is a reasonable answer. Agree, then offer a small check-up instead of a switch, the foot-in-the-door idea from Freedman and Fraser. Criticizing their processor or claiming they're overpaying without evidence makes them defend their choice, and a pricing sheet invites a rate comparison you can't make honestly without a statement.",
    lesson: { id: "were-happy", title: "“We’re Happy With Who We Have”" },
  },
  {
    prompt:
      "An auto shop owner says, \"Just send me some information.\" What should Carlos do?",
    choices: [
      "Agree, get the email address, and send the full company brochure right after the call.",
      "Say \"Happy to. So I send something useful, what matters most: what you're paying, how fast you get funded, or how it works with your shop software?\" Then suggest ten minutes later in the week to go over it.",
      "Push back: \"Information won't help you. What you need is a meeting.\"",
      "Tell him you'll send it, then call back tomorrow to ask if he read it.",
    ],
    answer: 1,
    explanation:
      "\"Send me something\" is often a polite exit. Agreeing and then narrowing it tells you which it is: a merchant who's interested will say what matters, and his answer is discovery. Attaching a short, specific next step keeps it moving. A generic brochure gets buried, and pushing back turns a polite request into an argument.",
    lesson: { id: "send-me-information", title: "“Just Send Me Some Information”" },
  },
  {
    prompt:
      "A café owner asks, \"So what's your rate?\" Why shouldn't Nina just answer with a number?",
    choices: [
      "Because quoting rates on the phone is against card-network rules.",
      "Because a higher number makes the product seem more premium.",
      "Because she should always wait for the merchant to name a number first so she can undercut it.",
      "Because what the café really pays depends on its card mix, how cards are taken and its pricing model, and whatever number she says becomes the anchor the owner judges everything against.",
    ],
    answer: 3,
    explanation:
      "The honest comparison is the effective rate (total fees divided by total volume) from a real statement. Tversky and Kahneman showed that even a number people know is random pulls their judgment, so a quoted rate sticks. Offer to work out what the owner really pays now, and ask what they pay today.",
    lesson: { id: "price-resistance", title: "“What’s Your Rate?” and Price Pushback" },
  },
];

export const module7Quiz: QuizQuestion[] = [
  {
    prompt:
      "A salon owner has just explained that no-shows cost her two or three appointments a week. Which is the strongest way for Jamal to ask for the meeting?",
    choices: [
      "\"So, maybe we could find some time to chat at some point, if you're open to it?\"",
      "\"When would be a good time for you to meet?\"",
      "\"So no-shows are costing you two or three appointments a week. We can go through how deposits would work for you in twenty minutes. Would Tuesday at 2:30 or Thursday at 10 be better?\"",
      "\"I'd love to show you our full product line. Do you have an hour sometime next week?\"",
    ],
    answer: 2,
    explanation:
      "It plays back her problem in her words, says what the meeting is and how long it takes, and offers two specific times. The hint leaves her to do the work, \"when would be good?\" hands her an open-ended decision (Iyengar and Lepper's jam study showed more options make deciding harder), and an hour-long product tour isn't about her problem.",
    lesson: { id: "ask-for-the-meeting", title: "Ask for the Meeting" },
  },
  {
    prompt:
      "Priya is one booking short of her weekly target. A retail owner says, \"I'm fine with what we have, but sure, come by if you want. My business partner handles all that anyway.\" What should she do?",
    choices: [
      "Book it. A meeting is a meeting, and the target matters.",
      "Book it as a \"free audit, no strings\" so the owner is more likely to show up.",
      "Hang up. Without the decision-maker on the call, there's nothing to do.",
      "Don't call it booked yet. There's no problem in the owner's words and the partner who decides isn't involved. Ask about the partner and what, if anything, they'd want to change.",
    ],
    answer: 3,
    explanation:
      "A qualified appointment has a real reason and the right people. This one has neither yet, so it would likely end in \"let me think about it\" and cost the person running it an hour. Describing a sales meeting as something softer is dishonest, and hanging up throws away a chance to reach the partner.",
    lesson: { id: "qualified-appointment", title: "What Makes an Appointment Qualified" },
  },
  {
    prompt:
      "A contractor wants to meet but mentions he's got eight months left on his processing contract, with an early-termination fee. What's the right call?",
    choices: [
      "Book it, and make sure the contract end date and fee are in the handoff note so the meeting can plan around them.",
      "Don't book it. Anyone under contract is disqualified.",
      "Book it, but leave the contract out of the notes so the meeting starts on a positive note.",
      "Tell him you'll cover the termination fee so the contract isn't an issue.",
    ],
    answer: 0,
    explanation:
      "Timing issues aren't automatically deal-breakers. He may want to know what he's paying and plan for the change. What matters is that everyone knows going in. Hiding it surprises the person running the meeting, and promising to cover a fee you can't commit to is a promise the meeting inherits.",
    lesson: { id: "qualified-appointment", title: "What Makes an Appointment Qualified" },
  },
  {
    prompt:
      "Marcus just got a yes for Thursday at 10. What should he do before he hangs up?",
    choices: [
      "Thank the owner and hang up quickly, before they change their mind.",
      "Ask the owner to put it in their calendar now, then confirm the day and time, where it happens, who'll be there, and that they'll have a statement ready.",
      "Tell the owner he'll email the details sometime this week.",
      "Recap the full pitch so the owner remembers why they agreed.",
    ],
    answer: 1,
    explanation:
      "Specific plans get kept. Gollwitzer's research on implementation intentions and Milkman's flu-shot study both found that spelling out when and where raises follow-through. Details sent \"sometime this week\" are easy to lose, and re-pitching after a yes gives them a reason to reconsider.",
    lesson: { id: "make-it-stick", title: "Make It Stick" },
  },
  {
    prompt:
      "On the call, Dana promised the café owner the meeting would take twenty minutes and that he'd hear honestly if he was already in good shape. What should her handoff note include?",
    choices: [
      "Just the owner's name, phone number and meeting time. The closer will run discovery again.",
      "A general note that the owner is \"interested in lower rates.\"",
      "The owner's problem in his own words, who's coming and who decides, the statement, timing, any bad past experiences, and both promises: twenty minutes, and an honest answer.",
      "Only the problem. Promises are between Dana and the owner.",
    ],
    answer: 2,
    explanation:
      "A good handoff means the merchant never has to repeat himself, and every promise made on the call travels with the appointment. If the meeting runs long or turns into pressure, the owner learns your team can't be trusted.",
    lesson: { id: "the-handoff", title: "Hand It Off Well" },
  },
];

export const module8Quiz: QuizQuestion[] = [
  {
    prompt:
      "A florist told Kim in October, \"Call me after Valentine's Day. February is our busiest month, and our contract's up in April.\" What's the best follow-up plan?",
    choices: [
      "Call every week anyway, so she doesn't forget who Kim is.",
      "Note her words, the April contract end and the timing she gave, then reach out the week after Valentine's Day with a reason tied to the renewal.",
      "Mark her as not interested. If she wanted to talk, she'd have booked a meeting.",
      "Send a monthly newsletter until she calls back.",
    ],
    answer: 1,
    explanation:
      "\"Not right now\" is usually about timing. She told Kim exactly when to call and why, so following her timeline shows he listened and gives the next call a real reason. Weekly calls are chasing, writing her off hands the opportunity to whoever calls in February, and a generic newsletter gives her nothing.",
    lesson: { id: "yes-comes-later", title: "Most Yeses Come Later" },
  },
  {
    prompt:
      "Which of these follow-up emails best follows the lesson?",
    choices: [
      "\"Hi Tom, just checking in to see if you've had a chance to think about our conversation.\"",
      "\"Hi Tom, touching base! Let me know if you have any questions.\"",
      "\"Hi Tom, when we spoke last month you said the monthly fees seemed to change without explanation. I looked into how that usually happens and wrote up a short summary. Would ten minutes next week be useful to go through one of your statements?\"",
      "\"Hi Tom, we're offering our lowest rates of the year this month only. Reply today to lock yours in.\"",
    ],
    answer: 2,
    explanation:
      "It opens with Tom's own words, gives him something useful, and ends with one small ask. \"Just checking in\" and \"touching base\" ask for his attention and give nothing back, and a limited-time rate offer is pressure plus a quoted rate from Module 6.",
    lesson: { id: "give-them-a-reason", title: "Give Them a Reason to Hear From You" },
  },
  {
    prompt:
      "In Dennis Regan's 1971 study, participants who were given an unrequested Coke bought about twice as many raffle tickets. What's the lesson for follow-up?",
    choices: [
      "Send merchants small gifts so they feel obligated to meet.",
      "Useful follow-ups make people want to give something back, so every contact should give the merchant something of value before it asks for anything.",
      "Follow-ups should always include a special offer.",
      "People only respond to follow-ups that arrive in person.",
    ],
    answer: 1,
    explanation:
      "A small, unrequested favor made people want to reciprocate. For follow-up, the \"favor\" is value: an answer to a question they asked, something relevant to their business, or a timely reminder. It's not about gifts or obligation, and it only works if what you give is genuinely useful.",
    lesson: { id: "give-them-a-reason", title: "Give Them a Reason to Hear From You" },
  },
  {
    prompt:
      "Andre had a good call with a hardware store owner who said, \"Maybe later this year.\" There's no specific date. Which cadence fits the lesson?",
    choices: [
      "A follow-up in a few days, then a week or two later, then monthly, mixing a call, an email and a voicemail that points to the email, and logging each contact with a next step and date.",
      "Call every day at the same time until the owner picks up.",
      "Wait six months, then call and start the conversation over.",
      "Send the same email every Monday so it becomes routine.",
    ],
    answer: 0,
    explanation:
      "With no set date, start closer together and spread out over time, use the channel that suits each message, and write down every contact so nothing depends on memory. Daily calls are chasing, six months of silence means starting from scratch, and the same email every week is noise.",
    lesson: { id: "a-cadence-you-can-keep", title: "Build a Cadence You Can Keep" },
  },
  {
    prompt:
      "A salon owner answers Leah's third follow-up with, \"Please stop calling. We're not interested.\" What should Leah do?",
    choices: [
      "Try one more time next month with a better offer, since circumstances change.",
      "Have a teammate call instead, since the request was made to Leah.",
      "Stop, thank her, mark the salon do-not-call right away so nobody on the team calls, and follow the company's do-not-call policy.",
      "Send a long email explaining why she's making a mistake.",
    ],
    answer: 2,
    explanation:
      "A clear request to stop is honored, immediately and for the whole team. There's no clever way around it, and trying one turns a neutral merchant into one who warns other owners about you. Stopping gracefully is part of following up well.",
    lesson: { id: "close-the-file", title: "Know When to Close the File" },
  },
];

export type ModuleQuiz = {
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  next: { href: string; label: string };
  // Overrides for the final exam: its own eyebrow label and pass mark.
  label?: string;
  passMark?: number;
};

export const module9Quiz: QuizQuestion[] = [
  {
    prompt:
      "Dana finished both call blocks today, made 70 dials, sent every follow-up that was due, and logged every call. She booked zero appointments. A gatekeeper gave her an owner's name, and one merchant agreed to dig out a statement. How should she judge her day?",
    choices: [
      "As a bad day. Appointments are what the company pays for, so that's the only number that counts.",
      "As a sign the effort isn't paying off, so she should lower tomorrow's dial goal and save her energy.",
      "As a good day. She did her part well, and the owner's name and the statement are real small wins worth writing down.",
      "As a reason to double tomorrow's dials until the appointments show up.",
    ],
    answer: 2,
    explanation:
      "Who answers and who's ready isn't hers to control. Dials, follow-ups and logging are, and she hit all of them. Amabile and Kramer found that small steps of progress are what make a workday feel good, so noticing them keeps her coming back tomorrow. Judging the day only by appointments makes most days feel like losing, and doubling or cutting dials reacts to a single day's outcome.",
    lesson: { id: "work-the-inputs", title: "Work the Part You Control" },
  },
  {
    prompt:
      "Marcus's week: 300 dials, 12 decision-maker conversations, 4 appointments booked, 4 held. Where should he look first?",
    choices: [
      "The dials-to-conversations step. One conversation per 25 dials points to his list or the time of day he's calling.",
      "His opener and how he asks for the meeting, since that's where most reps lose appointments.",
      "His show rate. He should confirm appointments the day before.",
      "Nowhere in particular. He should just work harder at every step.",
    ],
    answer: 0,
    explanation:
      "His ratios show the leak. One in three conversations becomes an appointment, and every booked appointment was held, so those steps are fine. Reaching a decision-maker only once every 25 dials is where he's losing ground, and that usually means the list or the calling times. Fixing the right step is faster than working harder at all of them.",
    lesson: { id: "keep-honest-score", title: "Keep Honest Score" },
  },
  {
    prompt:
      "Priya counts voicemails as conversations and \"call me next week\" as appointments booked. Her numbers look great. What's the real cost?",
    choices: [
      "None. It keeps her motivated, and motivation drives results.",
      "Her ratios stop meaning anything, so when results drop she can't find which step is actually leaking.",
      "It's only a problem if her manager checks the CRM.",
      "Voicemails should count as conversations, since she did reach the business.",
    ],
    answer: 1,
    explanation:
      "Monitoring progress helps people reach goals (Harkin's review of 138 studies), but only if the score is true. Rounding up feels better for a day, then hides the real problem. A voicemail isn't a conversation, and \"call me next week\" isn't an appointment. An honest bad week is useful. A flattering one isn't.",
    lesson: { id: "keep-honest-score", title: "Keep Honest Score" },
  },
  {
    prompt:
      "Three weeks ago Leo started dialing his first number by 9:05, before opening email. It still doesn't feel automatic, and on Tuesday a training session knocked out his morning block. What should he do?",
    choices: [
      "Accept that the habit didn't take. If it isn't automatic after 21 days, it won't be.",
      "Start the count over from day one next Monday.",
      "Make the habit bigger, a full great call block every morning, to make up for lost time.",
      "Get the next block in. Habits take about 66 days on average, and one missed day doesn't undo the progress. Just don't miss twice.",
    ],
    answer: 3,
    explanation:
      "Lally's study found habits took 66 days on average to become automatic, anywhere from 18 to 254, and a single missed day didn't break them. The 21-day idea isn't what the research shows. \"Start fresh Monday\" turns one missed day into several, and a bigger habit is harder to keep on a bad morning. The first dial is the part to protect.",
    lesson: { id: "habits-that-hold", title: "Build Habits That Hold" },
  },
  {
    prompt:
      "After a week with no appointments, which explanation will help Sam most?",
    choices: [
      "\"I'm just not cut out for the phone.\"",
      "\"Nothing works in this market right now. Merchants aren't buying.\"",
      "\"This week I stopped asking for the meeting after a couple of no's. Next week I'll ask on every good call.\"",
      "\"It was bad luck. Next week will be better on its own.\"",
    ],
    answer: 2,
    explanation:
      "Seligman and Schulman found that how agents explained setbacks predicted how much they sold and whether they quit. The best explanation is temporary (this week), specific (one step), about something Sam did that can change, and ends in an action. \"Not cut out for this\" is permanent, \"nothing works\" covers everything, and \"bad luck\" is cheerful but gives him nothing to do.",
    lesson: { id: "bounce-back", title: "Bounce Back From a Bad Week" },
  },
];

export const module10Quiz: QuizQuestion[] = [
  {
    prompt:
      "Alex calls a busy hair salon at 5:30 p.m. The receptionist answers while checking out a client, with two more waiting. What's his best move?",
    choices: [
      "Get to the point fast and ask for the owner before she has a chance to say no.",
      "Say it sounds like a busy moment, ask who he's speaking with, and ask when a quieter time to call back would be.",
      "Pitch her instead, since she probably runs the card machine anyway.",
      "Hang up and try again in ten minutes without saying anything.",
    ],
    answer: 1,
    explanation:
      "The person who answers has seconds, not minutes. Noticing that before she has to say it makes him the rep who was easy to deal with, and learning her name means the next call starts warmer. Rushing past her treats her as an obstacle, pitching her skips the decision-maker, and silently calling back leaves her no reason to remember him.",
    lesson: { id: "whos-answering", title: "Who’s Really Answering the Phone" },
  },
  {
    prompt:
      "Which of these is the best way to introduce yourself to the host at a restaurant?",
    choices: [
      "\"Hi, is Maria there? It's personal.\"",
      "\"Hi, I'm returning Maria's call.\"",
      "\"Hi, I'm a customer and I had a problem with a charge. Can I talk to the owner?\"",
      "\"Hi, this is Alex with "+BRAND.company+". I help restaurants around here figure out what they're really paying to take cards. Who am I speaking with?\"",
    ],
    answer: 3,
    explanation:
      "Name, company, an honest reason about their business, and a request for the host's name. The other three are pretexts. Even when one works, the owner picks up already knowing they were tricked. Schweitzer, Hershey and Bradlow found that trust broken by a lie never fully recovers, even after apologies.",
    lesson: { id: "be-straight", title: "Be Straight About Who You Are" },
  },
  {
    prompt:
      "The office manager at a dental practice asks, \"What's this regarding?\" What should the rep say?",
    choices: [
      "\"I help dental offices check whether their card processing fees make sense. I'd like to offer Dr. Patel a quick look at a recent statement.\"",
      "\"Just a business matter. Is she available?\"",
      "\"It's easier if I explain it to her directly.\"",
      "\"We're offering dental offices our lowest rate of the year, but only this month.\"",
    ],
    answer: 0,
    explanation:
      "It's a fair question, and a specific, honest answer gives her something to pass along. Vague answers sound like you're hiding something, and \"easier to explain to her directly\" tells the office manager she isn't worth an answer. A limited-time rate is pressure plus a quoted rate, which Module 6 warns against.",
    lesson: { id: "be-straight", title: "Be Straight About Who You Are" },
  },
  {
    prompt:
      "Which question to the person who answers is most likely to move the call forward?",
    choices: [
      "\"Is the owner available?\"",
      "\"Can you put me through to whoever's in charge?\"",
      "\"Who usually looks after the card processing there, and when's a good time to catch them for two minutes?\"",
      "\"I really need to speak with the decision-maker. It's important.\"",
    ],
    answer: 2,
    explanation:
      "\"Is the owner available?\" and \"put me through\" ask for access, and no is the safe answer. Asking who and when asks for help, and people agree to help far more often than we expect: Flynn and Lake found people guessed they'd need to ask about twice as many strangers as they actually did. Insisting it's important just sounds like pressure.",
    lesson: { id: "ask-for-help", title: "Ask for Help, Not Access" },
  },
  {
    prompt:
      "Last week Jenna, the host, told Alex the owner is easier to reach on Tuesdays after 2. It's Tuesday at 2:30. How should he open the call?",
    choices: [
      "\"Hi, can I speak to the owner, please?\"",
      "\"Hi Jenna, it's Alex with "+BRAND.company+". You mentioned Tuesdays after two are quieter, so here I am. Is Maria around?\"",
      "\"Hi, it's Alex. The owner's expecting my call.\"",
      "\"Hi, I called last week. Did anyone give Maria my message?\"",
    ],
    answer: 1,
    explanation:
      "He uses Jenna's name, shows he took her advice, and picks up where they left off. Being remembered is rare in a week of sales calls, and a gatekeeper whose advice you followed is more likely to help again. Starting from scratch wastes the relationship, \"expecting my call\" is a pretext, and asking whether she passed on the message puts her on the spot.",
    lesson: { id: "make-an-ally", title: "Turn Gatekeepers Into Allies" },
  },
];

export const module11Quiz: QuizQuestion[] = [
  {
    prompt:
      "Alex calls a pizzeria at 2:45 p.m. The owner says, \"Look, we're happy with who we have.\" What's his best next line?",
    choices: [
      "\"A lot of owners think that until they see what they're really paying.\"",
      "\"I can beat whatever rate you're on today. What are you paying?\"",
      "\"Good, that's what you want. Out of curiosity, do you know roughly what a $30 delivery order actually nets you?\"",
      "\"No problem. I'll send you some information and you can look at it when you have time.\"",
    ],
    answer: 2,
    explanation:
      "He takes the owner at their word, then asks one easy question with a number in the owner's own terms. Hinting that the owner is wrong attacks their decision, promising to beat an unknown rate is a guess, and a brochure ends the call with nothing learned.",
    lesson: { id: "restaurant-lab", title: "Lab: The Neighborhood Pizzeria" },
  },
  {
    prompt:
      "Alex calls a running shop at 10:15 a.m. The manager says the owner isn't in until noon. What gives Alex the best chance of booking a meeting?",
    choices: [
      "Ask the manager something he knows first-hand, like whether both stores run on the same register system, then ask when the owner is easiest to reach.",
      "Thank him and hang up, since only the owner can make the decision.",
      "Pitch the manager so he can sell the owner on it later.",
      "Ask for the owner's cell phone number so he can reach her directly.",
    ],
    answer: 0,
    explanation:
      "The manager knew exactly where it hurt: he adds up two stores by hand every Sunday. That gave Alex a reason about the business, credited to someone the owner trusts, and the best time to call. Hanging up wastes the call, pitching the manager skips the decision-maker, and asking for a personal number asks for access instead of help.",
    lesson: { id: "retail-lab", title: "Lab: The Two-Store Retailer" },
  },
  {
    prompt:
      "Kerr and Booth had one group of children practice tossing beanbags only from three feet, and another only from two and four feet. Tested from three feet, the varied group was more accurate. What does that mean for practicing calls?",
    choices: [
      "Practice only the vertical you call most, since that's the call you need to get right.",
      "Practice doesn't matter much. Live calls are the only real practice.",
      "Practice your opener until it's word-perfect, then use the same one for every business.",
      "Practicing calls across different verticals makes you better at each one, including the one you call every day.",
    ],
    answer: 3,
    explanation:
      "Varied practice beat practice at the exact target distance. Rehearsing the restaurant, the shop, the repair bay and the online store builds skill that carries over to all of them. Only practicing one kind of call, or one script, is the three-feet-only group.",
    lesson: { id: "retail-lab", title: "Lab: The Two-Store Retailer" },
  },
  {
    prompt:
      "An auto shop owner picks up and says, \"What's your rate?\" What should Alex say?",
    choices: [
      "Quote a low rate to get the owner's attention, and explain the details later.",
      "\"Anyone who quotes you a rate without seeing your statement is guessing, because it depends on your mix of cards and how many are keyed in versus tapped. Do you take a lot of cards over the phone?\"",
      "\"I can't discuss pricing on the phone. Can we set up a meeting?\"",
      "Offer a discount right away so the owner doesn't hang up.",
    ],
    answer: 1,
    explanation:
      "He explains honestly why a quoted rate would be a guess, then turns the question into discovery. Keyed-in payments led straight to the reason for a statement review. A quoted rate becomes the anchor for everything after it, refusing to talk sounds evasive, and a phone discount gives away value before he knows anything.",
    lesson: { id: "service-lab", title: "Lab: The Auto Repair Shop" },
  },
  {
    prompt:
      "Alex listens back to a practice call. He froze when the merchant said \"not interested.\" Based on Kluger and DeNisi's research on feedback, which note will help him most?",
    choices: [
      "\"I'm just not good at handling rejection.\"",
      "\"That call was terrible. I need to be more confident.\"",
      "\"I paused, but didn't acknowledge it. Next time: 'That's fair, you weren't expecting my call,' then one easy question.\"",
      "\"The merchant was rude. Nothing would have worked.\"",
    ],
    answer: 2,
    explanation:
      "Kluger and DeNisi found that feedback made performance worse in about a third of cases, mostly when it pulled attention toward the person instead of the task. A note about a specific move he can fix keeps his attention on the task. Notes about his talent or the merchant don't give him anything to change.",
    lesson: { id: "ecommerce-lab", title: "Lab: The Online Store" },
  },
];

// Module 12's final exam: one scenario question from each of Modules 1-10.
// Each lesson link names its own module, since none of them are in Module 12.
export const finalExam: QuizQuestion[] = [
  {
    prompt:
      "It's 9:00 and Alex's call block has started. He's spent the last 40 minutes researching his first five merchants and tidying up his CRM, and hasn't dialed yet. What's going on, and what's the fix?",
    choices: [
      "Good preparation. Research every lead thoroughly before dialing, however long it takes.",
      "The avoidance loop: busy work that relieves the discomfort of dialing. Cap research at five minutes and dial before touching anything else.",
      "He's tired. He should take a break and start the block in the afternoon.",
      "He isn't motivated enough. He should wait until he feels ready, then make all his calls at once.",
    ],
    answer: 1,
    explanation:
      "Research and CRM cleanup feel productive, and the relief they bring trains the brain to keep avoiding the dial. The loop isn't broken by willpower or waiting to feel ready. It's broken by a hard boundary: a five-minute research cap and dialing first.",
    lesson: { id: "avoidance-loop", title: "The Avoidance Loop", moduleSlug: "understanding-call-reluctance" },
  },
  {
    prompt:
      "Alex set a target of 50 dials today. His first ten calls all go badly. What should he do with the number?",
    choices: [
      "Lower it to 30, since today clearly isn't a good day.",
      "Drop the number and make calls until he feels the day turn around.",
      "Switch to calling only warm leads for the rest of the day.",
      "Keep it. The eleventh call doesn't know about the first ten, and shrinking the number on hard days is how it stops meaning anything.",
    ],
    answer: 3,
    explanation:
      "The target is set from the list, not from how the morning feels. Locke and Latham's research found specific goals beat vague ones, and a number that shrinks whenever the morning goes badly turns back into a vague one.",
    lesson: { id: "setting-your-number", title: "Setting a Real Daily Target", moduleSlug: "preparing-to-make-calls" },
  },
  {
    prompt: "Which opener is the strongest?",
    choices: [
      "\"Hi Maria, this is Alex with "+BRAND.company+". I saw you opened a second location this spring. Did you keep the same processor for both?\"",
      "\"Hi, sorry to bother you, I know you're busy. Do you have a minute to talk about your credit card processing?\"",
      "\"Hi Maria, how are you today? I'm calling because we're offering great rates on processing this month.\"",
      "\"Hi, this is Alex. Would you like to save money on your processing fees?\"",
    ],
    answer: 0,
    explanation:
      "Name, company, a reason that's about her business, and an easy question she can answer in a few words. The others apologize, invite a reflex no, or pitch before earning the right to.",
    lesson: { id: "a-reason-about-them", title: "Give Them a Reason That’s About Them", moduleSlug: "opening-the-conversation" },
  },
  {
    prompt:
      "Alex wants a restaurant owner to picture what faster funding would mean. Which line does that best?",
    choices: [
      "\"We offer industry-leading funding speed.\"",
      "\"Faster funding improves your cash flow and efficiency.\"",
      "\"The money from Friday's dinner service would be in your account Saturday instead of Tuesday.\"",
      "\"We're one of the fastest processors in the country.\"",
    ],
    answer: 2,
    explanation:
      "Concrete language in the merchant's own terms is easier to picture and more believable. Hansen and Wänke found people rated the same claim as more likely to be true when it was put concretely. The other three are abstract claims the owner can't check against their own business.",
    lesson: { id: "speak-in-their-numbers", title: "Speak in Their Numbers", moduleSlug: "earning-attention" },
  },
  {
    prompt:
      "In discovery, a store owner says, \"Honestly, the fees are all over the place.\" What's Alex's best next question?",
    choices: [
      "\"Got it. Next question: how many terminals do you have?\"",
      "\"All over the place how? Different every month, or just higher than you expected?\"",
      "\"That's exactly why you should switch to us.\"",
      "\"What's your current rate?\"",
    ],
    answer: 1,
    explanation:
      "\"Honestly\" and \"all over the place\" signal a real frustration. A follow-up that clarifies their words shows he was listening and tells him far more than his next scripted question. Huang and colleagues found follow-up questions are what make people like the person asking.",
    lesson: { id: "follow-the-answer", title: "Follow the Answer", moduleSlug: "discovery-questions" },
  },
  {
    prompt:
      "A merchant tells Alex, \"You're too expensive.\" What's the best response?",
    choices: [
      "\"Too expensive compared to what?\" Then compare total cost, not headline rates.",
      "Offer a discount on the spot so the call doesn't end.",
      "Quote a lower rate than whatever they mentioned.",
      "Tell them their current processor is probably overcharging them.",
    ],
    answer: 0,
    explanation:
      "Often they're comparing against a teaser rate or a flat-rate reader. Asking what they're comparing to, then comparing total cost from a real statement, is honest and useful. A phone discount or a lower quoted rate competes on a number he hasn't earned the right to quote, and attacking their processor attacks their decision.",
    lesson: { id: "price-resistance", title: "“What’s Your Rate?” and Price Pushback", moduleSlug: "handling-objections" },
  },
  {
    prompt: "Which of these appointments is qualified?",
    choices: [
      "The owner said he's \"open to a look sometime,\" and Alex booked Thursday.",
      "The cashier agreed to meet, since the owner is hard to reach.",
      "The owner agreed to meet but has no recent statement and doesn't want to look for one.",
      "The owner said fees jump every month and she doesn't know why. She and her bookkeeper will both be there Thursday at 3, with last month's statement.",
    ],
    answer: 3,
    explanation:
      "A qualified appointment has a reason in the merchant's own words, the right people in the room, a recent statement so the meeting deals in real numbers, and nothing hidden that would block a change. The others are missing a real reason, the decision-maker, or the statement.",
    lesson: { id: "qualified-appointment", title: "What Makes an Appointment Qualified", moduleSlug: "booking-appointments" },
  },
  {
    prompt:
      "Alex has followed up with a merchant five times over two months, each time with something useful, and has never heard back. What now?",
    choices: [
      "Keep calling every few days until someone answers.",
      "Stop without saying anything and remove them from his list for good.",
      "Send a short, honest last note saying he'll stop reaching out, and that he's happy to help if anything changes. Then actually stop.",
      "Have a teammate call them pretending to be a new rep.",
    ],
    answer: 2,
    explanation:
      "Good follow-up has an end. An honest closing note often gets the reply nothing else did, leaves the door open, and ends on good terms. Chasing damages his reputation, disappearing wastes the relationship, and a pretext is never okay.",
    lesson: { id: "close-the-file", title: "Know When to Close the File", moduleSlug: "follow-up" },
  },
  {
    prompt: "Which daily goal follows what the course teaches about activity?",
    choices: [
      "Two call blocks and 60 dials a day, tracking appointments each week to learn what's working.",
      "Book three appointments a day, no matter what.",
      "Make calls until the day feels productive.",
      "Only call the leads most likely to say yes, so the numbers look good.",
    ],
    answer: 0,
    explanation:
      "Set daily goals for the inputs you control: blocks and dials. Appointments are worth tracking to learn from, but they depend partly on the merchant, so they make a poor daily target. A feeling isn't a goal, and only calling easy leads makes the numbers dishonest.",
    lesson: { id: "work-the-inputs", title: "Work the Part You Control", moduleSlug: "activity-mindset" },
  },
  {
    prompt:
      "The office manager at a dental practice asks, \"What's this regarding?\" What should Alex say?",
    choices: [
      "\"It's a personal matter for Dr. Moss.\"",
      "\"I'd like to offer Dr. Moss a quick look at the practice's processing statement, to see whether the fees make sense. Who usually handles that?\"",
      "\"Just a business matter. Is she available?\"",
      "\"She's expecting my call.\"",
    ],
    answer: 1,
    explanation:
      "A specific, honest answer gives the office manager something to pass along, and asking who handles it turns her into a guide. The others are pretexts or vague dodges. Even when one works, the owner picks up already knowing she was tricked.",
    lesson: { id: "be-straight", title: "Be Straight About Who You Are", moduleSlug: "gatekeepers" },
  },
];

export const quizzes: Record<string, ModuleQuiz> = {
  "understanding-call-reluctance": {
    moduleNumber: 1,
    moduleSlug: "understanding-call-reluctance",
    moduleTitle: "Understanding Call Reluctance",
    questions: module1Quiz,
    next: { href: "/courses/preparing-to-make-calls", label: "Continue to Module 2" },
  },
  "preparing-to-make-calls": {
    moduleNumber: 2,
    moduleSlug: "preparing-to-make-calls",
    moduleTitle: "Preparing to Make Calls",
    questions: module2Quiz,
    next: { href: "/courses/opening-the-conversation", label: "Continue to Module 3" },
  },
  "opening-the-conversation": {
    moduleNumber: 3,
    moduleSlug: "opening-the-conversation",
    moduleTitle: "Opening the Conversation",
    questions: module3Quiz,
    next: { href: "/courses", label: "Back to all modules" },
  },
  "earning-attention": {
    moduleNumber: 4,
    moduleSlug: "earning-attention",
    moduleTitle: "Earning the Merchant's Attention",
    questions: module4Quiz,
    next: { href: "/courses/discovery-questions", label: "Continue to Module 5" },
  },
  "discovery-questions": {
    moduleNumber: 5,
    moduleSlug: "discovery-questions",
    moduleTitle: "Discovery That Creates Value",
    questions: module5Quiz,
    next: { href: "/courses/handling-objections", label: "Continue to Module 6" },
  },
  "handling-objections": {
    moduleNumber: 6,
    moduleSlug: "handling-objections",
    moduleTitle: "Handling Common Objections",
    questions: module6Quiz,
    next: { href: "/courses/booking-appointments", label: "Continue to Module 7" },
  },
  "booking-appointments": {
    moduleNumber: 7,
    moduleSlug: "booking-appointments",
    moduleTitle: "Booking Qualified Appointments",
    questions: module7Quiz,
    next: { href: "/courses/follow-up", label: "Continue to Module 8" },
  },
  "follow-up": {
    moduleNumber: 8,
    moduleSlug: "follow-up",
    moduleTitle: "Follow-Up Without Chasing",
    questions: module8Quiz,
    next: { href: "/courses/activity-mindset", label: "Continue to Module 9" },
  },
  "activity-mindset": {
    moduleNumber: 9,
    moduleSlug: "activity-mindset",
    moduleTitle: "Activity, Mindset & Consistency",
    questions: module9Quiz,
    next: { href: "/courses/gatekeepers", label: "Continue to Module 10" },
  },
  gatekeepers: {
    moduleNumber: 10,
    moduleSlug: "gatekeepers",
    moduleTitle: "Working With Gatekeepers",
    questions: module10Quiz,
    next: { href: "/courses/vertical-practice", label: "Continue to Module 11" },
  },
  "vertical-practice": {
    moduleNumber: 11,
    moduleSlug: "vertical-practice",
    moduleTitle: "Vertical Call Labs",
    questions: module11Quiz,
    next: { href: "/courses/certification", label: "Continue to Module 12" },
  },
  certification: {
    moduleNumber: 12,
    moduleSlug: "certification",
    moduleTitle: "Appointment-Setter Certification: Final Exam",
    questions: finalExam,
    next: { href: "/practice/action-plan", label: "Continue to your 30-day action plan" },
    label: "Module 12 final exam",
    passMark: 8,
  },
};

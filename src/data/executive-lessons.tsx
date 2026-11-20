import Image from "next/image";
import type { ReactNode } from "react";

// Module 13, "Consultative Selling to Executives (NEPQ)": lesson content.
//
// Adapted from the Kadima NEPQ Sales Playbook for Credit Card Processing
// Services (C-Level Edition) by Moshe Maghboule. The lesson page merges this
// record into its own (see courses/[slug]/lessons/[lesson]/page.tsx).
//
// The playbook's sample lines are kept close to the original, but wherever one
// leans on a claim the rep can't back up (a savings percentage, a customer
// result, a service promise), the lesson says so. That keeps this module
// consistent with the rest of the academy: no invented numbers, no promised
// savings, and only real examples.

export type LessonContent = { kicker: string; title: string; lead: string; body: ReactNode; image?: string; image2?: string; image3?: string };

// A line the rep could say out loud.
const Say = ({ children }: { children: ReactNode }) => <div className="say">{children}</div>;

// A full-width illustration inside a lesson body (same look as the lesson page's own LessonFigure).
const Figure = ({ src, alt, caption }: { src: string; alt: string; caption?: string }) => (
  <figure className="lesson-figure">
    {/* Opens full size in a new tab, so small text stays readable on a phone. */}
    <a href={src} target="_blank" rel="noopener noreferrer">
      <Image src={src} alt={alt} width={1672} height={941} sizes="(max-width: 900px) 100vw, 760px" style={{ width: "100%", height: "auto", borderRadius: 12, boxShadow: "0 10px 30px rgba(10,11,10,.15)" }} />
    </a>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

const TOTAL = 9;

export const executiveLessons: Record<string, LessonContent> = {
  "nepq-roadmap": {
    kicker: `Lesson 1 of ${TOTAL}`,
    title: "Selling to the Executive’s World",
    lead: "A CEO, CFO or COO doesn’t want a product pitch. They want to know whether you understand their business well enough to help with it.",
    body: <>
      <h2>The lesson at a glance</h2>
      <Figure
        src="/lesson-nepq-roadmap-summary.webp"
        alt="Infographic titled Selling to the Executive’s World. NEPQ, Neuro-Emotional Persuasion Questioning, is a sequence of questions that moves an executive from connecting with you to committing to a next step, without a pitch in the middle. The six stages are Connecting, Situation, Problem awareness, Solution awareness, Consequence and Commitment. A banner at the bottom reads Open with insight, not a pitch, with a sample opener for a retail CFO."
        caption="The six NEPQ stages in order. Tap the image to enlarge it. Use the sample opener only if it’s true for you."
      />
      <h2>A conversation about their world</h2>
      <p>Modules 3 to 7 taught you to earn a first conversation and turn it into an appointment. This module is about what happens when an executive is on the other side of the table. The approach is consultative and low-pressure: you ask questions that help them see their own needs, and then see whether your service is a fit.</p>
      <p>That approach is called NEPQ, Neuro-Emotional Persuasion Questioning. It is a sequence of questions that moves an executive from connecting with you to committing to a next step, without a pitch in the middle.</p>
      <blockquote>When the executive says the problem out loud, it’s compelling. When you say it, it’s a sales pitch.</blockquote>
      <h2>The six stages</h2>
      <ul>
        <li><b>Connecting.</b> Show real curiosity about them and their business, so they relax and open up.</li>
        <li><b>Situation.</b> Learn how payments work for them today: provider, volume, fees, integrations.</li>
        <li><b>Problem awareness.</b> Ask questions that let them name what frustrates them.</li>
        <li><b>Solution awareness.</b> Ask what a better setup would look like, in their own words.</li>
        <li><b>Consequence.</b> Ask what it costs them if nothing changes.</li>
        <li><b>Commitment.</b> Ask for an agreed next step, and let them take it on their own terms.</li>
      </ul>
      <p>Each stage gets its own lesson. They run in order, and you can always step back a stage if an answer tells you something is unresolved.</p>
      <h2>Open with insight, not a pitch</h2>
      <p>Executives give time to people who show, right away, that they can help with the executive’s agenda: lower costs, lower risk, smoother operations. So open by showing you understand the industry, mention a challenge companies like theirs tend to face, and then ask a question about them. For a CFO of a retail business, it might sound like this:</p>
      <Say>“I work with a lot of retail CFOs, and I often hear frustration about rising interchange fees and surprise chargeback costs. I’m curious, how are you managing that at [Company]?”</Say>
      <p>That opener shows industry knowledge, names a familiar pain, and leads straight into the first Connecting question. But it only works if it’s true. If you haven’t spoken to many retail CFOs, say what you can stand behind: “Retail finance teams often tell me…”</p>
      <p>Whatever the stage, keep your tone calm and unhurried. Executives expect a peer, not a salesperson. Position yourself as a knowledgeable advisor, and listen more than you talk.</p>
    </>,
  },

  "connect-and-situation": {
    kicker: `Lesson 2 of ${TOTAL}`,
    title: "Connect, Then Map the Current State",
    lead: "Executives open up to someone who is curious about them. Start with their world, then ask just enough about their setup to see where the gaps might be.",
    body: <>
      <h2>Connecting: start with them, not your product</h2>
      <p>Connecting questions lower a prospect’s guard. Your product doesn’t come up at this stage. You are showing genuine interest in their role, their goals and what has recently changed for the business. Three habits make it work:</p>
      <ul>
        <li><b>Personalize.</b> Reference something specific and real: “I noticed [Company] expanded into e-commerce this year. How has that transition been for your payment operations?”</li>
        <li><b>Ask open-ended questions.</b> “What was it about your current payment processor that initially attracted you?” or “As a CEO, what do you look for in a payments partner in terms of reliability or innovation?”</li>
        <li><b>Keep the pace easy.</b> A few thoughtful questions are enough to get them talking. Rapid-fire interrogation is what a salesperson does.</li>
      </ul>
      <p>Three more openers to keep in your pocket:</p>
      <Say>“Just so I understand, what prompted you to agree to this discussion? Are you exploring new options or gathering market insight?”</Say>
      <Say>“With your current payment setup, what do you feel is working well for the company?”</Say>
      <Say>“How have the recent changes at [Company] affected your payment processing needs or strategy?”</Say>
      <p>The second one starts positive on purpose. It shows you aren’t here only to criticize what they have.</p>
      <h2>Situation: learn the baseline</h2>
      <p>Situation questions establish what they are doing now and how it’s set up. For an executive, link them to metrics and strategy, not technical detail. Three rules:</p>
      <ul>
        <li><b>Be selective.</b> Ask a few of the most useful questions in a row. You can always follow up later.</li>
        <li><b>Cover the key areas.</b> Fees, contract terms, technology and integration, service and support, risk and security, and performance such as uptime and funding speed. Pain tends to hide in these.</li>
        <li><b>Quantify.</b> Executives think in numbers. Ask for volumes, costs and timelines. It gets you the data, and it makes them aware of the size of what they spend.</li>
      </ul>
      <Say>“Who do you use for card processing now, and how long have you been with them?”</Say>
      <Say>“Roughly how much do you process in card transactions each month, and do you know your effective rate after all fees?”</Say>
      <Say>“Are transactions settled next day, or do you see delays getting funds? How much does settlement speed matter for your cash flow?”</Say>
      <Say>“How does your processor connect to your ERP or billing software? Any trouble with reconciliation or moving data?”</Say>
      <Say>“What do you like about your current processor, and why did you choose them originally?”</Say>
      <p>Notice what the effective-rate question can reveal. A CFO may answer with a figure, or realize they don’t know it, which is itself a finding.</p>
      <h2>Listen for the way in</h2>
      <p>Take notes and use what they say to choose your next question. Suppose a CEO tells you, “We went with XYZ because they gave us a low rate at the start.” A natural follow-up is: “Got it. And have your actual fees stayed consistent with that initial quote over time?” That moves you gently from facts toward a possible problem, and it is a question, not an accusation.</p>
      <blockquote>A few good questions beat twenty. Their answers decide which problem questions to ask next.</blockquote>
    </>,
  },

  "problem-awareness": {
    kicker: `Lesson 3 of ${TOTAL}`,
    title: "Let Them Name the Problem",
    lead: "If the executive describes the frustration, it’s theirs. If you describe it for them, you’re nagging.",
    body: <>
      <h2>Find the gap between now and ideal</h2>
      <p>Problem awareness questions help an executive notice issues, frustrations and unmet needs in their payments setup. You don’t tell them what is wrong. You ask questions that let them say it. Three habits do most of the work:</p>
      <ul>
        <li><b>Ask how they feel.</b> Executives rarely volunteer complaints. “How do you feel about…?” or “Are you completely satisfied with…?” invites them to reflect.</li>
        <li><b>Follow up on what they already told you.</b> “You mentioned settlements are sometimes delayed. Has that caused any cash-flow issues or frustration for your finance team?” That connects a fact to a possible pain.</li>
        <li><b>Raise common industry pain points</b> and see which ones land.</li>
      </ul>
      <h2>Six places pain tends to live</h2>
      <ul>
        <li><b>Fees and rates.</b> “Have you noticed any hidden fees or higher effective rates over time that you weren’t expecting?”</li>
        <li><b>Chargebacks and fraud.</b> “How much of a headache are chargebacks for your business right now?”</li>
        <li><b>Security and compliance.</b> “With data breaches in the news, how confident are you in your processor’s security and PCI compliance measures?”</li>
        <li><b>Reliability.</b> “Have you had any downtime or technical issues processing payments, and how did that affect the business?”</li>
        <li><b>Customer experience.</b> “Are there frictions in the payment process for your customers, like declines or slow checkout, that you wish you could remove?”</li>
        <li><b>Support.</b> “How responsive is your current provider’s support when you have an issue?”</li>
      </ul>
      <p>Keep these as questions. You are asking <i>whether</i> there are hidden fees, not announcing that there are. You haven’t seen a statement yet, and the academy’s rule still applies: never claim they are overpaying until you’ve seen the numbers.</p>
      <h2>Questions that draw out more</h2>
      <Say>“Would you say you’re 100 percent satisfied with your processing fees, or do you suspect there might be unnecessary costs buried in there?”</Say>
      <Say>“What happens when a chargeback occurs? Does it take a lot of time and energy from your team to resolve, or is it fairly smooth?”</Say>
      <Say>“On a scale of 1 to 10, how confident are you in the security of your payment transactions and customer data?”</Say>
      <p>If they give less than a 10, ask “Why not a 10? What concerns you?” They will name the worry themselves (outdated technology, no tokenization), and you can address it later.</p>
      <Say>“If you could wave a magic wand, is there anything you’d change about how credit card payments are handled in your company?”</Say>
      <p>That open question often gets a current frustration out through its opposite: “I wish cash from sales hit our account faster.”</p>
      <h2>Listen for emotional cues</h2>
      <p>If a CFO’s tone sharpens when fees come up, or a COO laughs about how bad a system is, you’ve found a hot button. Acknowledge it and dig gently: “Tell me more about that,” or “How long has that been a concern?” The more they talk about the pain, the more urgency builds inside them.</p>
      <blockquote>When they share a problem, empathize before you do anything else.</blockquote>
      <p>“I understand. Many companies feel stuck with hidden fees. It’s frustrating to watch them add up.” That makes them feel heard, not sold to, and it keeps you on their side of the table.</p>
    </>,
  },

  "solution-awareness": {
    kicker: `Lesson 4 of ${TOTAL}`,
    title: "Let Them Picture the Fix",
    lead: "Once the problems are out in the open, shift to the future. Ask what they want, and let them describe the solution before you describe yours.",
    body: <>
      <h2>They sell themselves</h2>
      <p>Solution awareness questions turn the conversation toward results. Instead of pitching, you ask what an ideal setup looks like. As they describe it, they become emotionally invested in the idea of change, and they are the one steering it.</p>
      <h2>Four techniques</h2>
      <ul>
        <li><b>Explore desired outcomes.</b> If fees were the problem: “How important would it be to reduce your effective processing costs? What would you do with those savings?” If integration was the problem: “What would it mean for you if payments integrated seamlessly with all your platforms?”</li>
        <li><b>Ask about past attempts.</b> “Have you looked at other payment processing options or new technologies in the last year?” If yes: “What prompted that, and what happened?” Their history tells you how they decide.</li>
        <li><b>Plant your strengths indirectly.</b> Ask if a capability would matter to them before you say you offer it: “How high a priority is advanced fraud protection for you, say AI-driven fraud alerts or point-to-point encryption?” If it’s very important, they are telling you what to talk about later. If they hadn’t considered it, you have planted a seed.</li>
        <li><b>Let them own the idea.</b> “What would an ideal partnership with a processor look like for you and your team?” They will list your selling points in their words: transparent fees, quick support, an account manager who knows their industry.</li>
      </ul>
      <h2>More ways to ask</h2>
      <Say>“If you could eliminate those chargeback hassles we discussed, how would that affect your operations?”</Say>
      <Say>“What would you ideally want from a payments provider on security or innovation? Do features like tokenization or next-generation encryption sound valuable to you?”</Say>
      <Say>“Imagine your payment processing a year from now running perfectly. What does that look like? Faster funding? No surprise fees? A happier finance team?”</Say>
      <Say>“How would a meaningful reduction in processing fees affect your bottom line? What would you do with the money?”</Say>
      <p>That last question is a what-if, and it should stay one. Don’t name a percentage you can’t guarantee, and don’t imply you can deliver it. You’re asking them to describe the value of an outcome, not promising an outcome.</p>
      <h2>Don’t jump into the pitch</h2>
      <p>As they describe what they want, you’ll sense relief or excitement. They may even ask, “Can you actually do that?” That’s a buying signal, and it’s also the moment to slow down. Reflect their vision first: “It sounds like speeding up cash flow and getting more transparency are top priorities for you.” Check that you got it right. That confirms you understood, and it tells you exactly which points to cover when you do share your solution.</p>
      <blockquote>By the end of this stage they should be able to see the benefits of a better processor, in their own words.</blockquote>
    </>,
  },

  "consequence-questions": {
    kicker: `Lesson 5 of ${TOTAL}`,
    title: "Let Them Price Doing Nothing",
    lead: "After the picture of a better future, a gentle reality check: what does the status quo cost? The goal is to help them conclude that doing nothing is not an option.",
    body: <>
      <h2>The cost of inaction</h2>
      <p>People are often more motivated to avoid a loss than to win a gain. Consequence questions use that, without pressure, by asking the executive to think through what happens if the problems they described continue. Done well, the question creates a slight discomfort, and the executive builds the business case for change themselves.</p>
      <h2>Four techniques</h2>
      <ul>
        <li><b>Focus on loss or risk:</b> money, time, competitive edge, security.</li>
        <li><b>Tie it to what they said.</b> If they complained about hidden fees: “What happens if those processing fees keep rising each quarter? How would that affect your operating margins or pricing strategy?”</li>
        <li><b>Let them quantify it.</b> “If nothing changes, how much do you estimate you’ll pay in unnecessary fees over the next year?” A CFO who does the arithmetic out loud has made the case for you.</li>
        <li><b>Use conditional language.</b> “What if…”, “What would you do if…”, “How would you handle…” invite them to simulate the downside.</li>
      </ul>
      <h2>Examples</h2>
      <Say>“What would the impact be if a year from now you’re still dealing with these same chargeback issues? Could it cost you in lost revenue or customer trust?”</Say>
      <Say>“If you don’t address the security vulnerabilities we talked about, what’s the potential fallout of a breach for your company?”</Say>
      <Say>“You mentioned wanting faster settlements. If funds keep coming in slowly, how does that affect your cash flow during peak season?”</Say>
      <Say>“If everything stays the same with your current processor, do you see any risks or missed opportunities for [Company] over the next two to three years?”</Say>
      <h2>Then stop talking</h2>
      <p>After you ask, let them respond and fully process it. A thoughtful pause, or “Hmm, we’d probably lose quite a bit if we let this continue,” means it landed. Acknowledge what they said: “That’s a valid concern. It sounds like doing nothing could actually cost more in the long run.” You have now helped them reach urgency without a single pressure line.</p>
      <blockquote>The numbers come from them. If you supply a scary figure, it’s a scare tactic, not a question.</blockquote>
      <p>Keep the stakes real. Don’t exaggerate breach risk, and don’t invent a cost. The question works because they are answering from their own business.</p>
    </>,
  },

  "commitment-and-closing": {
    kicker: `Lesson 6 of ${TOTAL}`,
    title: "Ask for the Next Step, Not the Moon",
    lead: "With executives, the close is usually a series of small, agreed steps. Each one is a micro-commitment, and each one makes the next feel natural.",
    body: <>
      <h2>Commitment questions</h2>
      <p>Commitment questions check readiness and secure agreement to proceed without high-pressure tactics. If the conversation has gone well, the executive already believes in the need and sees value in your solution. Your job is to help them say it and act on it.</p>
      <ul>
        <li><b>Soft close with validation.</b> Instead of “Ready to sign?”, ask “Do you feel like this solution could be the answer for you?” If they say yes, follow with “Why do you feel that way?” They explain why it fits, and in doing so they convince themselves.</li>
        <li><b>Gauge commitment.</b> “On a scale of 1 to 10, how comfortable are you with moving forward?” Anything under 9 gets “What would make it a 10?” That surfaces the quiet objection. If it’s lukewarm, step back a stage and address it.</li>
        <li><b>Ask for the next step.</b> The commitment may be a technical walkthrough with their ops team, or a cost-benefit comparison, or a meeting with other stakeholders. “If you believe this could solve the issues we discussed, what are the appropriate next steps on your end?” puts the ball in their court and gives you a map of their process.</li>
        <li><b>Assume and ask.</b> When every signal is green: “It sounds like this checks your boxes. What’s your timeline for making a change like this?” That surfaces any internal hurdle.</li>
      </ul>
      <h2>More closing moves</h2>
      <ul>
        <li><b>Summarize value first.</b> “We’ve covered how to eliminate those hidden fees, improve security and integrate with your systems. It sounds like those are the improvements you were looking for, correct?” A nod prepares them to say yes.</li>
        <li><b>Offer an alternate choice,</b> where both options are wins: “Would you prefer to start with a three-month pilot, or go straight to a yearly agreement?”</li>
        <li><b>Talk logistics as if it’s decided.</b> “If we get paperwork done this week, we could schedule onboarding for the first of next month. Does that timeline work?” They may say yes, or tell you the board meets in two weeks, which is the closing process on their side.</li>
        <li><b>“What’s stopping you?”</b> If it went well but they aren’t committing: “On a scale of 1 to 10, how ready are you to move forward?” Then “What would make it a 10?”</li>
        <li><b>Be OK with “no.”</b> “It seems like this could really help, and I’d love to work together. I also want you to feel completely comfortable. If you have reservations, or it isn’t the right time, it’s okay to let me know.” The safe exit usually makes yes easier.</li>
        <li><b>Close a next step.</b> If the deal needs internal buy-in, lock one in the calendar: “Can we set up that meeting for next week with your team?”</li>
      </ul>
      <blockquote>Always be advancing. If you aren’t closing the sale, close some form of commitment.</blockquote>
      <h2>Stay gracious, then deliver</h2>
      <p>If they say yes, reinforce it: “Excellent. I think this will be a great move for [Company]. We’ll take it step by step. First, I’ll… Does that sound good?” If they need more time, respect it and name a date: “Let’s reconvene Tuesday after you’ve had time to review.” An aggressive close is a common reason executives walk away from a vendor.</p>
      <p>When they do commit, don’t vanish. A smooth onboarding and quick wins are what validate their trust, and they lead to long-term relationships and referrals. And only promise a timeline, a switchover date or a service level that you have confirmed you can keep.</p>
    </>,
  },

  "trusted-advisor": {
    kicker: `Lesson 7 of ${TOTAL}`,
    title: "Be the Trusted Advisor",
    lead: "Following the question sequence isn’t enough on its own. With a CEO, CFO or COO, you win by establishing credibility and trust, which come from integrity and capability together.",
    body: <>
      <h2>Seven habits</h2>
      <ul>
        <li><b>Do your homework.</b> Research the executive and the company before any meeting. Know their industry, recent news and strategic goals, and use their language.</li>
        <li><b>Lead with insight, not a pitch.</b> Bring a relevant data point: “I noticed from your annual report that improving operating margins is a focus. That’s part of why I wanted to speak.” It shows preparation, and that you understand their agenda.</li>
        <li><b>Act like part of the executive team.</b> Say “we” and “team”: “We’d work closely with your finance team to make the integration seamless.” It lowers the us-versus-them barrier.</li>
        <li><b>Show integrity and reliability.</b> Do what you say, when you say. If something isn’t a fit, tell them. Treat what they share as confidential. Lose integrity and you lose everything.</li>
        <li><b>Use success stories, honestly.</b> One or two short, relevant case studies carry weight with executives. Use real ones, with real outcomes you can verify. If you don’t have a close match yet, say how companies of their type tend to feel (“owners who just opened a second location often tell us…”), and don’t invent a result.</li>
        <li><b>Speak in ROI.</b> Tie everything back to the numbers they gave you: “From what you told me, freeing up two days of revenue in cash flow is money and time back in the business.” Use their figures, and be careful about promising savings.</li>
        <li><b>Be confident, but consultative.</b> Authoritative without arrogance. Adjust to their style, since some executives want straight facts and others a little rapport. Listen more than you talk, especially early.</li>
      </ul>
      <blockquote>Credibility with executives is trust plus capability. Trust is earned through integrity, understanding and putting their interests first. Capability is shown through expertise, insight and proven results.</blockquote>
      <p>When an executive sees both, you stop being a salesperson and become a trusted advisor, and the whole process gets easier.</p>
    </>,
  },

  "differentiate": {
    kicker: `Lesson 8 of ${TOTAL}`,
    title: "Don’t Be a Commodity",
    lead: "Many executives think “a processor is a processor.” They’ve been pitched by plenty of reps leading with the lowest rate. Your job is to be the exception.",
    body: <>
      <h2>Sell value and expertise, not price</h2>
      <p>Competing on “the lowest rates” is a race to the bottom, and it feeds the commodity mindset. Instead, emphasize cost transparency, better technology, superior service and tailored solutions. It lines up with what you learned in Module 6: don’t compete on a number you haven’t earned the right to quote. A line that works with executives:</p>
      <Say>“We provide a detailed analysis so you can see what you’re paying and why, and we put every fee in writing with full transparency.”</Say>
      <p>The original playbook adds a promise (“you’re not paying a penny more than you should”). Promise the process, not the result. You can guarantee a transparent analysis. You can’t guarantee what it will find.</p>
      <h2>Translate your strengths into their benefit</h2>
      <p>Every feature you mention should end in something an executive cares about:</p>
      <ul>
        <li><b>Faster settlement</b> becomes cash-flow position.</li>
        <li><b>Fraud detection and PCI support</b> becomes avoided financial loss for a CFO and protected brand trust for a CEO.</li>
        <li><b>ERP and accounting integration</b> becomes hours less reconciliation each month. Quantify it if you can.</li>
        <li><b>Dedicated support</b> becomes risk reduction: an issue during a weekend sale gets resolved before it costs them business.</li>
      </ul>
      <p>Before you use any of these, check that it’s true. Same-day funding, 24/7 support, specific integrations and what’s included at no extra charge all depend on Kadima’s actual terms and on the specific merchant. If you’re not sure, ask your manager, and until you’re sure, ask the question instead of making the claim.</p>
      <h2>Other ways to stand out</h2>
      <ul>
        <li><b>Make your process the differentiator.</b> Asking good questions and listening sets you apart from reps who talk about rates. You can say so: “We believe in a different approach. Fully understanding your needs first, and only then seeing whether we’re a good fit.”</li>
        <li><b>Offer insight through a statement review.</b> Executives love when a vendor finds them money. A review of their current statements can reveal fees or markups that aren’t obvious. Frame it honestly as a no-obligation check-up, and mean it: if their setup is good, tell them so. Say what the review actually is, and don’t call a sales conversation a free audit with no strings.</li>
        <li><b>Stress flexibility.</b> “We’re not a one-size-fits-all shop. We tailor the solution to your business.” Only if it’s accurate for your offer.</li>
        <li><b>Position politely against competitors.</b> “Clients often tell us they chose us over [Bank X] because we gave a clearer fee structure and hands-on support.” Use what clients actually say. Never run a competitor down.</li>
      </ul>
      <blockquote>Be the knowledgeable, honest, value-focused partner. Executives have been burned by reps who overpromise and then vanish.</blockquote>
    </>,
  },

  "executive-objections": {
    kicker: `Lesson 9 of ${TOTAL}`,
    title: "Executive Objections: Contracts, “It Works,” and “Send Info”",
    lead: "Executives raise real concerns and knee-jerk brush-offs alike. Welcome them. An objection is a chance to clarify, and the NEPQ rule applies: acknowledge, empathize, then ask.",
    body: <>
      <p>Good questioning prevents many objections before they come up. For the rest, stay calm, and use a third-party story when it helps: “I had another client who felt the same way. They were hesitant because things were ‘working.’ We discovered…” Only tell a story that really happened.</p>
      <h2>“We’re already locked into a processor.”</h2>
      <p><b>Why they say it:</b> Switching costs and cancellation penalties are real, and “we have a contract” ends the conversation quickly. Acknowledge it first: “I understand. You’ve signed with a processor and you’re obligated for now.” Then reframe:</p>
      <ul>
        <li><b>Cost-benefit.</b> Savings can sometimes outweigh a termination fee. Do the math with their real numbers: “If you’d save a given amount a month by switching and the cancellation fee is a given amount, here’s how fast it pays for itself.” Use their statement and their contract, never guesses.</li>
        <li><b>Future positioning.</b> “When does your contract end? I see. We’d be happy to periodically give you market updates and a free cost analysis as you get closer, so you’re in a strong position whether you stay or switch.”</li>
        <li><b>Partial solutions.</b> “Is your contract all-or-nothing? Some firms pilot a new processor on a new product line or channel while keeping the old one, just to compare.”</li>
      </ul>
      <p>Finish by keeping the door open: “If you’re open to it, we can still do that analysis so you know exactly what you’re gaining by waiting versus switching. No obligation. Either way, I’m here as a resource.”</p>
      <h2>“We don’t want to change something that works.”</h2>
      <p><b>Why they say it:</b> This is the classic status quo objection. Executives are busy and risk-averse, and “it works” can mask problems they’ve gotten used to. Agree that sticking with what works is logical unless there’s a strong reason, and find out whether there is one:</p>
      <ul>
        <li><b>Probe gently.</b> “I wouldn’t suggest changing it if it’s working well. Out of curiosity, when was the last time you did a thorough review of your setup?” Sometimes what works on the surface can be improved in ways that aren’t obvious until someone looks.</li>
        <li><b>Offer a no-risk assessment.</b> “We can do a complimentary health check on your merchant statements. Worst case, we confirm you have a great setup and you get peace of mind. Best case, we find tweaks that could save or earn you money. Would you be open to that?”</li>
        <li><b>Address fear of disruption.</b> It’s often what “don’t fix what isn’t broken” really means. Describe your transition plan, and be specific and true about what you handle and what happens in parallel. Don’t promise zero downtime unless it’s real.</li>
        <li><b>Find any dissatisfaction.</b> “Nothing you’d improve if you could? No minor annoyances at all?” Asked lightly, it often gets “Well, I wish the fees were lower…”</li>
      </ul>
      <p>Stay non-confrontational: “It sounds like you’re relatively satisfied, which is great. Given that, let me simply equip you with information, so if something stops working well in six months, you already know your options.”</p>
      <h2>“Just send me more info.”</h2>
      <p><b>Why they say it:</b> It can be a polite brush-off or a real request, and it’s a classic stall. Agreeing and hanging up usually means they won’t read it. Instead, agree and keep the conversation going (see Module 6, and apply it here):</p>
      <ul>
        <li><b>Clarify their interest.</b> “Sure, I’d be happy to send you information. So I can send the most relevant details, what in particular would you like to learn more about?” A specific answer (“pricing,” “how your tech works”) tells you what they care about.</li>
        <li><b>Offer a brief follow-up call.</b> “I can also schedule a quick ten-minute call next week to answer questions after you’ve reviewed it. Would that be okay?”</li>
        <li><b>Ask one more question now.</b> “While I have you, so I include the right info, what kind of fraud prevention or encryption are you using today?” If they answer, they’re engaged.</li>
        <li><b>Send it as a problem and solution.</b> “As promised, here’s the overview. I included a section on how we reduce chargebacks since you mentioned that was a concern.”</li>
      </ul>
      <p>If it truly is a brush-off, leave a door open: “I’ll send a brief overview. If I don’t hear back, is it okay if I check in next month to see if anything has changed on your end?”</p>
      <blockquote>Every objection you handle well is a step closer to the deal, or at least leaves a good impression for the next time.</blockquote>
    </>,
  },
};

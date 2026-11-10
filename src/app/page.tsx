import Link from "next/link";
import Image from "next/image";
import { PublicNav } from "@/components/PublicNav";
import { MiniWaveform } from "@/components/SignalArt";
import { modules } from "@/data/curriculum";
import { BRAND } from "@/lib/brand";

const ticker = "CALL RELUCTANCE  /  OPENING LINES  /  REAL OBJECTIONS  /  QUALIFIED APPOINTMENTS  /  DAILY CONSISTENCY  /  ";

export default function Home() {
  return <>
    <PublicNav />
    <main>
      <section className="hero-noise">
        <div className="hero-code desktop-only">OUTBOUND//01<br/>SIGNAL ACTIVE</div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-status"><span /> LIVE TRAINING SYSTEM FOR MERCHANT SALES</div>
            <h1 className="display hero-title">Stop<br/>avoiding<br/><em>the call.</em></h1>
            <p className="hero-lead">Cold-calling confidence is not something you either have or don&apos;t. It is a trainable response built through repetition, pressure, and honest practice.</p>
            <div className="hero-actions"><Link className="btn btn-lime" href="/register">Enter the call lab <b>↗</b></Link><Link className="text-link" href="#curriculum">See the system ↓</Link></div>
            <div className="hero-proof"><b>01</b><span>LESSONS THAT<br/>CHANGE BEHAVIOR</span><b>02</b><span>DRILLS THAT FEEL<br/>LIKE REAL CALLS</span><b>03</b><span>NUMBERS THAT<br/>DON&apos;T LIE</span></div>
          </div>
          <div className="hero-visual"><Image src="/hero-call.png" alt="Sales rep mid cold-call, wearing a headset" width={1254} height={1254} priority style={{ width: "100%", maxWidth: 620, height: "auto", margin: "auto", display: "block", opacity: 0.88, filter: "brightness(0.88) saturate(0.92)" }} /></div>
        </div>
      </section>

      <div className="ticker"><div className="ticker-track">{ticker}{ticker}{ticker}{ticker}</div></div>

      <section className="manifesto">
        <div className="container manifesto-grid">
          <div><span className="index-stamp">THE PROBLEM / 001</span><MiniWaveform /></div>
          <div>
            <h2 className="display section-title">You don&apos;t need<br/>another script.</h2>
            <p className="statement">You need to be able to make the call <mark>when your brain is giving you ten reasons not to.</mark></p>
            <p className="body-copy">{BRAND.name} trains the moment before the dial, the first thirty seconds, the pushback, and the ask. No motivational fog. No product-information dumping. Just deliberate practice for the conversations that create pipeline.</p>
          </div>
        </div>
      </section>

      <section id="how" className="call-lab">
        <div className="container">
          <div className="section-kicker"><span>THE CALL LAB</span><span>METHOD / 3 PART SYSTEM</span></div>
          <div className="lab-grid">
            {[
              ["01","DECODE","Understand the fear response, avoidance loop, and mental stories that keep your hand off the phone.","KNOW WHAT'S HAPPENING"],
              ["02","DRILL","Run realistic opening, objection, and appointment-setting reps until the response becomes familiar.","PRACTICE UNDER PRESSURE"],
              ["03","DIAL","Take the skill into a measured call block. Track actions, conversations, and what needs another rep.","TURN PRACTICE INTO PIPELINE"]
            ].map((x,i)=><article className={`lab-card lab-${i+1}`} key={x[0]}><div className="lab-top"><span>{x[0]}</span><span>+</span></div><h3>{x[1]}</h3><p>{x[2]}</p><small>{x[3]} →</small></article>)}
          </div>
        </div>
      </section>

      <section id="curriculum" className="curriculum-section">
        <div className="container">
          <div className="curriculum-head"><div><span className="index-stamp">TRAINING SEQUENCE / 012</span><h2 className="display section-title">Built for the<br/>hard part.</h2></div><p>Every module attacks a specific point where outbound momentum breaks down.</p></div>
          <div className="module-list">
            {modules.slice(0,8).map((m,i)=><Link href={i<2?`/courses/${m.slug}`:"/courses"} key={m.id} className="module-row"><span className="module-num">{String(m.id).padStart(2,"0")}</span><h3>{m.title}</h3><p>{m.description}</p><b>{i===0?"IN PROGRESS":i===1?"READY":"LOCKED"}</b><i>↗</i></Link>)}
          </div>
          <Link className="btn btn-primary all-modules" href="/courses">View all 12 modules →</Link>
        </div>
      </section>

      <section id="teams" className="manager-section noise-panel">
        <div className="container manager-grid"><div><span className="tag">FOR SALES LEADERS</span><h2 className="display">You can&apos;t coach<br/>what you can&apos;t see.</h2></div><div><p>See who is training, where confidence is breaking down, and whether practice is turning into consistent call activity.</p><div className="score-block"><span>TEAM READINESS</span><strong>78</strong><div><i style={{width:"78%"}} /></div></div><Link className="btn btn-lime" href="/manager">Open manager view ↗</Link></div></div>
      </section>
    </main>
    <footer className="site-footer"><div className="container"><b>{BRAND.name.toUpperCase()}</b><span>MAKE THE CALL.</span><span>© 2026</span></div></footer>
    <style>{`
      .hero-noise{position:relative;overflow:hidden;background:var(--ink);color:#f5f5ed;min-height:650px}.hero-noise:before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.15) .7px,transparent .7px);background-size:5px 5px;opacity:.18;pointer-events:none}.hero-code{position:absolute;right:22px;top:25px;color:#70766d;font:10px/1.5 monospace;letter-spacing:.13em;text-align:right}.hero-grid{display:grid;grid-template-columns:1.02fr .98fr;align-items:center;min-height:650px;gap:30px;position:relative}.hero-copy{padding:58px 0}.hero-status{font-size:10px;letter-spacing:.18em;font-weight:900;color:#b9c0b5;display:flex;align-items:center;gap:10px}.hero-status span{width:8px;height:8px;background:var(--orange);border-radius:50%;box-shadow:0 0 0 6px rgba(255,92,53,.17)}.hero-title{font-size:clamp(62px,6.5vw,98px);margin:27px 0 28px}.hero-title em{font-style:normal;color:var(--lime);-webkit-text-stroke:1px var(--lime)}.hero-lead{font-size:18px;line-height:1.55;color:#bdc4ba;max-width:590px}.hero-actions{display:flex;align-items:center;gap:28px;margin-top:30px}.text-link{font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;border-bottom:1px solid #71776e;padding-bottom:4px}.hero-proof{display:grid;grid-template-columns:auto 1fr auto 1fr auto 1fr;gap:10px 15px;border-top:1px solid #424640;margin-top:42px;padding-top:20px}.hero-proof b{color:var(--orange);font:900 18px monospace}.hero-proof span{font-size:9px;letter-spacing:.1em;line-height:1.5;color:#969d93;font-weight:800}.manifesto{padding:95px 0;background:var(--paper)}.manifesto-grid{display:grid;grid-template-columns:.35fr 1fr;gap:60px}.index-stamp{font:900 11px monospace;letter-spacing:.1em}.section-title{font-size:clamp(48px,5vw,76px);margin:0 0 32px}.statement{font:700 clamp(22px,2.4vw,34px)/1.25 Arial,sans-serif;max-width:860px;margin:0 0 28px}.statement mark{background:var(--lime);color:var(--ink);padding:0 5px}.body-copy{max-width:720px;color:var(--muted);line-height:1.7;font-size:17px}.call-lab{background:var(--ink);padding:80px 0;border-block:3px solid var(--ink)}.section-kicker{display:flex;justify-content:space-between;color:#fff;font:900 11px monospace;letter-spacing:.12em;border-bottom:2px solid #34362f;padding-bottom:13px}.lab-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:35px;border:2px solid #34362f}.lab-card{min-height:370px;padding:28px;display:flex;flex-direction:column;border-right:2px solid #34362f}.lab-card:last-child{border-right:0}.lab-1{background:var(--green);color:#fff}.lab-2{background:var(--paper)}.lab-3{background:var(--ink);color:white}.lab-top{display:flex;justify-content:space-between;font:900 16px monospace}.lab-card h3{font:700 46px/1 'Arial Narrow',Arial,sans-serif;text-transform:uppercase;margin:64px 0 20px;letter-spacing:.01em}.lab-card p{line-height:1.6;max-width:330px}.lab-card small{margin-top:auto;font-weight:900;font-size:10px;letter-spacing:.1em}.curriculum-section{padding:90px 0}.curriculum-head{display:grid;grid-template-columns:1.3fr .7fr;gap:50px;align-items:end}.curriculum-head p{font-size:18px;line-height:1.55;color:var(--muted);padding-bottom:12px}.module-list{border-top:3px solid var(--ink);margin-top:40px}.module-row{display:grid;grid-template-columns:70px 1fr 1.35fr 110px 24px;gap:20px;align-items:center;padding:22px 8px;border-bottom:1px solid var(--ink);transition:.15s}.module-row:hover{background:var(--lime);padding-inline:16px}.module-num{font:900 15px monospace;color:var(--orange)}.module-row h3{font-size:19px;margin:0}.module-row p{font-size:12px;color:var(--muted);line-height:1.45;margin:0}.module-row b{font:900 9px monospace;letter-spacing:.08em}.module-row i{font-style:normal;font-size:18px}.all-modules{margin-top:35px}.manager-section{color:white;padding:90px 0}.manager-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:center}.manager-grid h2{font-size:clamp(50px,5vw,76px);margin:25px 0 0}.tag{display:inline-block;background:var(--orange);color:var(--ink);padding:8px 11px;font:900 10px monospace;letter-spacing:.1em}.manager-grid p{font-size:18px;line-height:1.6;color:#c6cec2}.score-block{border:1px solid #667064;padding:20px;margin:28px 0}.score-block span{font:900 10px monospace;letter-spacing:.12em}.score-block strong{float:right;font:700 38px 'Arial Narrow',Arial,sans-serif}.score-block div{height:8px;background:#333833;clear:both;margin-top:20px}.score-block i{display:block;height:100%;background:var(--lime)}.site-footer{background:var(--lime);border-top:2px solid var(--ink);padding:25px 0}.site-footer .container{display:flex;justify-content:space-between;font:900 11px monospace;letter-spacing:.1em}
      @media(max-width:800px){.hero-grid,.manifesto-grid,.curriculum-head,.manager-grid{grid-template-columns:1fr}.hero-title{font-size:58px}.hero-visual{position:absolute;opacity:.14;right:-35%;width:90%;pointer-events:none}.hero-copy{position:relative;z-index:2}.hero-proof{grid-template-columns:auto 1fr}.lab-grid{grid-template-columns:1fr}.lab-card{min-height:310px;border-right:0;border-bottom:2px solid var(--ink)}.lab-card h3{margin-top:48px;font-size:40px}.module-row{grid-template-columns:50px 1fr 20px}.module-row p,.module-row b{display:none}.manifesto,.curriculum-section,.manager-section{padding:70px 0}}
    `}</style>
  </>;
}

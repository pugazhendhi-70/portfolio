import { useState, MouseEvent } from 'react'
import Split from './Split'
import { site, socials, creative, projects } from '../data/portfolio'

export function Hero() {
  return (
    <section id="hero" className="hero">
      <h1 className="mega" aria-label="Pugazhendhi V — Visual Creator">{site.name}</h1>
      <div className="hit" data-cursor="view" data-label="PV" />
      <div className="hero-f">
        <div><span className="vv">{site.initial}</span><span className="role"><b>VISUAL</b> Creator</span></div>
        <ul className="meta">{site.meta.map(m => <li key={m}>{m}</li>)}</ul>
      </div>
    </section>
  )
}
const Reel = () => (
  <svg viewBox="0 0 200 200" className="reel-svg" aria-hidden>
    <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="100" cy="100" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5].map(k => <circle key={k} cx={100 + 52 * Math.cos(k * Math.PI / 3)} cy={100 + 52 * Math.sin(k * Math.PI / 3)} r="22" fill="#050509" stroke="currentColor" strokeWidth="2" />)}
  </svg>
)
export function Skills() {
  const mv = (e: MouseEvent<HTMLElement>) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--lx', e.clientX - r.left + 'px'); e.currentTarget.style.setProperty('--ly', e.clientY - r.top + 'px') }
  return (
    <section id="skills" className="sk" onMouseMove={mv}>
      <div className="mq" aria-hidden><span>VISUAL COMMUNICATION ✦ CREATIVE MEDIA ✦ CHENNAI ✦ VISUAL COMMUNICATION ✦ CREATIVE MEDIA ✦ CHENNAI ✦ </span></div>
      <div className="reel r1" data-speed="1.2"><Reel /></div><div className="reel r2" data-speed="-.6"><Reel /></div>
      <div className="frame f1" data-speed="1.6"><i>● REC</i><span>00:00:24:12</span></div>
      <div className="frame f2" data-speed=".5"><i>24 FPS</i><span>A-CAM</span></div>
      <p className="eyebrow" data-reveal>(03) Creative skills</p>
      <h2 className="sec-h"><Split t="WHAT I" /> <Split t="can" cls="it" /> <Split t="CREATE." /></h2>
      <ul>{creative.map((c, i) => (
        <li key={c} data-speed={(i % 3) * .25}><span className="n">{String(i + 1).padStart(2, '0')}</span><span className="t">{c}</span><span className="tc">TC 00:0{i}:12</span></li>))}</ul>
    </section>
  )
}
export function About() {
  return (
    <section id="about" className="ab">
      <div className="ab-g">
        <div className="ab-l" aria-hidden><span className="cap">FIG. 04 — {site.name} {site.initial}</span></div>
        <div className="ab-r">
          <p className="eyebrow" data-reveal>(04) About</p>
          <h2 className="ab-h"><span className="ln"><Split t="CREATING" /></span><span className="ln v"><Split t="Visual" /></span><span className="ln"><Split t="EXPERIENCES." /></span></h2>
          {site.bio.map(b => <p className="bio" key={b} data-reveal>{b}</p>)}
          <ul className="chips" data-reveal>{site.identity.map(x => <li key={x}>{x}</li>)}</ul>
          <dl className="ledger" data-reveal>{site.ledger.map(([k, v]) => <div className="row" key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </div>
    </section>
  )
}
export function Projects() {
  const [open, setOpen] = useState(-1)
  const tilt = (e: MouseEvent<HTMLElement>) => { const el = e.currentTarget, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width
    el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--ry', (x - .5) * 4 + 'deg'); el.style.setProperty('--rx', ((e.clientY - r.top) / r.height - .5) * -3 + 'deg') }
  return (
    <section id="projects" className="pj">
      <div className="orb o1" aria-hidden /><div className="orb o2" aria-hidden />
      <p className="eyebrow" data-reveal>(05) Selected projects</p>
      <h2 className="sec-h"><Split t="SELECTED" /> <Split t="work" cls="it" /></h2>
      <ul>{projects.map((p, i) => (
        <li key={p.n} className={'rw' + (open === i ? ' open' : '')} tabIndex={0} data-cursor="view" data-label="OPEN" onMouseMove={tilt}
          onClick={() => { setOpen(open === i ? -1 : i); if (p.url) window.open(p.url, '_blank', 'noopener') }}>
          <span className="n">{p.n}</span>
          <div><h3>{p.title}</h3><p className="d">{p.desc}</p><div className="pv"><span>{p.tech}</span></div></div>
          <span className="arr" aria-hidden>↗</span>
        </li>))}</ul>
    </section>
  )
}
export function Contact() {
  return (
    <section id="contact" className="ct">
      <p className="eyebrow" data-reveal>(06) Contact</p>
      <h2 className="ct-h"><Split t="HAVE AN IDEA?" /><br /><Split t="LET'S" /> <Split t="create." cls="it" /></h2>
      <a className="mail" data-magnet href={`mailto:${site.email}`}>{site.email}</a>
      <ul className="soc">{Object.entries(socials).map(([k, v]) => <li key={k}>{v ? <a href={v} target="_blank" rel="noopener noreferrer">{k}</a> : <span title="Add URL in src/data/portfolio.ts">{k}</span>}</li>)}</ul>
      <footer>© 2026 {site.name} {site.initial} — {site.location}</footer>
    </section>
  )
}

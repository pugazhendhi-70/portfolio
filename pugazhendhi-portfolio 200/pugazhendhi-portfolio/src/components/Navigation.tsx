import { useEffect, useState } from 'react'
import { site } from '../data/portfolio'
const L = [['hero', 'Identity'], ['toolkit', 'Toolkit'], ['skills', 'Skills'], ['about', 'About'], ['projects', 'Work'], ['contact', 'Contact']]
export default function Navigation() {
  const [s, setS] = useState(false), [o, setO] = useState(false)
  useEffect(() => { const f = () => setS(scrollY > 40); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return (
    <header className={'nav' + (s ? ' s' : '')}>
      <a href="#hero" className="logo" data-magnet>PV.</a>
      <p className="nav-c">Visual Communication / Creative Media</p>
      <a className="talk" href={`mailto:${site.email}`}>LET'S TALK ↗</a>
      <button className="burger" aria-expanded={o} aria-label="Menu" onClick={() => setO(!o)}>{o ? 'Close' : 'Menu'}</button>
      {o && <nav className="menu">{L.map(([id, l]) => <a key={id} href={'#' + id} onClick={() => setO(false)}>{l}</a>)}</nav>}
    </header>
  )
}

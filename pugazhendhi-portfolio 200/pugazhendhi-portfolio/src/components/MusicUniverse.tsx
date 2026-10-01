import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MusicCard from './MusicCard'
import Split from './Split'
import { software } from '../data/portfolio'
gsap.registerPlugin(ScrollTrigger)
// [x vw, y vh, z px, rotateY] — cards start stacked behind the character and fly out to these depths
const D = [[-34, -26, -60, 18], [34, -24, -90, -18], [-25, 8, 40, 12], [26, 10, 80, -12], [-37, 30, -120, 22], [38, 32, -160, -22], [-14, -33, -250, 10], [15, -35, -200, -10], [-19, 34, 120, 8], [19, 35, 90, -8]]
const M = [[-24, -36, -80, 12], [24, -28, -120, -12], [-24, -12, -40, 10], [24, -2, -60, -10], [-24, 14, -100, 12], [24, 22, -30, -10], [-24, 38, -90, 10], [24, 43, -140, -10], [0, -42, -260, 0], [0, 44, -240, 0]]

export default function MusicUniverse() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>('.mc', ref.current!), P = innerWidth < 820 ? M : D
    const fin = (i: number) => ({ x: P[i][0] * innerWidth / 100, y: P[i][1] * innerHeight / 100, z: P[i][2], rotateY: P[i][3], scale: 1, opacity: 1, filter: `blur(${Math.max(0, -P[i][2] / 120)}px)` })
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      els.forEach((el, i) => {
        const a = (.1 + i * .13) * innerHeight
        gsap.fromTo(el, { xPercent: -50, yPercent: -50, x: 0, y: 0, z: -1500, scale: .3, opacity: 0, rotateY: 0, filter: 'blur(16px)' },
          { ...fin(i), ease: 'power2.out', scrollTrigger: { trigger: '#toolkit', start: `top+=${a} top`, end: `top+=${a + .9 * innerHeight} top`, scrub: true } })
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => { els.forEach((el, i) => gsap.set(el, { xPercent: -50, yPercent: -50, ...fin(i) })) })
    // cursor-distance reaction: glow → tilt → magnetic pull
    const mv = (e: MouseEvent) => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      els.forEach(el => {
        const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2)
        const t = Math.max(0, 1 - Math.hypot(dx, dy) / (Math.max(r.width, r.height) * 1.6)), n = el.firstElementChild as HTMLElement
        const set = (k: string, v: string) => n.style.setProperty(k, v)
        set('--t', t.toFixed(3)); set('--rx', `${-dy / r.height * 14 * t}deg`); set('--ry', `${dx / r.width * 14 * t}deg`)
        set('--tx', `${dx * .07 * t}px`); set('--ty', `${dy * .07 * t}px`); set('--ax', `${dx / r.width * 12 * t}px`)
      })
    }
    addEventListener('mousemove', mv)
    return () => { removeEventListener('mousemove', mv); mm.revert() }
  }, [])
  return (
    <section id="toolkit" className="tk" ref={ref}>
      <div className="stage">
        <div className="tk-h">
          <p className="eyebrow">(02) The toolkit</p>
          <h2 className="sec-h"><Split t="TEN TOOLS," /><br /><Split t="one" cls="it" /> <Split t="LANGUAGE." /></h2>
          <p className="tech">HTML · CSS · JavaScript</p>
        </div>
        {software.map((s, i) => <MusicCard key={s.name} s={s} i={i} />)}
      </div>
    </section>
  )
}

import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import CustomCursor from './components/CustomCursor'
import MusicUniverse from './components/MusicUniverse'
import { Hero, Skills, About, Projects, Contact } from './components/Sections'
import { world, toStage } from './store'
gsap.registerPlugin(ScrollTrigger)
const Scene = lazy(() => import('./components/Scene'))

export default function App() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    const m = root.current!
    const measure = () => { const max = Math.max(1, m.scrollHeight - innerHeight); world.stops = Array.from(m.children).map(c => Math.min(1, (c as HTMLElement).offsetTop / max)) }
    measure(); ScrollTrigger.addEventListener('refresh', measure)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const st = ScrollTrigger.create({ trigger: m, start: 'top top', end: 'bottom bottom', onUpdate: s => { world.p = s.progress; document.documentElement.style.setProperty('--w', String(Math.min(1, Math.max(0, toStage(s.progress) - .2)))) } })
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.split').forEach(el => gsap.from(el.querySelectorAll('.c'), { yPercent: 120, rotate: 5, stagger: .03, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.from(el, { y: 50, opacity: 0, filter: 'blur(12px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }))
      // name flies past the camera
      gsap.to('.mega', { scale: 1.9, opacity: 0, filter: 'blur(16px)', ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach(el => gsap.to(el, { y: -Number(el.dataset.speed) * 260, ease: 'none', scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: true } }))
      gsap.to('.reel-svg', { rotation: (i: number) => (i % 2 ? -360 : 360), ease: 'none', scrollTrigger: { trigger: '#skills', start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    return () => { mm.revert(); st.kill(); ScrollTrigger.removeEventListener('refresh', measure) }
  }, [])
  return (
    <>
      <Navigation />
      <Suspense fallback={null}><Scene /></Suspense>
      <main ref={root}><Hero /><MusicUniverse /><Skills /><About /><Projects /><Contact /></main>
      <CustomCursor /><div className="vig" aria-hidden /><div className="grain" aria-hidden />
    </>
  )
}

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { world } from '../store'
// Dot + ring + light trail. Long amber "flashlight" tail on the Skills page. Disabled on touch.
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null), ring = useRef<HTMLDivElement>(null), cv = useRef<HTMLCanvasElement>(null), lab = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return
    document.documentElement.classList.add('has-cursor')
    const c = cv.current!, x = c.getContext('2d')!; let w = 0, h = 0, raf = 0
    const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight }; rs(); addEventListener('resize', rs)
    const m = { x: w / 2, y: h / 2 }, r = { ...m }, N = 28, tr = Array.from({ length: N }, () => ({ ...m }))
    const mm = (e: MouseEvent) => {
      m.x = e.clientX; m.y = e.clientY; world.mx = e.clientX / innerWidth * 2 - 1; world.my = 1 - e.clientY / innerHeight * 2
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      document.body.dataset.cur = t ? t.dataset.cursor : (e.target as HTMLElement).closest('a,button') ? 'link' : ''
      lab.current!.textContent = t?.dataset.label || ''
      document.querySelectorAll<HTMLElement>('[data-magnet]').forEach(el => { const b = el.getBoundingClientRect(), dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2), near = Math.hypot(dx, dy) < Math.max(b.width, b.height) * .8
        gsap.to(el, { x: near ? dx * .25 : 0, y: near ? dy * .35 : 0, duration: .5, ease: 'power3.out', overwrite: 'auto' }) })
    }
    addEventListener('mousemove', mm)
    const sk = document.getElementById('skills'), io = new IntersectionObserver(([e]) => { document.body.dataset.light = e.isIntersecting ? '1' : '0' }, { threshold: .25 }); if (sk) io.observe(sk)
    const tick = () => {
      r.x += (m.x - r.x) * .16; r.y += (m.y - r.y) * .16
      dot.current!.style.transform = `translate(${m.x}px,${m.y}px)`; ring.current!.style.transform = `translate(${r.x}px,${r.y}px)`
      x.clearRect(0, 0, w, h)
      if (!world.reduce) {
        const L = document.body.dataset.light === '1'; tr[0].x = r.x; tr[0].y = r.y; x.globalCompositeOperation = 'lighter'; x.lineCap = 'round'
        for (let i = 1; i < N; i++) { const a = tr[i - 1], b = tr[i], k = 1 - i / N; b.x += (a.x - b.x) * (L ? .32 : .5); b.y += (a.y - b.y) * (L ? .32 : .5)
          x.strokeStyle = `rgba(${L ? '255,160,60' : '255,255,255'},${k * (L ? .55 : .25)})`; x.lineWidth = k * (L ? 7 : 2.5); x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke() }
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', mm); removeEventListener('resize', rs); io.disconnect(); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return <><canvas ref={cv} className="trail" aria-hidden /><div ref={ring} className="ring" aria-hidden><span ref={lab} /></div><div ref={dot} className="dot" aria-hidden /></>
}

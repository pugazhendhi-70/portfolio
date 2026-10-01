// Masked per-character text; animated by GSAP in App.tsx
export default function Split({ t, cls = '' }: { t: string; cls?: string }) {
  return (
    <span className={'split ' + cls} aria-label={t}>
      {[...t].map((c, i) => <span className="m" key={i} aria-hidden><span className="c">{c === ' ' ? '\u00a0' : c}</span></span>)}
    </span>
  )
}

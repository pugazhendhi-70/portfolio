import { CSSProperties, useState } from 'react'
import type { software } from '../data/portfolio'
type S = (typeof software)[number]
// Original futuristic media-player card: artwork disc, waveform, progress, transport controls.
export default function MusicCard({ s, i }: { s: S; i: number }) {
  const [on, setOn] = useState(false)
  return (
    <article className={'mc' + (on ? ' on' : '')} style={{ '--a': s.accent } as CSSProperties}>
      <div className="mc-in">
        <span className="mc-i">{String(i + 1).padStart(2, '0')}</span>
        <div className="mc-art"><span>{s.abbr}</span></div>
        <h3>{s.name}</h3><p>{s.cat}</p>
        <div className="wave" aria-hidden>{Array.from({ length: 20 }, (_, k) => <i key={k} style={{ '--h': `${25 + ((k * 37 + i * 13) % 70)}%`, '--d': `${(k % 7) * .12}s` } as CSSProperties} />)}</div>
        <div className="bar" aria-hidden><b /></div>
        <div className="ctl">
          <button aria-label="Previous">◀</button>
          <button className="play" aria-pressed={on} aria-label={on ? 'Pause' : 'Play'} onClick={() => setOn(!on)}>{on ? '❚❚' : '▶'}</button>
          <button aria-label="Next">▶▶</button>
        </div>
      </div>
    </article>
  )
}

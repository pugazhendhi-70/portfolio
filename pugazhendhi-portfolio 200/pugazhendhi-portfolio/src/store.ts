import * as THREE from 'three'
// Shared scroll/mouse state read by both the DOM and the 3D scene (no React re-renders).
export const world = {
  p: 0, s: 0, mx: 0, my: 0, stops: [0, .2, .4, .6, .8, 1] as number[],
  reduce: typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  mobile: typeof innerWidth !== 'undefined' && innerWidth < 820,
}
export const PRIM = ['#8b5cf6', '#ff7a1a', '#ff6a1a', '#ff5a1f', '#ff1f1f', '#ff3b1f']
export const SEC = ['#22d3ee', '#c13bff', '#ffb347', '#ff7a1a', '#c13bff', '#ff9a3c']
/** scroll progress -> fractional section index (0 hero … 5 contact) */
export const toStage = (p: number) => {
  const t = world.stops
  for (let i = 0; i < t.length - 1; i++) if (p <= t[i + 1]) return i + (p - t[i]) / Math.max(1e-4, t[i + 1] - t[i])
  return t.length - 1
}
/** eased keyframe lookup, one value per section */
export const key = (s: number, v: number[]) => {
  const i = Math.min(v.length - 2, Math.max(0, Math.floor(s))), f = Math.min(1, Math.max(0, s - i)), e = f * f * (3 - 2 * f)
  return v[i] + (v[i + 1] - v[i]) * e
}
const T = new THREE.Color()
export const colorAt = (s: number, a: string[], out: THREE.Color) => {
  const i = Math.min(a.length - 2, Math.max(0, Math.floor(s))), f = Math.min(1, Math.max(0, s - i))
  return out.set(a[i]).lerp(T.set(a[i + 1]), f * f * (3 - 2 * f))
}

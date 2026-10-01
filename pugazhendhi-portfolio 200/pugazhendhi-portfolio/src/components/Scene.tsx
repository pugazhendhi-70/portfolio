import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'
import { PugazhendhiModel } from './PugazhendhiModel'
import { software } from '../data/portfolio'
import { world, key, toStage, colorAt, PRIM, SEC } from '../store'

const STEP = 16 // world units between sections; the whole site is one forward camera move

function Rig() { // damped camera + palette-reactive lights
  const a = useRef<THREE.PointLight>(null), b = useRef<THREE.PointLight>(null)
  useFrame(({ camera }, dt) => {
    const k = world.reduce ? 0 : 1
    world.s += (toStage(world.p) - world.s) * Math.min(1, dt * 3)
    const z = 9 - world.s * STEP
    camera.position.set(world.mx * .35 * k, world.my * .2 * k, z); camera.lookAt(world.mx * .2 * k, world.my * .1 * k, z - 10)
    a.current!.position.set(-4, 3, z - 3); b.current!.position.set(4, -1, z - 10)
    colorAt(world.s, PRIM, a.current!.color); colorAt(world.s, SEC, b.current!.color)
  })
  return <><pointLight ref={a} intensity={70} distance={30} /><pointLight ref={b} intensity={60} distance={30} /></>
}
function CharacterRig() { // the character travels with the camera and re-composes per page (centre → left for About)
  const g = useRef<THREE.Group>(null), ring = useRef<THREE.Mesh>(null), { size } = useThree()
  useFrame(({ camera }) => {
    const s = world.s, n = size.width < 820
    g.current!.position.set(n ? 0 : key(s, [0, 0, 3.6, -2.9, -6.5, 0]), n ? key(s, [.2, .2, .7, 1.2, 1, 1]) : 0, camera.position.z - 7.5)
    g.current!.scale.setScalar(key(s, n ? [.8, .72, .45, .6, .3, .3] : [1, .9, .58, .95, .5, .4]))
    ;(ring.current!.material as THREE.MeshBasicMaterial).opacity = key(s, [0, 1, .15, 0, 0, 0])
  })
  return (
    <group ref={g}>
      <PugazhendhiModel />
      <mesh ref={ring} position={[0, .4, -1.3]}><torusGeometry args={[2.9, .03, 12, 120]} /><meshBasicMaterial color="#c13bff" transparent toneMapped={false} /></mesh>
    </group>
  )
}
function Particles() {
  const n = world.mobile || world.reduce ? 500 : 1600, ref = useRef<THREE.Points>(null)
  const pos = useMemo(() => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - .5) * 30; a[i * 3 + 1] = (Math.random() - .5) * 16; a[i * 3 + 2] = 14 - Math.random() * 125 } return a }, [n])
  useFrame(({ clock }) => {
    const p = ref.current!; p.rotation.z = clock.elapsedTime * .004; p.position.x += (world.mx * .6 - p.position.x) * .03
    colorAt(world.s, PRIM, (p.material as THREE.PointsMaterial).color)
  })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={.04} sizeAttenuation transparent opacity={.55} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
}
function Debris() { // dark glossy shards drifting through the whole journey (like the cube reference)
  const n = world.mobile ? 30 : 80, r = useRef<THREE.InstancedMesh>(null), o = useMemo(() => new THREE.Object3D(), [])
  const d = useMemo(() => Array.from({ length: n }, () => ({ p: new THREE.Vector3((Math.random() - .5) * 22, (Math.random() - .5) * 11, 12 - Math.random() * 115), s: .08 + Math.random() * .32, v: Math.random() * .6 + .1 })), [n])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * (world.reduce ? .2 : 1)
    d.forEach((q, i) => { o.position.copy(q.p); o.position.y += Math.sin(t * q.v + i) * .4; o.rotation.set(t * q.v, t * q.v * .7 + i, 0); o.scale.setScalar(q.s); o.updateMatrix(); r.current!.setMatrixAt(i, o.matrix) })
    r.current!.instanceMatrix.needsUpdate = true
  })
  return <instancedMesh ref={r} args={[undefined, undefined, n]}><boxGeometry /><meshStandardMaterial color="#12040a" metalness={.9} roughness={.25} emissive="#ff1a1a" emissiveIntensity={.12} /></instancedMesh>
}
function face(s: (typeof software)[number]) {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const x = c.getContext('2d')!; x.fillStyle = '#0b0306'; x.fillRect(0, 0, 256, 256)
  const g = x.createRadialGradient(128, 110, 10, 128, 110, 150); g.addColorStop(0, s.accent + '55'); g.addColorStop(1, '#0000'); x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  x.textAlign = 'center'; x.fillStyle = s.accent; x.font = '700 104px "Space Grotesk",sans-serif'; x.fillText(s.abbr, 128, 138)
  x.fillStyle = '#fff'; x.font = '600 24px Inter,sans-serif'; x.fillText(s.name, 128, 208)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
}
function Cubes() { // Page 05 world: floating software cubes with neon edges
  const refs = useRef<THREE.Group[]>([])
  const box = useMemo(() => new THREE.BoxGeometry(1.5, 1.5, 1.5), [])
  const mats = useMemo(() => { const dark = new THREE.MeshStandardMaterial({ color: '#08020a', metalness: .9, roughness: .2 }); return software.map(s => [dark, dark, dark, dark, new THREE.MeshBasicMaterial({ map: face(s), toneMapped: false }), dark]) }, [])
  const base = useMemo(() => software.map((_, i) => new THREE.Vector3((i % 2 ? 1 : -1) * (3.4 + (i * .83) % 3.2), ((i * 1.9) % 5) - 2.4, -60 - (i * 2.3) % 13)), [])
  useFrame(({ clock }) => { const t = clock.elapsedTime; refs.current.forEach((g, i) => { g.rotation.y = Math.sin(t * .4 + i) * .6; g.rotation.x = Math.cos(t * .3 + i * 2) * .25; g.position.y = base[i].y + Math.sin(t * .6 + i) * .25 }) })
  return <>{software.map((s, i) => (
    <group key={s.name} ref={el => { if (el) refs.current[i] = el }} position={base[i]}>
      <mesh geometry={box} material={mats[i]} />
      <lineSegments><edgesGeometry args={[box]} /><lineBasicMaterial color="#ff2a1a" toneMapped={false} /></lineSegments>
    </group>))}</>
}
function Ribbons() { // glowing neon swirls from the reference
  const geos = useMemo(() => [0, 2.1, 4.2].map(off => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 80 }, (_, i) => { const a = i * .35 + off, r = 5 + Math.sin(i * .2 + off) * 2; return new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.3) * r * .5, -14 - i) })), 220, .03, 6)), [])
  return <>{geos.map((g, i) => <mesh key={i} geometry={g}><meshBasicMaterial color={i === 1 ? '#ff7a1a' : '#ff2a1a'} toneMapped={false} transparent opacity={.85} /></mesh>)}</>
}
function Flyer() { // cinematic light path weaving behind / around / in front of the character
  const r = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, z = 9 - world.s * STEP
    r.current!.position.set(Math.sin(t * .9) * 4.2, Math.cos(t * 1.3) * 2.2, z - 9.5 - Math.sin(t * .55) * 5.5)
    r.current!.visible = world.s > .5 && world.s < 3.6
  })
  return <group ref={r}><Trail width={1.4} length={16} color="#ffb347" attenuation={(t: number) => t * t}><mesh><sphereGeometry args={[.07]} /><meshBasicMaterial color="#ffe2b0" toneMapped={false} /></mesh></Trail><pointLight color="#ffa347" intensity={30} distance={9} /></group>
}
export default function Scene() {
  const fx = !world.mobile && !world.reduce
  return (
    <Canvas dpr={[1, world.mobile ? 1.5 : 2]} camera={{ fov: 40, position: [0, 0, 9], far: 160 }} gl={{ alpha: true, antialias: !world.mobile, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }} aria-hidden>
      <Rig /><ambientLight intensity={.35} />
      <Suspense fallback={null}><CharacterRig /></Suspense>
      <Particles /><Debris /><Cubes /><Ribbons />
      {fx && <Flyer />}
      {fx && <EffectComposer multisampling={0}><Bloom intensity={.9} luminanceThreshold={.55} mipmapBlur /></EffectComposer>}
    </Canvas>
  )
}

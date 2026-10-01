import { Component, ReactNode, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { world, key, colorAt, PRIM, SEC } from '../store'
import { site } from '../data/portfolio'

// Vite serves index.html for missing files, so a 200 + text/html means "no GLB".
function useHasGlb() {
  const [ok, set] = useState(false)
  useEffect(() => { fetch(site.glb, { method: 'HEAD' }).then(r => set(r.ok && !(r.headers.get('content-type') || '').includes('html'))).catch(() => {}) }, [])
  return ok
}
class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { e: boolean }> {
  state = { e: false }
  static getDerivedStateFromError() { return { e: true } }
  render() { return this.state.e ? this.props.fallback : this.props.children }
}
function Glb() {
  const { scene } = useGLTF(site.glb)
  return <primitive object={scene} scale={2.8} position={[0, -2.8, 0]} /> // tune scale/position for your export
}
const vert = `varying vec2 vUv;uniform sampler2D uMap;
void main(){vUv=uv;float a=texture2D(uMap,uv).a;float x=(uv.x-.5)*2.;vec3 p=position;p.z+=a*(.6*exp(-x*x*2.)+.1*uv.y);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`
const frag = `uniform sampler2D uMap;uniform vec3 uA;uniform vec3 uB;uniform float uO;varying vec2 vUv;
void main(){vec4 c=texture2D(uMap,vUv);if(c.a<.02)discard;
float l=max(0.,c.a-texture2D(uMap,vUv-vec2(.01,0.)).a);float r=max(0.,c.a-texture2D(uMap,vUv+vec2(.01,0.)).a);float x=(vUv.x-.5)*2.;
vec3 col=c.rgb*(.5+.5*smoothstep(0.,.8,vUv.y))*(.8+.2*uA);
col+=uA*(l*1.6+smoothstep(.2,1.,-x)*.18)+uB*(r*1.6+smoothstep(.2,1.,x)*.18);
gl_FragColor=vec4(col,c.a*uO*smoothstep(0.,.14,vUv.y));
#include <colorspace_fragment>
}`
// 2.5D fallback: the PNG on a subdivided plane, displaced by its own alpha (body bulge) + rim-lit per section palette.
function Relief() {
  const tex = useTexture(site.image)
  const mat = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    return new THREE.ShaderMaterial({ uniforms: { uMap: { value: tex }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uO: { value: 1 } }, vertexShader: vert, fragmentShader: frag, transparent: true })
  }, [tex])
  useEffect(() => () => mat.dispose(), [mat])
  useFrame(() => {
    colorAt(world.s, PRIM, mat.uniforms.uA.value); colorAt(world.s, SEC, mat.uniforms.uB.value)
    mat.uniforms.uO.value = key(world.s, [1, 1, .6, 1, 0, 0])
  })
  return <mesh position={[0, -.9, 0]} material={mat}><planeGeometry args={[4.21, 5.6, 48, 64]} /></mesh>
}
// Scroll-linked orbit + mouse awareness (damped)
function Orbit({ glb, children }: { glb: boolean; children: ReactNode }) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    const t = world.reduce ? .25 : 1, s = world.s, o = g.current!
    const ry = (glb ? s / 5 * Math.PI * 2 : Math.sin(s * 1.7) * .5) * t + world.mx * .18 * t
    const rx = (-world.my * .06 + key(s, [0, .05, -.04, 0, 0, 0])) * t
    o.rotation.y += (ry - o.rotation.y) * .08; o.rotation.x += (rx - o.rotation.x) * .08
    o.position.y = Math.sin(performance.now() / 1800) * .05 * t
  })
  return <group ref={g}>{children}</group>
}
export function PugazhendhiModel() {
  const glb = useHasGlb()
  const relief = <Relief />
  return <Orbit glb={glb}><Boundary fallback={relief}><Suspense fallback={null}>{glb ? <Glb /> : relief}</Suspense></Boundary></Orbit>
}

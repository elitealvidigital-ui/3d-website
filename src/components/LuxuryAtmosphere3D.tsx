import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'
import * as THREE from 'three'

function GoldenRings() {
  const groupRef = useRef<THREE.Group | null>(null)

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const time = clock.elapsedTime
    groupRef.current.rotation.y = time * 0.08
    groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.08
    easing.damp3(
      groupRef.current.position,
      [1.55 + Math.sin(time * 0.16) * 0.25, Math.cos(time * 0.12) * 0.14, -1.4],
      0.6,
      delta,
    )
  })

  return (
    <group ref={groupRef}>
      {[0, 0.55, -0.55].map((offset, index) => (
        <mesh
          key={offset}
          position={[offset, index === 0 ? 0.05 : -0.08, 0]}
          rotation={[Math.PI / 2.25, 0, index * 0.9]}
        >
          <torusGeometry args={[1.75 + index * 0.18, 0.012, 16, 180]} />
          <meshStandardMaterial
            color="#d9aa45"
            emissive="#a8642a"
            emissiveIntensity={0.75}
            metalness={0.95}
            roughness={0.22}
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function LuxuryAtmosphere3D() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767px)')
    const update = () => setEnabled(!reduceMotion.matches && !mobile.matches)

    update()
    reduceMotion.addEventListener('change', update)
    mobile.addEventListener('change', update)

    return () => {
      reduceMotion.removeEventListener('change', update)
      mobile.removeEventListener('change', update)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className="atmosphere-3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.28} />
        <pointLight position={[2.8, 2.6, 2]} intensity={3.2} color="#f6d783" />
        <pointLight position={[-2.4, -1.6, 2]} intensity={1.8} color="#a8642a" />
        <GoldenRings />
        <Sparkles
          count={72}
          scale={[7.5, 4.8, 2.4]}
          size={2.4}
          speed={0.18}
          color="#f6d783"
        />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.36} luminanceThreshold={0.25} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

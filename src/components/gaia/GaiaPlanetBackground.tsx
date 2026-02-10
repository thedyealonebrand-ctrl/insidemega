import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Starfield ── */
function GaiaStarField({ count = 4000 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 120 + 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.y = s.clock.elapsedTime * 0.003;
      ref.current.rotation.x = s.clock.elapsedTime * 0.001;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#c8e6ff" size={0.1} sizeAttenuation depthWrite={false} opacity={0.9} />
    </Points>
  );
}

/* ── Bioluminescent particles ── */
function BioParticles({ count = 200 }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30 - 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return p;
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.02;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(s.clock.elapsedTime * 0.8 + i * 0.5) * 0.003;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#34d399"
        size={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.7}
      />
    </Points>
  );
}

/* ── Aurora nebula layers ── */
function AuroraLayer({
  position,
  color,
  scale = 1,
  speed = 0.3,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((s) => {
    if (meshRef.current && matRef.current) {
      meshRef.current.rotation.z = s.clock.elapsedTime * 0.008 * speed;
      meshRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.05) * 0.1;
      matRef.current.opacity = 0.06 + Math.sin(s.clock.elapsedTime * speed + position[0]) * 0.025;
    }
  });

  return (
    <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>
    </Float>
  );
}

/* ── Planet sphere ── */
function GaiaPlanet() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = s.clock.elapsedTime * 0.015;
    }
    if (glowRef.current) {
      const sc = 1.08 + Math.sin(s.clock.elapsedTime * 0.4) * 0.02;
      glowRef.current.scale.setScalar(sc);
    }
  });

  return (
    <group position={[0, -18, -30]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[14, 64, 64]} />
        <meshStandardMaterial color="#1a7a5c" emissive="#0d503a" emissiveIntensity={0.4} roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[14.5, 64, 64]} />
        <meshBasicMaterial color="#60d9b4" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh>
        <sphereGeometry args={[15.5, 64, 64]} />
        <meshBasicMaterial color="#93e8c8" transparent opacity={0.03} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ── Camera drift ── */
function GaiaCameraRig() {
  useFrame((s) => {
    s.camera.position.x = Math.sin(s.clock.elapsedTime * 0.06) * 1.5;
    s.camera.position.y = Math.cos(s.clock.elapsedTime * 0.04) * 0.8 + 2;
    s.camera.lookAt(0, -5, -15);
  });
  return null;
}

/* ── Main export ── */
export default function GaiaPlanetBackground() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 30], fov: 70 }}
        dpr={isMobile ? 1 : [1, 2]}
        style={{
          background: "linear-gradient(180deg, #020a14 0%, #041a2e 30%, #082a3a 60%, #0a1f28 100%)",
        }}
      >
        <ambientLight intensity={0.15} color="#a0d8ef" />
        <directionalLight position={[10, 20, 10]} intensity={0.3} color="#60d9b4" />
        <pointLight position={[-15, 10, -20]} intensity={0.2} color="#3b82f6" />

        <GaiaCameraRig />
        <GaiaStarField count={isMobile ? 2000 : 5000} />
        <BioParticles count={isMobile ? 80 : 250} />
        <GaiaPlanet />

        {/* Aurora layers — fewer on mobile */}
        <AuroraLayer position={[-25, 15, -40]} color="#34d399" scale={1.4} speed={0.25} />
        <AuroraLayer position={[20, 20, -45]} color="#60a5fa" scale={1.1} speed={0.35} />
        {!isMobile && (
          <>
            <AuroraLayer position={[0, 25, -50]} color="#38bdf8" scale={1.6} speed={0.2} />
            <AuroraLayer position={[-15, -10, -35]} color="#2dd4bf" scale={0.9} speed={0.4} />
            <AuroraLayer position={[30, 5, -55]} color="#a78bfa" scale={1.2} speed={0.15} />
          </>
        )}
      </Canvas>
    </div>
  );
}

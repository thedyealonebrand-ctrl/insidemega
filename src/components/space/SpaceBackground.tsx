import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

function StarField({ count = 5000 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 100 + 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
      ref.current.rotation.y = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function DistantStars({ count = 3000 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

function Nebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.02;
      materialRef.current.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, -50]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#8b5cf6"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

function NebulaCloud({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.01;
      const baseOpacity = 0.08;
      materialRef.current.opacity = baseOpacity + Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.02;
    }
  });

  return (
    <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[15, 32, 32]} />
        <meshBasicMaterial
          ref={materialRef}
          color={color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles({ count = 100 }) {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 2;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.08) * 1;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SpaceBackground() {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={isMobile ? 1 : [1, 2]}
        style={{ background: "linear-gradient(180deg, #030712 0%, #0a0a1a 50%, #030712 100%)" }}
      >
        <ambientLight intensity={0.1} />
        <CameraRig />
        <StarField count={isMobile ? 2000 : 6000} />
        <DistantStars count={isMobile ? 1500 : 4000} />
        <FloatingParticles count={isMobile ? 50 : 150} />
        <Nebula />
        <NebulaCloud position={[-30, 20, -40]} color="#8b5cf6" scale={1.2} />
        <NebulaCloud position={[25, -15, -35]} color="#06b6d4" scale={0.8} />
        {!isMobile && (
          <>
            <NebulaCloud position={[0, 30, -45]} color="#ec4899" scale={1} />
            <NebulaCloud position={[-20, -25, -50]} color="#3b82f6" scale={1.5} />
          </>
        )}
      </Canvas>
    </div>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const LINE_COUNT = 14;
const ORIGIN = new THREE.Vector3(-3.5, -2, 0);

function generateCurve(seed: number) {
  const spread = 1 + Math.random() * 3;
  const end = new THREE.Vector3(
    2 + Math.random() * 3,
    -1 + Math.random() * 5,
    -1 + Math.random() * 2
  );
  const mid1 = ORIGIN.clone().lerp(end, 0.35).add(
    new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, 0)
  );
  const mid2 = ORIGIN.clone().lerp(end, 0.7).add(
    new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, 0)
  );
  return new THREE.CatmullRomCurve3([ORIGIN, mid1, mid2, end]);
}

function FlowLine({ curve, speed, color }: { curve: THREE.CatmullRomCurve3; speed: number; color: string }) {
  const points = useMemo(() => curve.getPoints(80), [curve]);
  const capsuleRef = useRef<THREE.Mesh>(null);
  const offset = useRef(Math.random());

  useFrame((_, delta) => {
    offset.current = (offset.current + delta * speed * 0.05) % 1;
    if (capsuleRef.current) {
      const pos = curve.getPointAt(offset.current);
      const tangent = curve.getTangentAt(offset.current);
      capsuleRef.current.position.copy(pos);
      capsuleRef.current.lookAt(pos.clone().add(tangent));
      capsuleRef.current.rotateX(Math.PI / 2);
    }
  });

  return (
    <group>
      <Line points={points} color={color} transparent opacity={0.25} lineWidth={1} />
      <mesh ref={capsuleRef} scale={[1, 4, 1]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#FFF5EC" />
      </mesh>
    </group>
  );
}

function Scatter() {
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      arr[i * 3] = -2 + Math.random() * 8;
      arr[i * 3 + 1] = -3 + Math.random() * 7;
      arr[i * 3 + 2] = -2 + Math.random() * 3;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={200} />
      </bufferGeometry>
      <pointsMaterial color="#E54100" size={0.02} transparent opacity={0.5} />
    </points>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const curves = useMemo(
    () => Array.from({ length: LINE_COUNT }, (_, i) => generateCurve(i)),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const x = (state.pointer.x * viewport.width) / 40;
    const y = (state.pointer.y * viewport.height) / 40;
    groupRef.current.rotation.y += (x - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (-y - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <FlowLine key={i} curve={curve} speed={0.6 + Math.random() * 0.8} color="#460E04" />
      ))}
      <Scatter />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      className="!absolute inset-0"
      gl={{ alpha: true, antialias: true }}
    >
      <Scene />
    </Canvas>
  );
}
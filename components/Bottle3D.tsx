// @ts-nocheck
"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  RoundedBox,
  Text,
  Float,
} from "@react-three/drei";
import * as THREE from "three";

/* ── Real bottle specs ──────────────────────────────────────────────
   Height with cap:  6 3/8″ ≈ 162 mm
   Body:             square cross-section, clear PET
   Cap:              black LDPE, 1½″ diameter, ~15 mm tall
   Size:             12 oz / 355 ml
   Scale: 1 unit ≈ 50 mm → body ~2.8 units tall, ~1.3 wide
   ───────────────────────────────────────────────────────────────── */

const BODY_W = 1.1;
const BODY_D = 1.1;
const BODY_H = 2.5;
const CAP_R = 0.38; // cap radius (round)
const CAP_H = 0.28;
const LIQUID_H = BODY_H * 0.6;
const SHOULDER_H = 0.2;

// Inter Bold from Google Fonts (static woff2)
const INTER_BOLD_URL =
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf";

function BottleModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-driven twist with slight tilt
  useFrame(() => {
    if (!groupRef.current) return;
    // Y rotation: twist based on scroll (full 360° over ~2000px scroll)
    const targetY = scrollY * 0.003;
    groupRef.current.rotation.y +=
      (targetY - groupRef.current.rotation.y) * 0.08;
    // X tilt: slight forward lean as user scrolls
    const targetX = Math.min(scrollY * 0.0002, 0.12);
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.06;
  });

  const liquidColor = "#c8893a";

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ── Cap (round with ridges) ── */}
      <group position={[0, BODY_H / 2 + SHOULDER_H + CAP_H / 2, 0]}>
        {/* Main cap body */}
        <mesh>
          <cylinderGeometry args={[CAP_R, CAP_R, CAP_H, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.35} metalness={0.15} />
        </mesh>
        {/* Cap top bevel */}
        <mesh position={[0, CAP_H / 2, 0]}>
          <cylinderGeometry args={[CAP_R - 0.03, CAP_R, 0.04, 32]} />
          <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Vertical grip ridges around the cap */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i / 48) * Math.PI * 2;
          const x = Math.cos(angle) * CAP_R;
          const z = Math.sin(angle) * CAP_R;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.035, CAP_H * 0.75, 0.014]} />
              <meshStandardMaterial color="#0d0d0d" roughness={0.7} metalness={0.05} />
            </mesh>
          );
        })}
        {/* Tamper-evident band */}
        <mesh position={[0, -CAP_H / 2 - 0.04, 0]}>
          <cylinderGeometry args={[CAP_R + 0.01, CAP_R + 0.015, 0.06, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Perforation bridges between cap and band */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x = Math.cos(angle) * (CAP_R + 0.005);
          const z = Math.sin(angle) * (CAP_R + 0.005);
          return (
            <mesh key={`perf-${i}`} position={[x, -CAP_H / 2 - 0.008, z]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.02, 0.015, 0.01]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.1} />
            </mesh>
          );
        })}
        {/* Thin gap line between cap and tamper band */}
        <mesh position={[0, -CAP_H / 2 - 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[CAP_R + 0.008, 0.003, 4, 32]} />
          <meshStandardMaterial color="#333333" roughness={0.3} metalness={0} />
        </mesh>
      </group>

      {/* ── Neck / shoulder taper ── */}
      <mesh position={[0, BODY_H / 2 + SHOULDER_H / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[CAP_R, BODY_W / 2 * 1.05, SHOULDER_H, 32, 1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          roughness={0.05}
          transmission={0.95}
          thickness={0.2}
          ior={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Bottle body (clear PET) ── */}
      <RoundedBox
        args={[BODY_W, BODY_H, BODY_D]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0.02}
          metalness={0}
          transmission={0.95}
          thickness={0.4}
          ior={1.52}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </RoundedBox>


      {/* ── Edge highlights (vertical edges of the square bottle) ── */}
      {[
        [BODY_W / 2 - 0.02, 0, BODY_D / 2 - 0.02],
        [-BODY_W / 2 + 0.02, 0, BODY_D / 2 - 0.02],
        [BODY_W / 2 - 0.02, 0, -BODY_D / 2 + 0.02],
        [-BODY_W / 2 + 0.02, 0, -BODY_D / 2 + 0.02],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.02, BODY_H - 0.1, 0.02]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            roughness={0}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* ── Liquid fill ── */}
      <RoundedBox
        args={[BODY_W - 0.08, LIQUID_H, BODY_D - 0.08]}
        radius={0.1}
        smoothness={4}
        position={[0, -(BODY_H - LIQUID_H) / 2 + 0.04, 0]}
      >
        <meshPhysicalMaterial
          color={liquidColor}
          transparent
          opacity={0.5}
          roughness={0.15}
          metalness={0}
          transmission={0.35}
          thickness={1.2}
          ior={1.33}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* ── Liquid surface ── */}
      <mesh
        position={[0, -(BODY_H - LIQUID_H) / 2 + LIQUID_H / 2 + 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[BODY_W - 0.12, BODY_D - 0.12]} />
        <meshPhysicalMaterial
          color={liquidColor}
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── BOTTEIN label (sideways / vertical on front face) ── */}
      <Text
        position={[0, 0.1, BODY_D / 2 + 0.015]}
        rotation={[0, 0, -Math.PI / 2]}
        fontSize={0.34}
        letterSpacing={0.12}
        font={INTER_BOLD_URL}
        color="#111111"
        anchorX="center"
        anchorY="middle"
        maxWidth={BODY_H * 0.8}
      >
        BOTTEIN
      </Text>

      {/* ── Bottom edge ── */}
      <RoundedBox
        args={[BODY_W + 0.01, 0.06, BODY_D + 0.01]}
        radius={0.03}
        smoothness={8}
        position={[0, -BODY_H / 2 - 0.03, 0]}
      >
        <meshStandardMaterial
          color="#f0f0f0"
          roughness={0.6}
          metalness={0}
          transparent
          opacity={0.3}
        />
      </RoundedBox>
    </group>
  );
}

export default function Bottle3D() {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 360, height: 600 }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 28 }}
        style={{ touchAction: "none" }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={0.9} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.25} />
        <spotLight
          position={[0, 7, 4]}
          intensity={0.4}
          angle={0.35}
          penumbra={0.9}
        />
        {/* Rim light from behind */}
        <pointLight position={[0, 2, -4]} intensity={0.3} color="#ffffff" />

        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
          <BottleModel />
        </Float>

        <ContactShadows
          position={[0, -2.0, 0]}
          opacity={0.3}
          scale={5}
          blur={2.5}
          far={4}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

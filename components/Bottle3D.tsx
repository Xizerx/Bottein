// @ts-nocheck
"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  RoundedBox,
  Html,
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
const BODY_H = 2.1;
const CAP_R = 0.35; // cap radius (round)
const CAP_H = 0.24;
const SHOULDER_H = 0.2;

// Flavors — each reload picks one at random
const FLAVORS: { name: string; fruits: string[] }[] = [
  { name: "blueberry", fruits: ["🫐", "🫐", "🫐"] },
  { name: "strawberry", fruits: ["🍓", "🍓"] },
  { name: "mango-vanilla", fruits: ["🥭", "🥭", "🤍"] },
  { name: "strawberry-banana", fruits: ["🍓", "🍌", "🍌"] },
  { name: "chocolate", fruits: ["🍫"] },
  { name: "matcha", fruits: ["🍵"] },
];

const ADDONS = ["⚡", "✨", "💧"];

// Pick a random flavor on each page load
const chosenFlavor = FLAVORS[Math.floor(Math.random() * FLAVORS.length)];

// Build emoji list: 5 protein, flavor fruits (1-3), 3 addons
const fruitEmojis = chosenFlavor.fruits.map((f) => ({ char: f, size: 0.38 }));
const proteinEmojis = Array.from({ length: 5 }, () => ({
  char: "🥛",
  size: 0.38 + Math.random() * 0.04,
}));
const addonEmojis = ADDONS.map((a) => ({ char: a, size: 0.35 }));

// Order: protein at bottom, addons in middle, fruits on top
const EMOJI_LIST = [
  ...proteinEmojis,
  ...addonEmojis,
  ...fruitEmojis,
];

// Column-based stacking: place emojis in 3 columns, stack vertically
// This prevents overlap while still looking natural
const BOTTOM_Y = -BODY_H / 2 + 0.25;
const STACK_SPACING = 0.34; // vertical gap between stacked emojis

function generateStackedPositions() {
  // 3 columns with slight random x offsets
  const columns: { x: number; z: number; count: number }[] = [
    { x: -0.25 + (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.2, count: 0 },
    { x: 0 + (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.2, count: 0 },
    { x: 0.25 + (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.2, count: 0 },
  ];

  // Shuffle emoji indices for random column assignment
  const indices = EMOJI_LIST.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const positions: { pos: [number, number, number]; restY: number }[] = new Array(EMOJI_LIST.length);

  for (const idx of indices) {
    // Pick the column with fewest emojis (distribute evenly)
    const col = columns.reduce((a, b) => (a.count <= b.count ? a : b));
    const restY = BOTTOM_Y + col.count * STACK_SPACING;
    const x = col.x + (Math.random() - 0.5) * 0.06; // tiny jitter
    const z = col.z + (Math.random() - 0.5) * 0.06;
    positions[idx] = {
      pos: [x, BOTTOM_Y + 2 + Math.random() * 1.5, z],
      restY,
    };
    col.count++;
  }

  return positions;
}

const INITIAL_POSITIONS = generateStackedPositions();

const EMOJIS = EMOJI_LIST.map((e, i) => ({
  char: e.char,
  size: e.size,
  pos: INITIAL_POSITIONS[i].pos,
  restY: INITIAL_POSITIONS[i].restY,
}));


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


  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
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
        {/* Vertical knurl ridges — fins from bottom of cap with rounded tops */}
        {Array.from({ length: 72 }).map((_, i) => {
          const angle = (i / 72) * Math.PI * 2;
          const ridgeH = CAP_H * 0.75;
          const x = Math.cos(angle) * (CAP_R + 0.004);
          const z = Math.sin(angle) * (CAP_R + 0.004);
          return (
            <group key={i} position={[x, -CAP_H / 2 + ridgeH / 2, z]} rotation={[0, -angle, 0]}>
              {/* Ridge body */}
              <mesh>
                <boxGeometry args={[0.018, ridgeH, 0.018]} />
                <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.02} />
              </mesh>
              {/* Rounded top */}
              <mesh position={[0, ridgeH / 2, 0]}>
                <sphereGeometry args={[0.009, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#0d0d0d" roughness={0.8} metalness={0.02} />
              </mesh>
            </group>
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

      {/* ── Fruit & protein emojis with gravity ── */}
      {EMOJIS.map((emoji, i) => (
        <FallingEmoji key={`emoji-${i}`} emoji={emoji} index={i} scrollY={scrollY} />
      ))}

      {/* ── BOTTEIN label (top-right corner, vertical) ── */}
      <group position={[BODY_W / 2 - 0.18, BODY_H / 2 - 0.75, BODY_D / 2 + 0.06]}>
        <Html
          center
          transform
          distanceFactor={4}
          zIndexRange={[10, 10]}
          rotation={[0, 0, -Math.PI / 2]}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "0.12em",
            color: "#111111",
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          BOTTEIN
        </Html>
      </group>

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

function FallingEmoji({ emoji, index, scrollY }: { emoji: typeof EMOJIS[0]; index: number; scrollY: number }) {
  const ref = useRef<THREE.Group>(null!);
  const velocity = useRef(0);
  const posY = useRef(emoji.pos[1]); // start from random high position
  const settled = useRef(false);
  const lastScrollY = useRef(0);
  const bobOffset = useRef(Math.random() * Math.PI * 2);
  const bobSpeed = useRef(0.3 + Math.random() * 0.3);
  const restY = emoji.restY;

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Detect scroll change and add bounce impulse
    const scrollDelta = Math.abs(scrollY - lastScrollY.current);
    lastScrollY.current = scrollY;
    if (settled.current && scrollDelta > 2) {
      const impulse = Math.min(scrollDelta * 0.004, 0.8) * (0.5 + Math.random() * 0.5);
      velocity.current = impulse;
      settled.current = false;
    }

    if (!settled.current) {
      velocity.current -= 3.5 * delta;
      posY.current += velocity.current * delta;
      if (posY.current <= restY) {
        posY.current = restY;
        velocity.current *= -0.25;
        if (Math.abs(velocity.current) < 0.05) {
          settled.current = true;
          velocity.current = 0;
        }
      }
      // Cap at top of bottle
      if (posY.current > BODY_H / 2 - 0.2) {
        posY.current = BODY_H / 2 - 0.2;
        velocity.current *= -0.5;
      }
      ref.current.position.y = posY.current;
    } else {
      const t = state.clock.elapsedTime;
      ref.current.position.y = restY + Math.sin(t * bobSpeed.current + bobOffset.current) * 0.01;
    }
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * bobSpeed.current * 0.5 + bobOffset.current) * 0.06;
  });

  return (
    <group ref={ref} position={[emoji.pos[0], emoji.pos[1], emoji.pos[2]]}>
      <Html
        center
        distanceFactor={4}
        zIndexRange={[0, 0]}
        style={{
          fontSize: `${Math.round(emoji.size * 160)}px`,
          userSelect: "none",
          pointerEvents: "none",
          lineHeight: 1,
        }}
      >
        {emoji.char}
      </Html>
    </group>
  );
}

export default function Bottle3D() {
  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 360, height: 600, overflow: "hidden" }}
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


        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}

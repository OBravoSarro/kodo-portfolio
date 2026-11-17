import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useSlotList, type SceneVariant, type SlotEntry } from './avatarStore';
import { islandBob, seedFromId, slotLayout } from './layout';

/**
 * One small floating island per slot. Each island is a miniature that talks
 * about its section (a garden to say hello, a post box for the letter, a city
 * for enterprise projects…). Units: 1 = slot height, origin = island top.
 */

export const ISLAND_TILT = 0.16;
const ISLAND_YAW = -0.55;

type Vec3 = [number, number, number];

const materialCache = new Map<string, THREE.MeshStandardMaterial>();
function mat(color: string, roughness = 0.85, emissive?: string) {
  const key = `${color}-${roughness}-${emissive ?? ''}`;
  let material = materialCache.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      emissive: emissive ?? '#000000',
      emissiveIntensity: emissive ? 1 : 0,
    });
    materialCache.set(key, material);
  }
  return material;
}

const C = {
  grass: '#97b487',
  grassDark: '#7f9d70',
  soil: '#a58f77',
  soil2: '#917b66',
  soil3: '#7d6957',
  soil4: '#6c5a4a',
  stone: '#cfc9be',
  stoneDark: '#b3ada2',
  wood: '#7b5543',
  water: '#a3cfd6',
  red: '#c2412d',
  redDark: '#9e3322',
  ink: '#1d1d1f',
  paper: '#f4efe6',
  leaf: '#6f9467',
  leafLight: '#8fb184',
  blossom: '#f2b3bf',
  blossomLight: '#f8d3d9',
  blossomDeep: '#e595a6',
  glow: '#ffd9a0',
} as const;

function B({ s, p = [0, 0, 0], r, c, rough, glow, rad = 0.012 }: { s: Vec3; p?: Vec3; r?: Vec3; c: string; rough?: number; glow?: string; rad?: number }) {
  return (
    <RoundedBox
      args={s}
      radius={Math.max(0.002, Math.min(rad, Math.min(...s) / 2 - 0.001))}
      smoothness={3}
      position={p}
      rotation={r}
      material={mat(c, rough, glow)}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Base island                                                               */
/* ------------------------------------------------------------------------ */

function Island({ seed }: { seed: number }) {
  const pebbles = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!pebbles.current) return;
    pebbles.current.children.forEach((child, index) => {
      child.position.y = -0.31 - index * 0.03 + Math.sin(clock.elapsedTime * 0.9 + index * 2 + seed) * 0.012;
      child.rotation.y += 0.002 * (index + 1);
    });
  });
  const W = 0.82;
  const D = 0.52;
  return (
    <group>
      <B s={[W, 0.04, D]} p={[0, -0.02, 0]} c={C.grass} rad={0.016} />
      <B s={[W * 0.985, 0.03, D * 0.985]} p={[0, -0.05, 0]} c={C.grassDark} />
      <B s={[W * 0.95, 0.07, D * 0.94]} p={[0, -0.095, 0]} c={C.soil} />
      <B s={[W * 0.72, 0.06, D * 0.7]} p={[0.02, -0.155, 0.01]} c={C.soil2} />
      <B s={[W * 0.46, 0.055, D * 0.46]} p={[-0.02, -0.21, 0]} c={C.soil3} />
      <B s={[W * 0.2, 0.05, D * 0.22]} p={[0.01, -0.255, 0.01]} c={C.soil4} />
      <group ref={pebbles}>
        <B s={[0.04, 0.035, 0.04]} p={[0.16, -0.31, 0.04]} c={C.soil3} />
        <B s={[0.025, 0.022, 0.025]} p={[-0.14, -0.34, -0.02]} c={C.soil2} />
      </group>
      <B s={[0.05, 0.025, 0.04]} p={[0.33, 0.012, 0.19]} c={C.stone} />
      <B s={[0.03, 0.018, 0.03]} p={[0.28, 0.009, 0.21]} c={C.stoneDark} />
    </group>
  );
}

/* ------------------------------------------------------------------------ */
/* Props                                                                     */
/* ------------------------------------------------------------------------ */

function CherryTree({ p, scale = 1 }: { p: Vec3; scale?: number }) {
  const crown = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (crown.current) crown.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + p[0] * 4) * 0.025;
  });
  return (
    <group position={p} scale={scale}>
      <B s={[0.035, 0.22, 0.035]} p={[0, 0.11, 0]} c={C.wood} />
      <B s={[0.025, 0.08, 0.025]} p={[0.04, 0.2, 0]} r={[0, 0, -0.7]} c={C.wood} />
      <group ref={crown} position={[0, 0.2, 0]}>
        <B s={[0.22, 0.11, 0.19]} p={[0, 0.06, 0]} c={C.blossom} rad={0.03} />
        <B s={[0.16, 0.09, 0.15]} p={[-0.07, 0.13, 0.02]} c={C.blossomLight} rad={0.03} />
        <B s={[0.13, 0.08, 0.12]} p={[0.07, 0.12, -0.03]} c={C.blossomDeep} rad={0.03} />
        <B s={[0.09, 0.07, 0.09]} p={[0.11, 0.03, 0.06]} c={C.blossomLight} rad={0.025} />
      </group>
    </group>
  );
}

function Pine({ p, scale = 1 }: { p: Vec3; scale?: number }) {
  return (
    <group position={p} scale={scale}>
      <B s={[0.03, 0.14, 0.03]} p={[0, 0.07, 0]} c={C.wood} />
      <B s={[0.19, 0.05, 0.15]} p={[0, 0.14, 0]} c={C.leaf} rad={0.02} />
      <B s={[0.14, 0.05, 0.11]} p={[0.02, 0.2, 0]} c={C.leafLight} rad={0.02} />
      <B s={[0.08, 0.05, 0.07]} p={[0.01, 0.26, 0]} c={C.leaf} rad={0.02} />
    </group>
  );
}

function Bush({ p }: { p: Vec3 }) {
  return (
    <group position={p}>
      <B s={[0.1, 0.06, 0.08]} p={[0, 0.03, 0]} c={C.leaf} rad={0.025} />
      <B s={[0.07, 0.05, 0.06]} p={[0.04, 0.06, 0.01]} c={C.leafLight} rad={0.02} />
    </group>
  );
}

function StoneLantern({ p }: { p: Vec3 }) {
  return (
    <group position={p}>
      <B s={[0.07, 0.02, 0.07]} p={[0, 0.01, 0]} c={C.stoneDark} />
      <B s={[0.028, 0.08, 0.028]} p={[0, 0.06, 0]} c={C.stone} />
      <B s={[0.07, 0.05, 0.07]} p={[0, 0.125, 0]} c={C.stone} />
      <B s={[0.04, 0.03, 0.072]} p={[0, 0.125, 0]} c={C.glow} glow="#ffb866" />
      <B s={[0.1, 0.022, 0.1]} p={[0, 0.16, 0]} c={C.stoneDark} />
      <B s={[0.025, 0.025, 0.025]} p={[0, 0.183, 0]} c={C.stone} />
    </group>
  );
}

function Cloud({ p, speed = 1, scale = 1 }: { p: Vec3; speed?: number; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.x = p[0] + Math.sin(clock.elapsedTime * 0.18 * speed) * 0.05;
    ref.current.position.y = p[1] + Math.sin(clock.elapsedTime * 0.31 * speed) * 0.012;
  });
  return (
    <group ref={ref} position={p} scale={scale}>
      <B s={[0.12, 0.045, 0.06]} p={[-0.07, 0, 0]} c="#ffffff" rough={1} rad={0.02} />
      <B s={[0.13, 0.07, 0.07]} p={[0.01, 0.022, 0]} c="#ffffff" rough={1} rad={0.03} />
      <B s={[0.1, 0.04, 0.055]} p={[0.09, -0.002, 0]} c="#f4f4f6" rough={1} rad={0.018} />
    </group>
  );
}

function Petals() {
  const ref = useRef<THREE.Group>(null);
  const petals = useMemo(() => Array.from({ length: 7 }, (_, i) => ({
    x: -0.36 + i * 0.11, z: Math.sin(i * 2.3) * 0.18, offset: i * 0.37, speed: 0.06 + (i % 3) * 0.015,
  })), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const petal = petals[i];
      if (!petal) return;
      const phase = (clock.elapsedTime * petal.speed + petal.offset) % 1;
      child.position.set(petal.x + Math.sin(phase * 6 + i) * 0.04, 0.6 - phase * 0.62, petal.z);
      child.rotation.set(phase * 8, phase * 5 + i, phase * 3);
    });
  });
  return (
    <group ref={ref}>
      {petals.map((_, i) => (
        <mesh key={i} material={mat(i % 2 ? C.blossom : C.blossomLight, 0.9)}>
          <planeGeometry args={[0.018, 0.012]} />
        </mesh>
      ))}
    </group>
  );
}

function Floating({ children, p, amp = 0.015, speed = 1, spin = 0 }: { children: ReactNode; p: Vec3; amp?: number; speed?: number; spin?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    ref.current.position.y = p[1] + Math.sin(clock.elapsedTime * speed) * amp;
    ref.current.rotation.y += spin * delta;
  });
  return <group ref={ref} position={p}>{children}</group>;
}

/* ------------------------------------------------------------------------ */
/* Variants                                                                  */
/* ------------------------------------------------------------------------ */

function Garden() {
  return (
    <>
      <CherryTree p={[-0.33, 0, -0.14]} scale={1.05} />
      <StoneLantern p={[0.28, 0, -0.12]} />
      <mesh position={[0.2, 0.003, 0.12]} rotation={[-Math.PI / 2, 0, 0]} material={mat(C.water, 0.2)}>
        <circleGeometry args={[0.075, 40]} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <B key={i} s={[0.06, 0.012, 0.045]} p={[-0.08 + i * 0.05, 0.006, 0.17 - i * 0.02]} c={C.stone} />
      ))}
      <Petals />
      <Cloud p={[-0.42, 0.72, -0.3]} scale={1.1} />
      <Cloud p={[0.45, 0.58, -0.25]} speed={0.7} scale={0.8} />
    </>
  );
}

function Mailbox() {
  const envelope = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!envelope.current) return;
    const t = clock.elapsedTime;
    envelope.current.position.set(0.22 + Math.sin(t * 0.6) * 0.02, 0.36 + Math.sin(t * 1.1) * 0.02, 0);
    envelope.current.rotation.set(Math.sin(t * 0.9) * 0.15, Math.sin(t * 0.5) * 0.4, Math.sin(t * 0.7) * 0.12);
  });
  return (
    <>
      {/* Japanese-style red post box */}
      <group position={[0.29, 0, -0.08]}>
        <B s={[0.03, 0.05, 0.03]} p={[0, 0.025, 0]} c={C.ink} />
        <B s={[0.085, 0.15, 0.075]} p={[0, 0.125, 0]} c={C.red} rad={0.02} />
        <B s={[0.1, 0.025, 0.09]} p={[0, 0.21, 0]} c={C.redDark} rad={0.01} />
        <B s={[0.05, 0.008, 0.006]} p={[0, 0.17, 0.039]} c={C.ink} />
        <B s={[0.04, 0.025, 0.004]} p={[0, 0.115, 0.039]} c={C.paper} />
      </group>
      <group ref={envelope}>
        <B s={[0.08, 0.05, 0.006]} c={C.paper} rad={0.003} />
        <B s={[0.012, 0.012, 0.004]} p={[0, 0.002, 0.004]} c={C.red} rad={0.003} />
      </group>
      <Bush p={[-0.3, 0, -0.1]} />
      <Pine p={[-0.22, 0, -0.18]} scale={0.8} />
      <Cloud p={[-0.4, 0.66, -0.3]} speed={0.8} scale={0.9} />
    </>
  );
}

function Path() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <B key={i} s={[0.09, 0.025 + i * 0.025, 0.08]} p={[-0.34 + i * 0.1, (0.025 + i * 0.025) / 2, 0.16 - i * 0.08]} c={i % 2 ? C.stone : C.stoneDark} />
      ))}
      <group position={[-0.3, 0, -0.16]}>
        <B s={[0.018, 0.2, 0.018]} p={[0, 0.1, 0]} c={C.wood} />
        <B s={[0.13, 0.045, 0.012]} p={[0.03, 0.17, 0.01]} r={[0, 0, 0.04]} c={C.paper} />
        <B s={[0.06, 0.008, 0.002]} p={[0.02, 0.172, 0.017]} c={C.red} />
      </group>
      <Pine p={[0.28, 0, -0.12]} scale={1.15} />
      <Bush p={[0.32, 0, 0.12]} />
    </>
  );
}

function City() {
  const windows = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!windows.current) return;
    windows.current.children.forEach((child, i) => {
      child.visible = Math.sin(clock.elapsedTime * 0.5 + i * 2.1) > -0.6;
    });
  });
  return (
    <>
      <B s={[0.1, 0.42, 0.1]} p={[0.2, 0.21, -0.14]} c={C.ink} rough={0.5} />
      <B s={[0.03, 0.06, 0.03]} p={[0.2, 0.45, -0.14]} c={C.red} />
      <group ref={windows}>
        {[0.1, 0.18, 0.26, 0.34].map((y) => (
          <B key={y} s={[0.07, 0.018, 0.004]} p={[0.2, y, -0.088]} c={C.glow} glow="#ffb866" rad={0.003} />
        ))}
      </group>
      <B s={[0.09, 0.27, 0.09]} p={[0.32, 0.135, -0.03]} c="#ecebe7" />
      <B s={[0.08, 0.18, 0.08]} p={[0.3, 0.09, 0.1]} c="#d9d7d1" />
      <B s={[0.1, 0.22, 0.09]} p={[-0.28, 0.11, -0.14]} c="#d3dde2" />
      <B s={[0.07, 0.13, 0.07]} p={[-0.32, 0.065, 0.02]} c="#ecebe7" />
      <Floating p={[-0.2, 0.42, -0.05]} amp={0.02} speed={1.2} spin={0.6}>
        <B s={[0.04, 0.04, 0.04]} c={C.red} />
      </Floating>
      <Floating p={[0.05, 0.56, -0.2]} amp={0.015} speed={0.9} spin={-0.4}>
        <B s={[0.03, 0.03, 0.03]} c="#8fb3c9" />
      </Floating>
    </>
  );
}

function Blocks() {
  return (
    <>
      <group position={[-0.28, 0, -0.06]}>
        <B s={[0.085, 0.085, 0.085]} p={[0, 0.043, 0]} c={C.red} rad={0.014} />
        <B s={[0.075, 0.075, 0.075]} p={[0.01, 0.124, 0]} r={[0, 0.4, 0]} c={C.paper} rad={0.014} />
        <B s={[0.06, 0.06, 0.06]} p={[0, 0.192, 0]} r={[0, -0.3, 0]} c="#8fb3c9" rad={0.012} />
        <B s={[0.07, 0.07, 0.07]} p={[0.1, 0.035, 0.08]} r={[0, 0.7, 0]} c="#e9c46a" rad={0.012} />
      </group>
      <Floating p={[0.26, 0.38, -0.05]} amp={0.02} speed={1} spin={0.5}>
        <B s={[0.07, 0.07, 0.07]} r={[0.6, 0, 0.6]} c={C.ink} rough={0.4} rad={0.012} />
      </Floating>
      <Pine p={[0.3, 0, -0.14]} scale={0.9} />
    </>
  );
}

function Books() {
  const plane = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!plane.current) return;
    const t = clock.elapsedTime * 0.45;
    plane.current.position.set(Math.cos(t) * 0.38, 0.42 + Math.sin(t * 2) * 0.04, Math.sin(t) * 0.24);
    plane.current.rotation.set(0, -t, Math.sin(t * 2) * 0.25);
  });
  return (
    <>
      <group position={[0.27, 0, -0.06]}>
        <B s={[0.17, 0.035, 0.12]} p={[0, 0.018, 0]} c="#2f4858" />
        <B s={[0.16, 0.035, 0.115]} p={[0.005, 0.053, 0]} r={[0, 0.18, 0]} c={C.red} />
        <B s={[0.15, 0.03, 0.11]} p={[-0.004, 0.086, 0]} r={[0, -0.12, 0]} c={C.paper} />
      </group>
      <group ref={plane}>
        <mesh rotation={[0, 0, -Math.PI / 2]} scale={[1, 1, 0.25]} material={mat('#ffffff', 0.7)}>
          <coneGeometry args={[0.035, 0.11, 3]} />
        </mesh>
      </group>
      <CherryTree p={[-0.28, 0, -0.12]} scale={0.85} />
    </>
  );
}

const sunMaterial = new THREE.MeshBasicMaterial({ color: C.red });

function Torii() {
  return (
    <>
      <Billboard position={[0.05, 0.86, -0.36]}>
        <mesh material={sunMaterial}>
          <circleGeometry args={[0.15, 64]} />
        </mesh>
      </Billboard>
      <group position={[0, 0, -0.2]}>
        <B s={[0.036, 0.7, 0.036]} p={[-0.24, 0.35, 0]} c={C.red} />
        <B s={[0.036, 0.7, 0.036]} p={[0.24, 0.35, 0]} c={C.red} />
        <B s={[0.54, 0.028, 0.032]} p={[0, 0.6, 0]} c={C.red} />
        <B s={[0.6, 0.034, 0.05]} p={[0, 0.68, 0]} c={C.red} />
        <B s={[0.68, 0.03, 0.06]} p={[0, 0.71, 0]} r={[0, 0, 0]} c={C.ink} />
        <B s={[0.04, 0.06, 0.012]} p={[0, 0.64, 0.018]} c={C.ink} />
      </group>
      {[-0.34, 0.34].map((x, i) => (
        <Floating key={x} p={[x, 0.34, 0.04]} amp={0.018} speed={0.8 + i * 0.3}>
          <B s={[0.045, 0.06, 0.045]} c={C.glow} glow="#ffb866" rad={0.018} />
          <B s={[0.05, 0.01, 0.05]} p={[0, 0.035, 0]} c={C.ink} />
        </Floating>
      ))}
    </>
  );
}

const VARIANTS: Record<SceneVariant, () => JSX.Element> = {
  garden: Garden,
  mailbox: Mailbox,
  path: Path,
  city: City,
  blocks: Blocks,
  books: Books,
  torii: Torii,
};

/* ------------------------------------------------------------------------ */
/* Placement                                                                 */
/* ------------------------------------------------------------------------ */

function Diorama({ entry }: { entry: SlotEntry }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => seedFromId(entry.id), [entry.id]);
  const Variant = VARIANTS[entry.scene];

  useFrame(({ size, clock }) => {
    const group = ref.current;
    if (!group) return;
    const layout = slotLayout(entry.el.getBoundingClientRect(), size.width, size.height);
    group.visible = layout.visible;
    if (!layout.visible) return;
    const scale = layout.unit * layout.fit;
    group.position.set(layout.x, layout.ground + islandBob(clock.elapsedTime, seed) * layout.unit, -scale * 0.08);
    group.scale.setScalar(scale);
  });

  return (
    <group ref={ref}>
      <group rotation={[ISLAND_TILT, ISLAND_YAW * (entry.facing === -1 ? -1 : 1), 0]}>
        <Island seed={seed} />
        <Variant />
      </group>
    </group>
  );
}

export function DioramaLayer() {
  const slots = useSlotList();
  return (
    <>
      {slots.map((entry) => <Diorama key={entry.id} entry={entry} />)}
    </>
  );
}

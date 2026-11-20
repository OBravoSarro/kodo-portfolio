import { useMemo, type ReactNode } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { avatar } from '../../content/portfolio';
import { MODEL_HEIGHT } from './layout';

export { MODEL_HEIGHT };

/**
 * Procedural, stylised portrait built from rounded blocks — the same
 * soft-voxel language as the rest of the site. The likeness comes from the
 * active profile (`avatar` in profiles/<id>/content.ts): hair style, beard,
 * forearm tattoo, smartwatch and palette. The defaults below are Óscar's:
 * shaved head, full dark beard, black short-sleeve shirt over a black tee.
 *
 * Units: feet at y = 0, top of the head at ≈ 1.93.
 */

const HIP = 0.62;

export interface Joints {
  root: THREE.Group | null;
  body: THREE.Group | null;
  torso: THREE.Group | null;
  head: THREE.Group | null;
  lShoulder: THREE.Group | null;
  lElbow: THREE.Group | null;
  rShoulder: THREE.Group | null;
  rElbow: THREE.Group | null;
  lLeg: THREE.Group | null;
  rLeg: THREE.Group | null;
  eyes: THREE.Group | null;
  /** Open book held in both hands (only visible in poses with `prop: 'book'`). */
  book: THREE.Group | null;
  shadow: THREE.Mesh | null;
  /** Every body material, so the stage can fade the character in and out. */
  materials: THREE.Material[];
}

export function createJoints(): Joints {
  return {
    root: null, body: null, torso: null, head: null,
    lShoulder: null, lElbow: null, rShoulder: null, rElbow: null,
    lLeg: null, rLeg: null, eyes: null, book: null, shadow: null, materials: [],
  };
}

const DEFAULT_PALETTE = {
  skin: '#d9a98b',
  skinShade: '#c99578',
  beard: '#2a2320',
  beardGrey: '#5f5650',
  brow: '#2a2320',
  shirt: '#222226',
  shirtDetail: '#2f2f35',
  button: '#55555c',
  tee: '#161618',
  trousers: '#30343d',
  shoe: '#f2f1ee',
  sole: '#c9c6bf',
  eye: '#1c1917',
  lip: '#b06a5b',
  watch: '#111113',
  watchScreen: '#1f2a33',
  bookCover: '#c2412d',
  bookSpine: '#9e3322',
  page: '#f4efe6',
  hair: '#2a2320',
};

const PALETTE = { ...DEFAULT_PALETTE, ...avatar.palette };

type Vec3 = [number, number, number];

function Block({
  size, position = [0, 0, 0], rotation, radius = 0.04, material, children,
}: {
  size: Vec3;
  position?: Vec3;
  rotation?: Vec3;
  radius?: number;
  material: THREE.Material;
  children?: ReactNode;
}) {
  const r = Math.min(radius, Math.min(...size) / 2 - 0.001);
  return (
    <RoundedBox args={size} radius={Math.max(r, 0.002)} smoothness={4} position={position} rotation={rotation} material={material}>
      {children}
    </RoundedBox>
  );
}

/** Irezumi-inspired sleeve: waves, a red peony and leaves, painted on a canvas. */
function createTattooTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = PALETTE.skin;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Waves.
  ctx.lineCap = 'round';
  for (let row = 0; row < 9; row += 1) {
    const y = 40 + row * 56;
    ctx.strokeStyle = row % 2 ? 'rgba(42,56,74,0.85)' : 'rgba(58,74,94,0.7)';
    ctx.lineWidth = 9;
    for (let col = -1; col < 5; col += 1) {
      const x = col * 64 + (row % 2) * 32;
      ctx.beginPath();
      ctx.arc(x + 32, y, 26, Math.PI, Math.PI * 1.95);
      ctx.stroke();
    }
  }

  // Leaves.
  ctx.fillStyle = 'rgba(52,84,66,0.9)';
  [[70, 300, -0.6], [190, 120, 0.7], [150, 420, 0.3]].forEach(([x, y, angle]) => {
    ctx.save();
    ctx.translate(x!, y!);
    ctx.rotate(angle!);
    ctx.beginPath();
    ctx.ellipse(0, 0, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Peonies.
  const peony = (cx: number, cy: number, r: number) => {
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? '#b8332c' : '#cf4a3c';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#7d1f1c';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.32, 0, Math.PI * 2);
    ctx.fill();
  };
  peony(120, 210, 52);
  peony(60, 450, 34);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
  gradient.addColorStop(0.55, 'rgba(0,0,0,0.18)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

function useMaterials() {
  return useMemo(() => {
    const standard = (color: string, roughness = 0.8, metalness = 0) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const tattooMap = createTattooTexture();
    const shadowMap = createShadowTexture();
    return {
      skin: standard(PALETTE.skin, 0.62),
      scalp: standard(PALETTE.skin, 0.42),
      skinShade: standard(PALETTE.skinShade, 0.7),
      tattoo: new THREE.MeshStandardMaterial({ color: '#ffffff', map: tattooMap, roughness: 0.62 }),
      beard: standard(PALETTE.beard, 1),
      hair: standard(PALETTE.hair, 0.85),
      beardGrey: standard(PALETTE.beardGrey, 1),
      brow: standard(PALETTE.brow, 1),
      shirt: standard(PALETTE.shirt, 0.92),
      shirtDetail: standard(PALETTE.shirtDetail, 0.9),
      button: standard(PALETTE.button, 0.4, 0.3),
      tee: standard(PALETTE.tee, 0.95),
      trousers: standard(PALETTE.trousers, 0.9),
      shoe: standard(PALETTE.shoe, 0.55),
      sole: standard(PALETTE.sole, 0.7),
      eye: standard(PALETTE.eye, 0.25),
      eyeLight: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
      lip: standard(PALETTE.lip, 0.6),
      watch: standard(PALETTE.watch, 0.35, 0.2),
      watchScreen: standard(PALETTE.watchScreen, 0.08, 0.5),
      bookCover: standard(PALETTE.bookCover, 0.75),
      bookSpine: standard(PALETTE.bookSpine, 0.8),
      page: standard(PALETTE.page, 0.95),
      shadow: new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, opacity: 0.9 }),
    };
  }, []);
}

type Materials = ReturnType<typeof useMaterials>;

function Arm({ side, joints, m }: { side: 'l' | 'r'; joints: Joints; m: Materials }) {
  const s = side === 'l' ? 1 : -1;
  const tattooed = avatar.tattoo && side === 'r';
  const watch = avatar.watch && side === 'l';
  return (
    <group
      position={[0.385 * s, 0.56, 0]}
      ref={(g) => { joints[side === 'l' ? 'lShoulder' : 'rShoulder'] = g; }}
    >
      {/* Short sleeve */}
      <Block size={[0.205, 0.27, 0.215]} position={[0.01 * s, -0.1, 0]} radius={0.085} material={m.shirt} />
      <Block size={[0.15, 0.1, 0.16]} position={[0.005 * s, -0.28, 0]} radius={0.05} material={tattooed ? m.tattoo : m.skin} />
      <group position={[0.005 * s, -0.31, 0]} rotation-order="YXZ" ref={(g) => { joints[side === 'l' ? 'lElbow' : 'rElbow'] = g; }}>
        <Block size={[0.145, 0.27, 0.152]} position={[0, -0.13, 0]} radius={0.06} material={tattooed ? m.tattoo : m.skin} />
        {watch && (
          <>
            <Block size={[0.162, 0.055, 0.168]} position={[0, -0.235, 0]} radius={0.02} material={m.watch} />
            <Block size={[0.02, 0.07, 0.06]} position={[0.083, -0.235, 0]} radius={0.008} material={m.watchScreen} />
          </>
        )}
        {/* Hand */}
        <Block size={[0.125, 0.14, 0.13]} position={[0, -0.33, 0.005]} radius={0.05} material={m.skin} />
        <Block size={[0.05, 0.08, 0.05]} position={[-0.03 * s, -0.3, 0.07]} radius={0.022} material={m.skinShade} />
      </group>
    </group>
  );
}

/**
 * Shoulder-length hair: crown cap, a back panel falling to the neck, side
 * locks that hide the ears and a side-swept fringe that leaves the brows clear.
 * Head space: the head block spans y 0.01–0.59 and z −0.26–0.26.
 */
function LongHair({ m }: { m: Materials }) {
  return (
    <group>
      <Block size={[0.6, 0.24, 0.58]} position={[0, 0.5, -0.02]} radius={0.12} material={m.hair} />
      <Block size={[0.6, 0.6, 0.2]} position={[0, 0.2, -0.2]} radius={0.09} material={m.hair} />
      {([1, -1] as const).map((s) => (
        <Block key={s} size={[0.08, 0.5, 0.36]} position={[0.285 * s, 0.24, -0.03]} radius={0.04} material={m.hair} />
      ))}
      <Block size={[0.34, 0.09, 0.08]} position={[0.08, 0.545, 0.235]} rotation={[0.25, 0, -0.18]} radius={0.04} material={m.hair} />
      <Block size={[0.2, 0.08, 0.07]} position={[-0.17, 0.53, 0.225]} rotation={[0.25, 0, 0.3]} radius={0.035} material={m.hair} />
    </group>
  );
}

/**
 * Open book in torso space, right where the hands land in the `sit` pose.
 * The spine points to the camera and both halves fold back towards the reader,
 * so from the front we see the red cover and the page edges.
 */
function Book({ joints, m }: { joints: Joints; m: Materials }) {
  return (
    <group position={[0, 0.36, 0.45]} rotation={[0.7, 0, 0]} visible={false} ref={(g) => { joints.book = g; }}>
      <Block size={[0.03, 0.32, 0.03]} position={[0, 0, 0.004]} radius={0.012} material={m.bookSpine} />
      {([-1, 1] as const).map((s) => (
        <group key={s} rotation={[0, 0.32 * s, 0]}>
          <Block size={[0.24, 0.32, 0.016]} position={[0.125 * s, 0, 0]} radius={0.006} material={m.bookCover} />
          <Block size={[0.225, 0.3, 0.03]} position={[0.118 * s, 0, -0.022]} radius={0.006} material={m.page} />
        </group>
      ))}
    </group>
  );
}

export function AvatarRig({ joints }: { joints: Joints }) {
  const m = useMaterials();
  joints.materials = Object.values(m).filter((material) => material !== m.shadow);

  return (
    <group ref={(g) => { joints.root = g; }}>
      <mesh
        ref={(mesh) => { joints.shadow = mesh; }}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        material={m.shadow}
      >
        <planeGeometry args={[1.25, 0.62]} />
      </mesh>

      <group ref={(g) => { joints.body = g; }}>
        {/* Legs — short, Memoji-like proportions */}
        {([1, -1] as const).map((s) => (
          <group key={s} position={[0.12 * s, HIP, 0]} ref={(g) => { joints[s === 1 ? 'lLeg' : 'rLeg'] = g; }}>
            <Block size={[0.22, 0.56, 0.25]} position={[0, -0.29, 0]} radius={0.08} material={m.trousers} />
            <Block size={[0.24, 0.1, 0.33]} position={[0, -0.57, 0.045]} radius={0.045} material={m.shoe} />
            {/* The sole wraps the shoe's bottom face (never coplanar with it):
                when sitting the soles face the camera and would z-fight. */}
            <Block size={[0.25, 0.036, 0.34]} position={[0, -0.608, 0.045]} radius={0.012} material={m.sole} />
          </group>
        ))}

        <group position={[0, HIP, 0]} ref={(g) => { joints.torso = g; }}>
          {/* Shirt body */}
          <Block size={[0.64, 0.62, 0.38]} position={[0, 0.31, 0]} radius={0.13} material={m.shirt} />
          {/* Open collar with tee underneath */}
          <Block size={[0.17, 0.11, 0.03]} position={[0, 0.57, 0.18]} radius={0.012} material={m.tee} />
          <Block size={[0.15, 0.05, 0.05]} position={[-0.085, 0.6, 0.175]} rotation={[0.2, 0, -0.55]} radius={0.015} material={m.shirtDetail} />
          <Block size={[0.15, 0.05, 0.05]} position={[0.085, 0.6, 0.175]} rotation={[0.2, 0, 0.55]} radius={0.015} material={m.shirtDetail} />
          {/* Placket + buttons */}
          <Block size={[0.035, 0.44, 0.012]} position={[0.02, 0.27, 0.193]} radius={0.004} material={m.shirtDetail} />
          {[0.43, 0.3, 0.17].map((y) => (
            <Block key={y} size={[0.026, 0.026, 0.012]} position={[0.02, y, 0.2]} radius={0.006} material={m.button} />
          ))}
          {/* Chest pocket (left side of the body) */}
          <Block size={[0.13, 0.125, 0.012]} position={[0.165, 0.4, 0.193]} radius={0.01} material={m.shirtDetail} />
          {/* Neck */}
          <Block size={[0.17, 0.12, 0.17]} position={[0, 0.66, -0.01]} radius={0.06} material={m.skinShade} />

          <group position={[0, 0.7, 0]} ref={(g) => { joints.head = g; }}>
            {/* Head (shaved scalp unless hair covers it) */}
            <Block size={[0.54, 0.58, 0.52]} position={[0, 0.3, 0]} radius={0.2} material={avatar.hair === 'shaved' ? m.scalp : m.skin} />
            {avatar.hair === 'long' ? <LongHair m={m} /> : (
              <>
                {/* Ears */}
                <Block size={[0.06, 0.13, 0.1]} position={[0.28, 0.31, -0.01]} radius={0.028} material={m.skinShade} />
                <Block size={[0.06, 0.13, 0.1]} position={[-0.28, 0.31, -0.01]} radius={0.028} material={m.skinShade} />
              </>
            )}
            {avatar.beard && (
            <>
            {/* Full beard: jaw band, chin and sideburns */}
            <Block size={[0.565, 0.22, 0.48]} position={[0, 0.12, 0.03]} radius={0.1} material={m.beard} />
            <Block size={[0.38, 0.15, 0.22]} position={[0, 0.0, 0.15]} radius={0.08} material={m.beard} />
            <Block size={[0.05, 0.17, 0.12]} position={[0.262, 0.27, 0.1]} radius={0.022} material={m.beard} />
            <Block size={[0.05, 0.17, 0.12]} position={[-0.262, 0.27, 0.1]} radius={0.022} material={m.beard} />
            <Block size={[0.03, 0.025, 0.01]} position={[0.08, 0.0, 0.258]} radius={0.004} material={m.beardGrey} />
            <Block size={[0.025, 0.02, 0.01]} position={[-0.06, 0.05, 0.272]} radius={0.004} material={m.beardGrey} />
            {/* Moustache (two halves drooping into the beard) + mouth */}
            <Block size={[0.13, 0.045, 0.05]} position={[0.058, 0.228, 0.262]} rotation={[0, 0, -0.2]} radius={0.02} material={m.beard} />
            <Block size={[0.13, 0.045, 0.05]} position={[-0.058, 0.228, 0.262]} rotation={[0, 0, 0.2]} radius={0.02} material={m.beard} />
            </>
            )}
            <Block size={[0.1, 0.026, 0.02]} position={[0, 0.183, 0.274]} radius={0.01} material={m.lip} />
            {/* Nose */}
            <Block size={[0.075, 0.11, 0.08]} position={[0, 0.315, 0.268]} radius={0.034} material={m.skin} />
            {/* Eyes */}
            <group ref={(g) => { joints.eyes = g; }} position={[0, 0.405, 0.262]}>
              {[0.105, -0.105].map((x) => (
                <group key={x} position={[x, 0, 0]}>
                  <Block size={[0.055, 0.062, 0.02]} radius={0.022} material={m.eye} />
                  <mesh position={[0.012, 0.014, 0.011]} material={m.eyeLight}>
                    <planeGeometry args={[0.014, 0.014]} />
                  </mesh>
                </group>
              ))}
            </group>
            {/* Brows */}
            <Block size={[0.13, 0.032, 0.03]} position={[0.105, 0.478, 0.258]} rotation={[0, 0, 0.07]} radius={0.012} material={m.brow} />
            <Block size={[0.13, 0.032, 0.03]} position={[-0.105, 0.478, 0.258]} rotation={[0, 0, -0.07]} radius={0.012} material={m.brow} />
          </group>

          <Arm side="l" joints={joints} m={m} />
          <Arm side="r" joints={joints} m={m} />
          <Book joints={joints} m={m} />
        </group>
      </group>
    </group>
  );
}

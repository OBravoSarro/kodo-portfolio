import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AvatarRig, createJoints, MODEL_HEIGHT, type Joints } from './AvatarRig';
import { avatarStore, pointer, type SlotEntry } from './avatarStore';
import { DioramaLayer, ISLAND_TILT } from './Dioramas';
import { AVATAR_HEIGHT, islandBob, seedFromId, slotLayout } from './layout';
import { mirrorPose, POSES, type Euler3, type PoseTargets } from './poses';

const { damp, clamp } = THREE.MathUtils;

const JOINT_KEYS = ['torso', 'head', 'lShoulder', 'lElbow', 'rShoulder', 'rElbow', 'lLeg', 'rLeg'] as const;
const WAVE_DURATION = 1900;

function dampRotation(object: THREE.Object3D, [x, y, z]: Euler3, lambda: number, dt: number) {
  object.rotation.x = damp(object.rotation.x, x, lambda, dt);
  object.rotation.y = damp(object.rotation.y, y, lambda, dt);
  object.rotation.z = damp(object.rotation.z, z, lambda, dt);
}

/**
 * Picks the slot whose section overlaps the middle band of the viewport the
 * most. Sections are the "zones"; the slot is where the avatar stands.
 */
function pickSlot(viewportHeight: number): SlotEntry | null {
  const bandTop = viewportHeight * 0.3;
  const bandBottom = viewportHeight * 0.7;
  let best: SlotEntry | null = null;
  let bestScore = 0;
  for (const entry of avatarStore.slots.values()) {
    const rect = entry.el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    const zone = entry.zone.getBoundingClientRect();
    const overlap = Math.min(zone.bottom, bandBottom) - Math.max(zone.top, bandTop);
    if (overlap > bestScore) {
      bestScore = overlap;
      best = entry;
    }
  }
  return best;
}

const FADE_OUT = 0.28;
const FADE_IN = 0.65;

const easeOut = (x: number) => 1 - (1 - x) ** 3;

function setOpacity(joints: Joints, opacity: number) {
  const transparent = opacity < 0.999;
  for (const material of joints.materials) {
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.opacity = opacity;
  }
}

function snapToPose(joints: Joints, pose: PoseTargets) {
  for (const key of JOINT_KEYS) {
    const joint = joints[key];
    const [x, y, z] = pose[key];
    joint?.rotation.set(x, y, z);
  }
}

function targetPose(slot: SlotEntry): PoseTargets {
  const pose = POSES[slot.pose];
  return slot.pose === 'point' && slot.facing === -1 ? mirrorPose(pose) : pose;
}

/**
 * The avatar never flies between sections: it fades out where it is and
 * re-appears, already in the right pose, on the island of the next section.
 */
function Director({ joints, reducedMotion }: { joints: Joints; reducedMotion: boolean }) {
  const state = useRef({
    current: null as SlotEntry | null,
    pending: null as SlotEntry | null,
    fade: 0,
    yaw: 0,
    nextBlink: 2.2,
    blinkStart: -1,
    waveUntil: 0,
    lastPoke: 0,
  });

  useFrame(({ size, clock }, rawDelta) => {
    const s = state.current;
    const root = joints.root;
    if (!root) return;

    const dt = Math.min(rawDelta, 1 / 20);
    const t = clock.elapsedTime;
    const now = performance.now();
    const vw = size.width;
    const vh = size.height;

    // 1. Which island should the avatar be on?
    const best = pickSlot(vh);
    if (s.current && !avatarStore.slots.has(s.current.id)) s.current = null;
    if (!s.current && best) {
      s.current = best;
      s.fade = 0;
      snapToPose(joints, targetPose(best));
      s.waveUntil = now + 500 + WAVE_DURATION;
      avatarStore.setActive(best.id);
    }
    const slot = s.current;
    if (!slot) {
      root.visible = false;
      return;
    }
    if (best && best !== slot) {
      if (s.pending !== best) {
        s.pending = best;
        avatarStore.setActive(null);
      }
    } else if (s.pending) {
      // Scrolled back before the swap happened: just fade in again.
      s.pending = null;
      avatarStore.setActive(slot.id);
    }

    // 2. Fade out → swap → fade in.
    if (reducedMotion) {
      s.fade = s.pending ? 0 : 1;
    } else if (s.pending) {
      s.fade = Math.max(0, s.fade - dt / FADE_OUT);
    } else {
      s.fade = Math.min(1, s.fade + dt / FADE_IN);
    }
    if (s.pending && s.fade === 0) {
      const next = s.pending;
      s.current = next;
      s.pending = null;
      snapToPose(joints, targetPose(next));
      if (next.greet) s.waveUntil = now + 450 + WAVE_DURATION;
      avatarStore.setActive(next.id);
      return;
    }

    const active = s.current!;
    const layout = slotLayout(active.el.getBoundingClientRect(), vw, vh);
    root.visible = layout.visible && s.fade > 0.001;
    if (!root.visible) return;

    const appear = easeOut(s.fade);
    const unit = layout.unit * layout.fit;
    const scale = (unit * AVATAR_HEIGHT) / MODEL_HEIGHT;
    const rise = (1 - appear) * unit * (s.pending ? -0.015 : -0.04);
    root.position.set(layout.x, layout.ground + islandBob(t, seedFromId(active.id)) * layout.unit + rise, 0);
    root.scale.setScalar(scale * (0.95 + appear * 0.05));
    setOpacity(joints, appear);
    if (joints.shadow) (joints.shadow.material as THREE.MeshBasicMaterial).opacity = appear * 0.85;

    // 3. Pose.
    if (active.pokedAt > s.lastPoke) {
      s.lastPoke = active.pokedAt;
      s.waveUntil = Math.max(s.waveUntil, now + WAVE_DURATION);
    }
    const waving = now < s.waveUntil;
    const target: PoseTargets = waving ? POSES.wave : targetPose(active);

    for (const key of JOINT_KEYS) {
      if (key === 'head') continue; // handled below with look-at
      const joint = joints[key];
      if (!joint) continue;
      let goal = target[key];
      if (key === 'rElbow' && waving && !reducedMotion) {
        goal = [goal[0], goal[1], goal[2] + Math.sin(t * 10.5) * 0.42];
      }
      if (key === 'torso' && !reducedMotion) {
        goal = [goal[0] + Math.sin(t * 1.7) * 0.012, goal[1], goal[2]];
      }
      dampRotation(joint, goal, key === 'rElbow' && waving ? 16 : 6.5, dt);
    }

    // 4. Look at the cursor (or at the content on touch devices).
    const headScreenX = vw / 2 + layout.x;
    const headScreenY = vh / 2 - (layout.ground + 1.62 * scale);
    const lookX = pointer.seen ? (pointer.x - headScreenX) / (vw * 0.5) : active.facing * 0.35;
    const lookY = pointer.seen ? (pointer.y - headScreenY) / (vh * 0.5) : 0.12;
    const facingYaw = waving ? active.facing * 0.12 : active.facing * 0.4;
    s.yaw = damp(s.yaw, facingYaw + clamp(lookX, -1, 1) * 0.12, 3.5, dt);
    root.rotation.set(ISLAND_TILT, s.yaw, 0);

    if (joints.head) {
      const poseHead = target.head;
      const headYaw = clamp(lookX * 0.85, -0.7, 0.7) - s.yaw * 0.55;
      const headPitch = clamp(lookY * 0.45, -0.28, 0.32);
      dampRotation(joints.head, [poseHead[0] + headPitch, poseHead[1] + headYaw, poseHead[2]], 5.5, dt);
    }

    if (joints.body) {
      joints.body.position.y = reducedMotion ? 0 : Math.sin(t * 1.7) * 0.006;
    }

    // 5. Eyes: subtle gaze + natural blinking.
    if (joints.eyes) {
      joints.eyes.position.x = damp(joints.eyes.position.x, clamp(lookX, -1, 1) * 0.012, 8, dt);
      joints.eyes.position.y = damp(joints.eyes.position.y, 0.405 - clamp(lookY, -1, 1) * 0.008, 8, dt);
      if (t > s.nextBlink) {
        s.blinkStart = t;
        s.nextBlink = t + (Math.random() < 0.2 ? 0.28 : 2.4 + Math.random() * 3.4);
      }
      const phase = (t - s.blinkStart) / 0.15;
      joints.eyes.scale.y = phase >= 0 && phase <= 1 ? 1 - Math.sin(phase * Math.PI) * 0.9 : 1;
    }
  });

  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={['#ffffff', '#c9bfb6', 1.35]} />
      <directionalLight position={[-3, 5, 6]} intensity={2.1} color="#fff6ec" />
      <directionalLight position={[4, 2, -5]} intensity={1.6} color="#dfe8ff" />
      <directionalLight position={[3, -1, 4]} intensity={0.35} color="#ffe9dc" />
    </>
  );
}

export default function AvatarStage({ reducedMotion }: { reducedMotion: boolean }) {
  const joints = useMemo(createJoints, []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.seen = true;
    };
    const onLeave = () => { pointer.seen = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <Canvas
      className="avatar-stage"
      orthographic
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1500], zoom: 1, near: 1, far: 4000 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}
      onCreated={() => avatarStore.setStatus('ready')}
      aria-hidden="true"
    >
      <Lights />
      <DioramaLayer />
      <AvatarRig joints={joints} />
      <Director joints={joints} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

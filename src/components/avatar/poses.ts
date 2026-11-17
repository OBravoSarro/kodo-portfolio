import type { Pose } from './avatarStore';

export type Euler3 = readonly [number, number, number];

export interface PoseTargets {
  torso: Euler3;
  head: Euler3;
  /** Character's left arm (screen right when facing the camera). */
  lShoulder: Euler3;
  lElbow: Euler3;
  rShoulder: Euler3;
  rElbow: Euler3;
  lLeg: Euler3;
  rLeg: Euler3;
}

const STRAIGHT: Euler3 = [0, 0, 0];

/**
 * Joint targets in radians. Elbows use Euler order 'YXZ': X bends the forearm
 * forward, then Y swings it across / away from the body.
 * The render loop damps every joint towards these values, so switching poses
 * is always a continuous blend — never a jump.
 */
export const POSES: Record<Pose, PoseTargets> = {
  idle: {
    torso: STRAIGHT,
    head: STRAIGHT,
    lShoulder: [0.04, 0, 0.09],
    lElbow: [-0.22, 0, 0],
    rShoulder: [0.04, 0, -0.09],
    rElbow: [-0.22, 0, 0],
    lLeg: STRAIGHT,
    rLeg: STRAIGHT,
  },
  // Same posture as the portrait: arms folded across the chest.
  crossed: {
    torso: [0.02, 0, 0],
    head: [-0.04, 0, 0],
    lShoulder: [-0.62, 0, -0.12],
    lElbow: [-1.5, -1.2, 0],
    rShoulder: [-0.7, 0, 0.12],
    rElbow: [-1.62, 1.2, 0],
    lLeg: [0, 0, 0.03],
    rLeg: [0, 0, -0.03],
  },
  wave: {
    torso: [0, 0, -0.03],
    head: [0, 0, -0.06],
    lShoulder: [0.04, 0, 0.1],
    lElbow: [-0.25, 0, 0],
    rShoulder: [0, 0, -2.55],
    rElbow: [0, 0, 0.35],
    lLeg: STRAIGHT,
    rLeg: STRAIGHT,
  },
  present: {
    torso: [0.03, 0, 0],
    head: [0.02, 0, 0],
    lShoulder: [-0.32, 0, 0.42],
    lElbow: [-1.0, 0.45, 0],
    rShoulder: [-0.32, 0, -0.42],
    rElbow: [-1.0, -0.45, 0],
    lLeg: STRAIGHT,
    rLeg: STRAIGHT,
  },
  // Points with the left arm towards screen-right. Mirrored at runtime for facing = -1.
  point: {
    torso: [0, 0.18, 0],
    head: [0, 0.12, 0],
    lShoulder: [-0.2, 0, 1.38],
    lElbow: [-0.12, 0, 0],
    rShoulder: [0.04, 0, -0.1],
    rElbow: [-0.3, 0, 0],
    lLeg: STRAIGHT,
    rLeg: STRAIGHT,
  },
  think: {
    torso: [0.02, 0, 0],
    head: [0.08, 0, 0.1],
    lShoulder: [-0.5, 0, -0.08],
    lElbow: [-1.45, -1.15, 0],
    rShoulder: [-0.55, 0, 0.2],
    rElbow: [-2.25, 0.45, 0],
    lLeg: STRAIGHT,
    rLeg: STRAIGHT,
  },
};

/** Mirrors a pose left↔right so pointing works towards both sides. */
export function mirrorPose(pose: PoseTargets): PoseTargets {
  const flip = ([x, y, z]: Euler3): Euler3 => [x, -y, -z];
  return {
    torso: flip(pose.torso),
    head: flip(pose.head),
    lShoulder: flip(pose.rShoulder),
    lElbow: flip(pose.rElbow),
    rShoulder: flip(pose.lShoulder),
    rElbow: flip(pose.lElbow),
    lLeg: flip(pose.rLeg),
    rLeg: flip(pose.lLeg),
  };
}

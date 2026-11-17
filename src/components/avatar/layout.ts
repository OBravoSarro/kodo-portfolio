/**
 * Shared geometry between the islands and the avatar, so both agree on where
 * the ground is. Everything is expressed in CSS pixels (orthographic camera,
 * 1 world unit = 1 px) relative to the centre of the viewport.
 */

/** Island top surface, as a fraction of the slot height from its bottom. */
export const GROUND = 0.25;
/** Avatar height as a fraction of the slot height. */
export const AVATAR_HEIGHT = 0.62;
/** Height of the standing model in its own units (feet at 0, top of the head). */
export const MODEL_HEIGHT = 1.95;

export interface SlotLayout {
  /** Centre x of the slot. */
  x: number;
  /** World y of the island's top surface. */
  ground: number;
  /** Slot height in px — the unit everything inside a diorama is scaled by. */
  unit: number;
  /** Width factor (< 1 when the slot is narrower than the ideal island). */
  fit: number;
  /** Whether the slot is close enough to the viewport to be worth drawing. */
  visible: boolean;
}

export function slotLayout(rect: DOMRect, vw: number, vh: number): SlotLayout {
  const unit = rect.height;
  return {
    x: rect.left + rect.width / 2 - vw / 2,
    ground: vh / 2 - rect.bottom + unit * GROUND,
    unit,
    fit: Math.min(1, rect.width / (unit * 0.9)),
    visible: rect.width > 2 && rect.height > 2 && rect.bottom > -200 && rect.top < vh + 200,
  };
}

/** Gentle floating motion, identical for an island and whoever stands on it. */
export function islandBob(time: number, seed: number) {
  return Math.sin(time * 0.75 + seed * 1.7) * 0.006;
}

export function seedFromId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return hash / 97;
}

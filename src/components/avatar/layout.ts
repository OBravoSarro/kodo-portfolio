/**
 * Shared geometry between the islands and the avatar, so both agree on where
 * the ground is. Everything is expressed in CSS pixels (orthographic camera,
 * 1 world unit = 1 px) relative to the centre of the canvas.
 *
 * The canvas is not `position: fixed`: it lives in the document and is moved
 * to the current scroll position every frame (see `StageTrack`). Between two
 * JS frames the compositor scrolls it together with the DOM, so on mobile the
 * 3D never lags behind momentum scrolling. It is taller than the viewport by
 * `STAGE_BUFFER` on each side so its edges are never visible mid-scroll.
 */

/** Extra canvas height above and below the viewport. Keep in sync with --stage-buffer. */
export const STAGE_BUFFER = 200;

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

/**
 * @param rect   slot rect in viewport coordinates
 * @param width  canvas width
 * @param height canvas height
 * @param top    canvas top edge in viewport coordinates (−STAGE_BUFFER)
 */
export function slotLayout(rect: DOMRect, width: number, height: number, top = -STAGE_BUFFER): SlotLayout {
  const unit = rect.height;
  const rectTop = rect.top - top;
  const rectBottom = rect.bottom - top;
  return {
    x: rect.left + rect.width / 2 - width / 2,
    ground: height / 2 - rectBottom + unit * GROUND,
    unit,
    fit: Math.min(1, rect.width / (unit * 0.9)),
    visible: rect.width > 2 && rect.height > 2 && rectBottom > -200 && rectTop < height + 200,
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

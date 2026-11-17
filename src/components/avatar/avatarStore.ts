import { useSyncExternalStore } from 'react';

/**
 * Tiny external store shared between the DOM (slots, speech bubbles) and the
 * WebGL stage. It is deliberately framework-agnostic: the render loop reads it
 * every frame without triggering React renders, and React only subscribes to
 * the few values that affect markup (active slot, stage status).
 */

export type Pose = 'wave' | 'idle' | 'present' | 'point' | 'think' | 'crossed' | 'explain' | 'read' | 'sit';
/** Which side of the screen the avatar should turn to (towards the content). */
export type Facing = -1 | 0 | 1;
export type StageStatus = 'pending' | 'ready' | 'unsupported';
/** Little floating island rendered under each slot. */
export type SceneVariant = 'garden' | 'mailbox' | 'path' | 'city' | 'blocks' | 'books' | 'torii' | 'meadow';

export interface SlotEntry {
  id: string;
  el: HTMLElement;
  zone: HTMLElement;
  pose: Pose;
  scene: SceneVariant;
  facing: Facing;
  /** Wave when the avatar arrives at this slot. */
  greet: boolean;
  hovered: boolean;
  pokedAt: number;
}

const slots = new Map<string, SlotEntry>();
const listeners = new Set<() => void>();

let activeId: string | null = null;
let slotList: readonly SlotEntry[] = [];
let stageStatus: StageStatus = 'pending';

export const pointer = { x: 0, y: 0, seen: false };

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const avatarStore = {
  slots,
  register(entry: SlotEntry) {
    slots.set(entry.id, entry);
    slotList = [...slots.values()];
    emit();
    return () => {
      if (slots.get(entry.id) !== entry) return;
      slots.delete(entry.id);
      slotList = [...slots.values()];
      emit();
    };
  },
  get activeId() {
    return activeId;
  },
  setActive(id: string | null) {
    if (id === activeId) return;
    activeId = id;
    emit();
  },
  get status() {
    return stageStatus;
  },
  setStatus(status: StageStatus) {
    if (status === stageStatus) return;
    stageStatus = status;
    emit();
  },
};

export function useActiveSlot() {
  return useSyncExternalStore(subscribe, () => activeId, () => null);
}

export function useStageStatus() {
  return useSyncExternalStore(subscribe, () => stageStatus, () => 'pending' as StageStatus);
}

/** Registered slots — used by the stage to render one diorama per slot. */
export function useSlotList() {
  return useSyncExternalStore(subscribe, () => slotList, () => slotList);
}

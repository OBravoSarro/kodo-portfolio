import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { AVATAR_HEIGHT, GROUND } from './layout';
import { avatarStore, useActiveSlot, useStageStatus, type Facing, type Pose, type SceneVariant, type SlotEntry } from './avatarStore';

interface AvatarSlotProps {
  id: string;
  pose: Pose;
  /** Floating island rendered under the avatar. */
  scene: SceneVariant;
  /** Side of the screen where the related content lives. */
  facing?: Facing;
  /** Short line the avatar "says" when it arrives. */
  line?: string;
  /** Wave on arrival. */
  greet?: boolean;
  className?: string;
  /** Rendered only when WebGL is not available. */
  fallback?: ReactNode;
}

/**
 * Reserves space in the layout for a small 3D island and the avatar. The WebGL
 * stage reads the slot's bounding box every frame and draws the island there,
 * so the layout — not the 3D scene — decides where things live.
 */
export function AvatarSlot({ id, pose, scene, facing = 0, line, greet = false, className = '', fallback }: AvatarSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const entry = useRef<SlotEntry | null>(null);
  const active = useActiveSlot() === id;
  const status = useStageStatus();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const zone = (el.closest('[data-avatar-zone]') ?? el.closest('section') ?? el) as HTMLElement;
    const next: SlotEntry = { id, el, zone, pose, scene, facing, greet, hovered: false, pokedAt: 0 };
    entry.current = next;
    return avatarStore.register(next);
  }, [id, pose, scene, facing, greet]);

  // Keep the speech bubble next to the head, whatever the slot proportions.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const fit = Math.min(1, width / (height * 0.9));
      const headTop = height * (1 - GROUND) - height * AVATAR_HEIGHT * fit;
      el.style.setProperty('--head-top', `${Math.round(headTop)}px`);
      el.style.setProperty('--head-side', `${Math.round(height * fit * 0.09)}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const poke = () => {
    if (entry.current) entry.current.pokedAt = performance.now();
  };

  return (
    <div
      ref={ref}
      className={`avatar-slot ${className}`}
      data-active={active || undefined}
      data-facing={facing}
      data-status={status}
      aria-hidden="true"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'touch') poke();
      }}
      onClick={poke}
    >
      {line && status === 'ready' && <span className="avatar-bubble">{line}</span>}
      {status === 'unsupported' && fallback}
    </div>
  );
}

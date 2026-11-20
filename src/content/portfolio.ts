/**
 * Facade over the active profile. `@profile` is resolved at build time from the
 * PROFILE env var (see vite.config.ts): `profiles/<PROFILE>/content.ts`.
 * Components import from here and never know whose site they are rendering.
 */
import { profile } from '@profile/content';
import type { AvatarLook, Profile } from './types';

export type * from './types';

const active: Profile = profile;

export const {
  identity,
  hero,
  letter,
  figures,
  principles,
  experiences,
  projects,
  otherClients,
  capabilities,
  education,
  stories,
  sections,
  avatarLines,
} = active;

/** Defaults for the 3D avatar (kodo template) when a profile omits them. */
export const avatar: AvatarLook = active.avatar ?? { hair: 'long', beard: false, tattoo: false, watch: false };
export const scenes: NonNullable<Profile['scenes']> = active.scenes ?? {
  hero: { pose: 'explain', scene: 'garden' },
  letter: { pose: 'present', scene: 'mailbox' },
  experience: { pose: 'think', scene: 'path' },
  projects: { pose: 'explain', scene: 'city' },
  capabilities: { pose: 'present', scene: 'blocks' },
  writing: { pose: 'think', scene: 'books' },
  background: { pose: 'sit', scene: 'meadow' },
  contact: { pose: 'explain', scene: 'torii' },
};

/** Sections without content are not rendered, so they leave the menu too. */
const hidden = new Set<string>([
  ...(stories.length === 0 ? ['escritos'] : []),
  ...(projects.length === 0 && otherClients.length === 0 ? ['proyectos'] : []),
  ...(experiences.length === 0 ? ['experiencia'] : []),
  ...(capabilities.length === 0 ? ['capacidades'] : []),
  ...(education.length === 0 ? ['formacion'] : []),
]);

export const navigation = active.navigation.filter((item) => !hidden.has(item.id));
export const isVisible = (id: string) => !hidden.has(id);

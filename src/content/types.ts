/**
 * Contract every profile (`profiles/<id>/content.ts`) must satisfy.
 * Components only depend on these types, never on a specific person.
 */
import type { Pose, SceneVariant } from '../components/avatar/avatarStore';

export interface Experience {
  id: string;
  start: string;
  end: string;
  organization: string;
  role: string;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  current?: boolean;
}

export interface Project {
  id: string;
  client: string;
  sector: string;
  title: string;
  description: string;
  stack: readonly string[];
  size: 'large' | 'medium' | 'small' | 'wide';
}

export interface Capability {
  id: string;
  title: string;
  description: string;
  skills: readonly string[];
}

export interface Story {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  minutes: number;
  tags: string[];
}

export type SectionId = 'carta' | 'experiencia' | 'proyectos' | 'capacidades' | 'escritos' | 'formacion' | 'contacto';

export interface Identity {
  firstName: string;
  fullName: string;
  displayName: string;
  role: string;
  company: string;
  location: string;
  email: string;
  linkedin: string;
  linkedinLabel: string;
  /** Medium profile URL. Empty string when the person has no Medium yet. */
  medium: string;
  /** First professional year. Omit to hide «Desde» in the hero. */
  since?: number;
}

/** Copy for a section header: eyebrow, two-line title and an optional lead. */
export interface SectionCopy {
  eyebrow: string;
  title: string;
  titleMuted: string;
  lead?: string;
}

/** Visual traits of the procedural 3D avatar. */
export interface AvatarLook {
  hair: 'shaved' | 'long';
  beard: boolean;
  /** Irezumi-style sleeve on the right forearm. */
  tattoo: boolean;
  /** Smartwatch on the left wrist. */
  watch: boolean;
  /** Overrides on top of the default palette (see AvatarRig.tsx). */
  palette?: Partial<Record<'skin' | 'skinShade' | 'hair' | 'brow' | 'shirt' | 'shirtDetail' | 'tee' | 'trousers' | 'shoe' | 'lip', string>>;
}

export interface SectionAvatar {
  pose: Pose;
  scene: SceneVariant;
}

export interface Profile {
  identity: Identity;
  navigation: readonly { id: SectionId; label: string }[];
  /** `portrait`: image path inside public/ (empty = no photo yet). */
  hero: {
    eyebrow: string;
    title: readonly string[];
    lead: string;
    portrait: string;
    /** Candidatos de retrato para elegir en local (selector solo en `npm run dev`). */
    portraitOptions?: readonly { id: string; label: string; src: string }[];
  };
  letter: {
    greeting: string;
    paragraphs: readonly string[];
    closing: string;
    signature: string;
  };
  figures: readonly { value: string; label: string }[];
  principles: readonly { title: string; text: string }[];
  experiences: readonly Experience[];
  projects: readonly Project[];
  otherClients: readonly string[];
  capabilities: readonly Capability[];
  /** `badge`: short stamp next to the item (e.g. «Titulada»), optional. */
  education: readonly { title: string; place: string; period: string; badge?: string }[];
  stories: readonly Story[];
  sections: {
    experience: SectionCopy;
    projects: SectionCopy;
    capabilities: SectionCopy;
    writing: SectionCopy;
    background: SectionCopy;
    contact: SectionCopy;
    /** Label on the "other clients" card of the projects bento. */
    otherClientsLabel: string;
    principlesTitle: string;
    footerCredit: string;
  };
  /** Only for the `kodo` template (3D avatar). Other templates ignore it. */
  avatar?: AvatarLook;
  /** Only for the `kodo` template: pose and island per section. */
  scenes?: Record<'hero' | 'letter' | 'experience' | 'projects' | 'capabilities' | 'writing' | 'background' | 'contact', SectionAvatar>;
  /**
   * Short first-person line per section: speech bubble of the 3D avatar in
   * `kodo`, handwritten margin note in `cuaderno`.
   */
  avatarLines: Record<'hero' | 'letter' | 'experience' | 'projects' | 'capabilities' | 'writing' | 'background' | 'contact', string>;
}

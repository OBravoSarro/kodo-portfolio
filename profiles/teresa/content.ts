/**
 * Teresa Pérez Parra — publicado (draft: false en profile.json).
 * Plantilla «cuaderno» (profile.json → template): ilustración a mano, sin 3D.
 * `avatarLines` se muestran como notas manuscritas al margen.
 * Hechos tomados de su CV (people/teresa/cv/Teresa_Perez_Parra.pdf) y del CV ATS
 * derivado (people/teresa/cv/cv-teresa-perez-parra-ats.md). Los huecos se marcan
 * con el texto de pendiente; el test de contenido impide publicar mientras quede alguno.
 *
 * Privacidad: teléfono y datos sensibles van en los CV que ella envía, NUNCA en la
 * web (forbiddenPatterns en profile.json).
 */
import type { Capability, Experience, Profile, Project, Story } from '../../src/content/types';
import medium from './medium.json';

const identity = {
  firstName: 'Teresa',
  fullName: 'Teresa Pérez Parra',
  displayName: 'Teresa Pérez',
  role: 'Pedagoga · Orientación y mentoría',
  company: 'COIE · UNED',
  location: 'Leganés, Madrid',
  email: 'teresaperez1992@gmail.com',
  linkedin: 'https://www.linkedin.com/in/teresa-p-37248415b',
  linkedinLabel: 'linkedin.com/in/teresa-p-37248415b',
  medium: medium.profile,
  since: 2023,
};

const navigation = [
  { id: 'carta', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Trayectoria' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'capacidades', label: 'Competencias' },
  { id: 'escritos', label: 'Publicaciones' },
  { id: 'formacion', label: 'Formación' },
  { id: 'contacto', label: 'Contacto' },
] as const;

// Tono propuesto: revisar con Teresa.
const hero = {
  eyebrow: 'Pedagogía · Orientación · Innovación educativa',
  title: ['Aprender', 'abre caminos.', 'Orientar los acompaña.'],
  lead:
    'Pedagoga por la UNED. Diseño y evalúo programas de mentoría y orientación académica y profesional, en la universidad, en centros penitenciarios y en la alianza europea OpenEU.',
  // Retrato ilustrado definitivo. Original: people/teresa/assets/retratos/retrato-definitivo.png.
  // La foto real no se publica. Para volver a comparar, añadir `portraitOptions` (selector solo en dev).
  portrait: 'images/retratos/retrato-definitivo.webp',
};

const letter = {
  greeting: 'Hola, soy Teresa.',
  paragraphs: [
    'Estudié Pedagogía en la UNED entre 2021 y 2026. En 2023, todavía como alumna, empecé mis prácticas en el Centro de Orientación y Empleo (COIE) de la universidad: codiseñé y validé un programa de mentoría para los Centros Asociados de la UNED, que empezó como piloto y hoy está implantado. Ese mismo curso fui compañera mentora de estudiantes de nuevo ingreso, una labor por la que la UNED me otorgó su reconocimiento como Compañera Mentora.',
    'Desde octubre de 2025 colaboro con el COIE en la alianza universitaria europea OpenEU. Diseño, sigo y evalúo programas de mentoría para Centros Asociados, Centros Penitenciarios y la propia alianza, y he colaborado en recursos como un toolkit de mentoría para grupos infrarrepresentados, con guías, rúbricas y materiales accesibles. Hoy apoyo además las iniciativas de emprendimiento de OpenEU y su Job Fair, en contacto con empresas y estudiantes.',
    'También soy profesora tutora de Lengua Castellana en el Curso de Acceso a la Universidad de la UNED, en el Centro Penitenciario Madrid VI (Aranjuez). Durante la carrera fui, además, subdelegada de estudiantes.',
  ],
  closing: 'Si buscas a alguien que acompañe a las personas en su aprendizaje y diseñe programas que se puedan medir, me encantará conocerte.',
  signature: 'Teresa Pérez Parra',
};

const figures = [
  { value: '2023', label: 'mis primeros pasos como mentora en la UNED' },
  { value: '3', label: 'ámbitos: universidad, prisiones y OpenEU' },
  { value: '1', label: 'programa de mentoría codiseñado, hoy implantado' },
  { value: '2025', label: 'reconocimiento como Compañera Mentora' },
] as const;

// Principios propuestos a partir de su trayectoria: revisar con Teresa.
const principles = [
  {
    title: 'Acompañar a cada persona',
    text: 'La orientación empieza por escuchar: de dónde viene cada estudiante y hacia dónde quiere ir.',
  },
  {
    title: 'Programas que se evalúan',
    text: 'Diseño con objetivos claros, seguimiento e instrumentos de evaluación para saber qué funciona.',
  },
  {
    title: 'Educación en todos los contextos',
    text: 'Del alumnado de nuevo ingreso a los centros penitenciarios y la cooperación europea.',
  },
] as const;

const experiences: readonly Experience[] = [
  {
    id: 'cp-aranjuez',
    start: 'Nov 2026',
    end: 'Actualidad',
    organization: 'UNED · Centro Penitenciario Madrid VI',
    role: 'Profesora tutora universitaria',
    summary: 'Lengua Castellana en el Curso de Acceso a la Universidad, en Aranjuez.',
    highlights: [
      'Tutorías presenciales para las pruebas de acceso a la universidad.',
      'Sesiones y materiales adaptados a alumnado adulto con distintos niveles.',
      'Orientación académica individualizada y metodologías inclusivas.',
    ],
    stack: ['Docencia', 'Educación de adultos', 'Educación inclusiva'],
    current: true,
  },
  {
    id: 'coie-openeu',
    start: 'Nov 2026',
    end: 'Jul 2027',
    organization: 'COIE · UNED — OpenEU',
    role: 'Apoyo en Emprendimiento y Empleabilidad',
    summary: 'Emprendimiento y empleabilidad en la alianza universitaria europea OpenEU.',
    highlights: [
      'Apoyo a las acciones de emprendimiento universitario (WP2).',
      'Job Fair OpenEU: búsqueda y contacto con empresas y atención a empresas y estudiantes.',
      'Empleabilidad y conexión universidad-empresa con el equipo del COIE.',
    ],
    stack: ['Proyectos europeos', 'Emprendimiento', 'Empleabilidad'],
    current: true,
  },
  {
    id: 'coie-mentoria',
    start: 'Oct 2025',
    end: 'Jul 2026',
    organization: 'COIE · UNED',
    role: 'Asistente en programas de mentoría',
    summary: 'Prácticas extracurriculares en el Centro de Orientación y Empleo. Funciones acreditadas por certificado de competencias del COIE-UNED.',
    highlights: [
      'Diseño, seguimiento y evaluación de programas de mentoría para Centros Asociados, Centros Penitenciarios y OpenEU.',
      'Proyecto piloto, base del plan de mentoría, con sus materiales didácticos.',
      'Toolkit de mentoría para grupos infrarrepresentados (OpenEU, WP3) y voluntariado con entidades sociales (WP7).',
      'Formación y actividades con TIC e IA; subtitulado multilingüe accesible.',
    ],
    stack: ['Mentoría', 'Diseño instruccional', 'Evaluación', 'TIC e IA'],
  },
  {
    id: 'coie-tecnica',
    start: 'Sep 2023',
    end: 'May 2024',
    organization: 'COIE · UNED',
    role: 'Codiseño de un programa de mentoría universitaria',
    summary: 'Prácticas universitarias en dos tramos (sep–nov 2023 y ene–may 2024). Del diseño y el pilotaje a su implementación en los Centros Asociados de la UNED.',
    highlights: [
      'Objetivos, metodología, fases y roles, estructurados en cinco hitos.',
      'Guías, materiales, cuestionarios, rúbricas y herramientas de seguimiento.',
      'Pruebas de funcionamiento y mejora de los recursos.',
    ],
    stack: ['Diseño de programas', 'Mentoría', 'Evaluación'],
  },
  {
    id: 'mentora',
    start: 'Oct 2023',
    end: 'Jun 2024',
    organization: 'UNED · Centro Asociado Madrid Sur-Leganés',
    role: 'Compañera mentora (voluntariado)',
    summary: 'Acompañamiento y orientación al estudiantado de nuevo ingreso del Grado en Pedagogía.',
    highlights: ['Reconocida por la UNED y el COIE (2025) por su labor de mentoría.'],
    stack: ['Mentoría entre iguales', 'Orientación académica'],
  },
];

const projects: readonly Project[] = [
  {
    id: 'openeu-mentoria',
    client: 'OpenEU',
    sector: 'Alianza universitaria europea',
    title: 'Mentoría interuniversitaria',
    description: 'Codiseño y evaluación de un programa de mentoría interuniversitario, presentado en las Jornadas de Innovación Docente de la UNED (2026).',
    stack: ['Mentoría', 'Innovación docente', 'Cooperación europea'],
    size: 'large',
  },
  {
    id: 'openeu-jobfair',
    client: 'OpenEU · WP7',
    sector: 'Empleabilidad',
    title: 'Job Fair OpenEU',
    description: 'Organización de la feria de empleo de la alianza: contacto con empresas y atención a estudiantes.',
    stack: ['Organización de eventos', 'Relación con empresas'],
    size: 'medium',
  },
  {
    id: 'openeu-emprendimiento',
    client: 'OpenEU · WP2',
    sector: 'Emprendimiento',
    title: 'Iniciativas de emprendimiento',
    description: 'Apoyo a las iniciativas de emprendimiento del paquete de trabajo WP2.',
    stack: ['Emprendimiento'],
    size: 'medium',
  },
  {
    id: 'penitenciarios',
    client: 'UNED',
    sector: 'Centros penitenciarios',
    title: 'Mentoría en prisiones',
    description: 'Contenidos del Programa de Compañero/a Mentor/a en Instituciones Penitenciarias y docencia en el Centro Penitenciario Madrid VI.',
    stack: ['Educación en prisiones'],
    size: 'small',
  },
  {
    id: 'piloto',
    client: 'COIE · UNED',
    sector: 'Orientación',
    title: 'Programa de mentoría universitaria',
    description: 'Codiseñado y validado como piloto; hoy en implementación en los Centros Asociados de la UNED.',
    stack: ['Diseño de programas'],
    size: 'small',
  },
];

const capabilities: readonly Capability[] = [
  {
    id: 'guidance',
    title: 'Orientación y mentoría',
    description: 'Acompañar decisiones académicas y profesionales.',
    skills: ['Orientación académica', 'Orientación profesional', 'Mentoría entre iguales', 'Atención a estudiantes', 'Empleabilidad'],
  },
  {
    id: 'programs',
    title: 'Programas educativos',
    description: 'Diseñar, seguir y evaluar lo que se pone en marcha.',
    skills: ['Diseño de programas', 'Itinerarios formativos', 'Diseño instruccional', 'Metodologías activas', 'Instrumentos de evaluación', 'Proyectos piloto'],
  },
  {
    id: 'teaching',
    title: 'Docencia',
    description: 'Apoyo al aprendizaje en contextos diversos.',
    skills: ['Lengua Castellana', 'Acceso a la universidad', 'Educación de adultos', 'Educación inclusiva (TEA)', 'Neuroeducación'],
  },
  {
    id: 'tools',
    title: 'Gestión y herramientas',
    description: 'Coordinación, comunicación y entorno digital.',
    skills: ['Coordinación de proyectos', 'Equipos multidisciplinares', 'Informes técnicos', 'Comunicación institucional', 'Moodle', 'Microsoft 365', 'Canva', 'Genially', 'IA aplicada a la formación (ChatGPT, Copilot)'],
  },
];

const education = [
  { title: 'Grado en Pedagogía', place: 'Universidad Nacional de Educación a Distancia (UNED)', period: '2021 — 2026', badge: 'Titulada' },
  { title: 'Trastorno del Espectro Autista (40 h)', place: 'UNED', period: '2025' },
  { title: 'Neuropedagogía en Acción (10 h)', place: 'UNED', period: '2025' },
  { title: 'Comunicación efectiva, Negociación, Fundamentos de ChatGPT, IA con Copilot y Prompting responsable (8 h c/u)', place: 'Santander Open Academy', period: '2025' },
  { title: 'El desarrollo socioemocional en Educación Infantil a través de los cuentos', place: 'UNED', period: '2025' },
  { title: 'Diseño, seguimiento y evaluación de programas (40 h)', place: 'Grupo Femxa', period: '2020' },
] as const;

const stories: readonly Story[] = medium.stories;

export const profile = {
  identity,
  navigation,
  hero,
  letter,
  figures,
  principles,
  experiences,
  projects,
  otherClients: ['Reconocimiento como Compañera Mentora (UNED, 2025)', 'Subdelegada de estudiantes (2023–2025)', 'XV Jornadas de Innovación Docente UNED (2026)', 'Congreso de Jóvenes Investigadores «Urania» (2022)'],
  capabilities,
  education,
  stories,
  sections: {
    experience: {
      eyebrow: 'Trayectoria',
      title: 'Desde 2023.',
      titleMuted: 'De alumna mentora a orientadora.',
      lead: 'Empecé como alumna, con prácticas y voluntariado de mentoría en la UNED. Desde 2025 trabajo en orientación, mentoría y cooperación europea con OpenEU.',
    },
    projects: {
      eyebrow: 'Proyectos',
      title: 'Programas con propósito.',
      titleMuted: 'De la UNED a Europa.',
      lead: 'Mentoría, empleabilidad y emprendimiento en la alianza universitaria europea OpenEU, en la UNED y en centros penitenciarios.',
    },
    capabilities: { eyebrow: 'Competencias', title: 'Orientar, diseñar,', titleMuted: 'enseñar y evaluar.' },
    writing: {
      eyebrow: 'Publicaciones',
      title: 'Pensar la educación.',
      titleMuted: 'En voz alta.',
      lead: 'Pedagogía, orientación y mentoría.',
    },
    background: { eyebrow: 'Formación', title: 'Formación.', titleMuted: 'Aprender siempre.' },
    contact: {
      eyebrow: 'Contacto',
      title: '¿Hablamos de',
      titleMuted: 'educación?',
      lead: 'Si buscas a alguien para un programa de orientación, de mentoría o un proyecto europeo, escríbeme.',
    },
    otherClientsLabel: 'Reconocimientos',
    principlesTitle: 'Cómo trabajo',
    footerCredit: 'Diseñado como un cuaderno de orientación.',
  },
  avatarLines: {
    hero: 'Hola, soy Teresa.',
    letter: 'Te cuento quién soy',
    experience: 'cada parada me enseñó algo',
    projects: 'proyectos que cruzan fronteras',
    capabilities: 'mi caja de herramientas',
    writing: 'lo que aprendo, lo comparto',
    background: 'aprender no termina nunca',
    contact: '¿Hablamos?',
  },
} satisfies Profile;

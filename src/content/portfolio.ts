/**
 * Single source of truth for every piece of copy on the site.
 * Facts are taken from the latest ATS CV (cv-oscar-bravo-ats.md).
 * If the CV changes, change it here — components never hardcode content.
 * Medium stories are snapshotted by `npm run sync:medium` into medium.json.
 */
import medium from './medium.json';

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

export const identity = {
  firstName: 'Óscar',
  fullName: 'Óscar Bravo Sarro',
  displayName: 'Óscar Bravo',
  role: 'Frontend Architect & Chapter Lead',
  company: 'INNOCV Solutions',
  location: 'Madrid, España',
  email: 'desarrollador.oscar.bravo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/oscar-bravo-sarro-0a900665',
  linkedinLabel: 'linkedin.com/in/oscar-bravo-sarro',
  medium: medium.profile,
  since: 2012,
} as const;

export const navigation = [
  { id: 'carta', label: 'Sobre mí' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'capacidades', label: 'Capacidades' },
  { id: 'escritos', label: 'Escritos' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export const hero = {
  eyebrow: `${identity.role} · ${identity.company}`,
  title: ['Arquitectura', 'que escala.', 'Equipos que crecen.'],
  lead:
    'Más de diez años diseñando plataformas web enterprise para banca, seguros, energía y retail. Construyo desde cero, junto al cliente, productos que se pueden mantener.',
} as const;

/** The cover letter. Written in first person, signed at the end. */
export const letter = {
  greeting: 'Hola, soy Óscar.',
  paragraphs: [
    'Empecé en 2012 escribiendo Ruby on Rails en una pequeña empresa de Carabanchel. Desde entonces he pasado por agencias, CMS, gamificación y, desde 2019, por proyectos enterprise en INNOCV Solutions, donde hoy soy Frontend Architect y Chapter Lead.',
    'Mi trabajo consiste en traducir objetivos de negocio en arquitectura: decidir qué se construye, cómo se estructura y qué estándares lo sostienen cuando el equipo crece. He liderado plataformas para Evo Bank, Mapfre o Repsol con Angular, React, Vue y Next.js, y aplico IA a casos de producto reales.',
    'Lo que más me importa no es la tecnología, sino lo que permite: equipos que entregan con calidad y velocidad, y código que el siguiente desarrollador agradece encontrarse.',
    'Lo que aprendo lo escribo. En Medium publico sobre arquitectura frontend: deuda técnica, microfrontends, React o el papel de la IA en el producto.',
  ],
  closing: 'Si buscas a alguien que piense en sistemas y cuide los detalles, me encantará conocerte.',
  signature: 'Óscar Bravo Sarro',
} as const;

export const figures = [
  { value: '10+', label: 'años construyendo producto web' },
  { value: '5–8', label: 'personas por equipo coordinado' },
  { value: '4', label: 'sectores: banca, seguros, energía y retail' },
  { value: '6', label: 'empresas, de agencia a enterprise' },
] as const;

export const principles = [
  {
    title: 'Arquitectura con propósito',
    text: 'Cada decisión técnica responde a una necesidad de negocio, de mantenimiento o de escala. Nada por moda.',
  },
  {
    title: 'Estándares que se comparten',
    text: 'Arquetipos y patrones reutilizables que aceleran los nuevos desarrollos y reducen deuda técnica.',
  },
  {
    title: 'Equipos que aprenden',
    text: 'Mentoring, comunidad técnica y revisión constante. Un buen equipo vale más que un buen framework.',
  },
] as const;

export const experiences: readonly Experience[] = [
  {
    id: 'innocv',
    start: 'Feb 2019',
    end: 'Actualidad',
    organization: 'INNOCV Solutions',
    role: 'Frontend Architect · Chapter Lead',
    summary:
      'Arquitectura frontend end-to-end en proyectos enterprise, definida desde cero y adaptada a las necesidades reales de cada cliente.',
    highlights: [
      'Coordinación técnica de equipos frontend de 5 a 8 personas, alineando roadmap, calidad y entrega.',
      'Chapter Lead: estándares de desarrollo, mentoring, comunidad técnica y mejora continua.',
      'Definición de arquetipos frontend reutilizables y patrones que reducen deuda técnica.',
      'Soluciones con Angular, React, Vue y SSR con Next.js, con integración robusta contra APIs REST.',
      'Apps móviles con React Native y diseño de soluciones con IA aplicada y orquestación de flujos.',
    ],
    stack: ['Angular', 'React', 'Next.js', 'Vue', 'React Native', 'TypeScript', 'IA aplicada'],
    current: true,
  },
  {
    id: 'inserious',
    start: 'Jun 2015',
    end: 'Feb 2019',
    organization: 'inserious DIGITAL',
    role: 'Programador web',
    summary: 'Desarrollo de una plataforma de gamificación y su evolución a un producto multiplataforma.',
    highlights: [
      'Plataforma de gamificación con AngularJS, HTML5 y CSS3, evolucionada a Ionic + Angular para Android, iOS y web.',
      'Proyectos formativos gamificados para clientes como Mahou.',
      'Arquitectura offline con Raspberry Pi como punto de acceso y servidor local.',
      'Dinámicas para campañas en bares con interacción en tercera pantalla.',
    ],
    stack: ['AngularJS', 'Ionic', 'Angular', 'APIs REST'],
  },
  {
    id: 'adeuve',
    start: 'Ene 2014',
    end: 'Jun 2015',
    organization: 'Adeuve',
    role: 'Programador web',
    summary: 'Desarrollo full stack de sitios corporativos y soluciones a medida para cliente final.',
    highlights: [
      'Gestión de CMS con WordPress, Joomla y Moodle: contenidos, flujos y administración.',
      'Maquetación de páginas y emails, y mantenimiento evolutivo de plataformas.',
    ],
    stack: ['WordPress', 'Joomla', 'Moodle', 'PHP'],
  },
  {
    id: 'freelandstudio',
    start: 'Jul 2013',
    end: 'Dic 2014',
    organization: 'Freelandstudio',
    role: 'Programador web',
    summary: 'Desarrollo frontend para proyectos de agencia a partir de diseño previo.',
    highlights: ['Interfaces con JavaScript, jQuery, HTML5 y CSS3, e integración con CMS.'],
    stack: ['JavaScript', 'jQuery', 'HTML5', 'CSS3'],
  },
  {
    id: 'haycanal',
    start: 'Abr 2013',
    end: 'Jun 2013',
    organization: 'hayCANAL.com',
    role: 'Programador web',
    summary: 'Maquetación de una plataforma de encuestas.',
    highlights: ['Construcción de interfaces web con HTML y CSS.'],
    stack: ['HTML5', 'CSS3'],
  },
  {
    id: 'byginnovacion',
    start: 'Abr 2012',
    end: 'Dic 2012',
    organization: 'B&G innovación',
    role: 'Programador web',
    summary: 'Primer proyecto profesional: una plataforma de gestión de empleados.',
    highlights: ['Desarrollo en Ruby on Rails y pruebas de regresión automatizadas con Cucumber.'],
    stack: ['Ruby on Rails', 'Cucumber'],
  },
];

export const projects: readonly Project[] = [
  {
    id: 'evo',
    client: 'Evo Bank',
    sector: 'Banca',
    title: 'Hipotecas online',
    description: 'Plataforma de contratación de hipotecas online para un banco digital.',
    stack: ['Frontend enterprise', 'APIs REST'],
    size: 'large',
  },
  {
    id: 'mapfre',
    client: 'Mapfre',
    sector: 'Seguros',
    title: 'Paneles internos',
    description: 'Paneles internos y herramientas de gestión de datos para equipos de negocio.',
    stack: ['Frontend enterprise', 'APIs REST'],
    size: 'medium',
  },
  {
    id: 'repsol',
    client: 'Repsol',
    sector: 'Energía',
    title: 'Pricing',
    description: 'Interfaces para la gestión de pricing en el sector energético.',
    stack: ['Frontend enterprise'],
    size: 'medium',
  },
  {
    id: 'retail',
    client: 'Hiber · DIA',
    sector: 'Retail',
    title: 'E-commerce',
    description: 'Participación en plataformas de comercio electrónico para retail.',
    stack: ['E-commerce'],
    size: 'small',
  },
  {
    id: 'mobile',
    client: 'Seguros y RR. HH.',
    sector: 'Mobile',
    title: 'Apps con React Native',
    description: 'Seguros de viaje y gestión de trabajadores en iOS y Android.',
    stack: ['React Native'],
    size: 'small',
  },
  {
    id: 'ai',
    client: 'Producto',
    sector: 'IA aplicada',
    title: 'Orquestación de flujos con IA',
    description: 'Diseño de soluciones de IA y su arquitectura de integración para casos de producto.',
    stack: ['IA aplicada', 'Integración'],
    size: 'small',
  },
  {
    id: 'mahou',
    client: 'Mahou',
    sector: 'Gamificación',
    title: 'Formación gamificada offline',
    description: 'Plataforma de gamificación con Raspberry Pi como servidor local para sesiones sin conexión.',
    stack: ['AngularJS', 'Ionic', 'Raspberry Pi'],
    size: 'wide',
  },
];

export const otherClients = ['Unicaja', 'Santa Lucía', 'Logística interna'] as const;

export const capabilities: readonly Capability[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Frameworks modernos y fundamentos sólidos de la web.',
    skills: ['Angular', 'React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3 / SASS'],
  },
  {
    id: 'architecture',
    title: 'Arquitectura',
    description: 'Diseño de soluciones que aguantan el paso del tiempo.',
    skills: ['Diseño de soluciones', 'Arquetipos reutilizables', 'Estándares técnicos', 'SSR', 'APIs REST'],
  },
  {
    id: 'leadership',
    title: 'Liderazgo',
    description: 'Personas, procesos y comunidad técnica.',
    skills: ['Chapter Lead', 'Mentoring', 'Coordinación de equipos', 'Comunidad técnica'],
  },
  {
    id: 'beyond',
    title: 'Más allá',
    description: 'Mobile, IA y el ecosistema que rodea al frontend.',
    skills: ['React Native', 'Ionic', 'IA aplicada', 'Node.js', 'PHP', 'Ruby on Rails', 'MySQL', 'Git'],
  },
];

export const education = [
  { title: 'Técnico Superior en Desarrollo de Aplicaciones Web', place: 'I.E.S. Luis Vives', period: '2012 — 2013' },
  { title: 'Técnico Superior en Desarrollo de Aplicaciones Informáticas', place: 'I.E.S. Luis Vives', period: '2011 — 2013' },
  { title: 'Bachillerato en Humanidades', place: 'IES María Zambrano', period: '2008 — 2010' },
] as const;

export interface Story {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  minutes: number;
  tags: string[];
}

/** Newest first, as published on Medium. */
export const stories: readonly Story[] = medium.stories;


/** What the avatar says when it arrives at each section. */
export const avatarLines = {
  hero: 'Hola, soy Óscar.',
  letter: 'Te cuento quién soy.',
  experience: 'Desde 2012 construyendo web.',
  projects: 'Algunos proyectos de los que estoy orgulloso.',
  capabilities: 'Herramientas al servicio del problema.',
  writing: 'Lo que aprendo, lo escribo.',
  background: 'Nunca dejo de estudiar.',
  contact: '¿Hablamos?',
} as const;

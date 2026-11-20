/**
 * Plantilla «cuaderno»: cuaderno de orientación dibujado a mano (tinta y acuarela).
 * Pensada para perfiles de educación y orientación: cálida, legible, sin 3D.
 * Metáfora: orientar es ayudar a elegir caminos (poste indicador, camino con
 * paradas, brújula, postales de proyectos europeos).
 */
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  avatarLines,
  capabilities,
  education,
  experiences,
  figures,
  hero,
  identity,
  isVisible,
  letter,
  navigation,
  otherClients,
  principles,
  projects,
  sections,
  stories,
  type SectionCopy,
} from '../../content/portfolio';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useReveal } from '../../hooks/useReveal';
import { Books, Check, Circle, Compass, CurlyArrow, Envelope, Filters, PaperPlane, PathSegment, Signpost, Underline } from './illustrations';
import './cuaderno.css';

const BASE = import.meta.env.BASE_URL;
const cvHref = `${BASE}cv.html`;
const isUrl = (value: string) => /^https?:\/\//.test(value);
const pad = (n: number) => String(n + 1).padStart(2, '0');
const delay = (i: number) => ({ '--i': i }) as CSSProperties;
/** Retrato del perfil (ilustración o foto, nunca el favicon). Se muestra como polaroid con cinta. */
const photo = hero.portrait && !hero.portrait.startsWith('icons/') ? `${BASE}${hero.portrait}` : '';

/** Nota manuscrita al margen con flecha. */
function MarginNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`margin-note ${className}`} data-reveal aria-hidden="true">
      <span>{children}</span>
      <CurlyArrow />
    </p>
  );
}

function SectionHead({ id, copy, note, children }: { id: string; copy: SectionCopy; note?: string; children?: ReactNode }) {
  return (
    <header className="section-head">
      <div data-reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id={`${id}-title`} className="section-title">
          {copy.title} <em>{copy.titleMuted}</em>
        </h2>
        {copy.lead && <p className="section-lead">{copy.lead}</p>}
      </div>
      {note && <MarginNote>{note}</MarginNote>}
      {children}
    </header>
  );
}

function Header() {
  const ids = navigation.map((item) => item.id);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLElement>(null);

  useEffect(() => {
    sheet.current?.toggleAttribute('inert', !open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className={`topbar ${open ? 'topbar--open' : ''}`}>
      <div className="topbar__inner shell">
        <a className="brand" href="#inicio" onClick={() => setOpen(false)}>
          {identity.displayName}
        </a>
        <nav className="topbar__nav" aria-label="Principal">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="tag-button" href={cvHref} target="_blank" rel="noopener">
          Descargar CV
        </a>
        <button
          className="topbar__toggle"
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>
      <nav className="topbar__sheet" id="menu-movil" aria-label="Menú" ref={sheet}>
        {navigation.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>
        ))}
        <a href={cvHref} target="_blank" rel="noopener" onClick={() => setOpen(false)}>Descargar CV</a>
      </nav>
    </header>
  );
}

const OPTIONS = hero.portraitOptions ?? [];
const STORAGE_KEY = 'cq-retrato';

/** Retrato elegido: ?retrato=<id> en la URL, luego localStorage, luego el del perfil. */
function initialPortrait() {
  if (!import.meta.env.DEV || OPTIONS.length === 0) return photo;
  try {
    const wanted = new URLSearchParams(location.search).get('retrato') ?? localStorage.getItem(STORAGE_KEY);
    const option = OPTIONS.find((o) => o.id === wanted);
    if (option) return `${BASE}${option.src}`;
  } catch { /* sin storage: retrato por defecto */ }
  return photo;
}

/**
 * Selector para probar retratos en local. Solo existe en `npm run dev`:
 * `import.meta.env.DEV` es false en build, así que no llega a producción.
 */
function PortraitPicker({ current, onPick }: { current: string; onPick: (src: string, id: string) => void }) {
  return (
    <div className="portrait-picker" role="group" aria-label="Probar retrato (solo en local)">
      <span className="portrait-picker__title">Retrato</span>
      {OPTIONS.map((option) => {
        const src = `${BASE}${option.src}`;
        return (
          <button
            key={option.id}
            type="button"
            className="portrait-picker__option"
            aria-pressed={current === src}
            onClick={() => onPick(src, option.id)}
            title={option.label}
          >
            <img src={src} alt="" width="48" height="64" />
            <span>{option.id === 'svg' ? 'SVG' : option.id} · {option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Hero() {
  const [first, second, ...rest] = hero.title;
  const [portrait, setPortrait] = useState(initialPortrait);
  const pick = (src: string, id: string) => {
    setPortrait(src);
    try {
      localStorage.setItem(STORAGE_KEY, id);
      const url = new URL(location.href);
      url.searchParams.set('retrato', id);
      history.replaceState(null, '', url);
    } catch { /* sin storage */ }
  };
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__inner shell">
        <div className="hero__copy" data-reveal>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <span>{first}</span>{' '}
            <span className="hero__underlined">
              {second}
              <Underline />
            </span>{' '}
            {rest.length > 0 && <em>{rest.join(' ')}</em>}
          </h1>
          <p className="hero__lead">{hero.lead}</p>
          <div className="hero__actions">
            <a className="button button--ink" href="#carta">Leer mi carta</a>
            <a className="button button--paper" href={cvHref} target="_blank" rel="noopener">Descargar CV</a>
          </div>
          <InterestLinks className="hero__links" label="Encuéntrame en" />
        </div>
        <div className="hero__art" data-reveal style={delay(2)}>
          <Signpost />
          {portrait && (
            <figure className="polaroid">
              <span className="tape" aria-hidden="true" />
              <img src={portrait} alt={`Retrato ilustrado de ${identity.fullName}`} width="300" height="400" />
              <figcaption>{identity.firstName}</figcaption>
            </figure>
          )}
        </div>
      </div>
      {import.meta.env.DEV && OPTIONS.length > 0 && <PortraitPicker current={portrait} onPick={pick} />}
    </section>
  );
}

function Letter() {
  return (
    <section className="letter" id="carta" aria-labelledby="letter-title">
      <div className="shell letter__grid">
        <aside className="letter__aside">
          <MarginNote className="margin-note--left">{avatarLines.letter}</MarginNote>
          {figures.length > 0 && (
            <ul className="figures" aria-label="En cifras">
              {figures.map((figure, i) => (
                <li key={figure.label} data-reveal style={delay(i)}>
                  <strong>{figure.value}<Circle /></strong>
                  <span>{figure.label}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
        <article className="sheet" data-reveal>
          <span className="tape tape--left" aria-hidden="true" />
          <span className="tape tape--right" aria-hidden="true" />
          <p className="eyebrow">Carta de presentación</p>
          <h2 id="letter-title" className="sheet__greeting">{letter.greeting}</h2>
          {letter.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
          <p className="sheet__closing">{letter.closing}</p>
          <footer className="sheet__signature">
            <span className="signature">{letter.signature}</span>
            <span>{identity.role}</span>
          </footer>
        </article>
      </div>

      {principles.length > 0 && (
        <div className="principles shell">
          <h3 className="principles__title" data-reveal>{sections.principlesTitle}</h3>
          <ol>
            {principles.map((principle, i) => (
              <li className="index-card" key={principle.title} data-reveal style={delay(i)}>
                <span className="tape" aria-hidden="true" />
                <span className="index-card__n">{pad(i)}</span>
                <h4>{principle.title}</h4>
                <p>{principle.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function Journey() {
  if (!isVisible('experiencia')) return null;
  return (
    <section className="journey" id="experiencia" aria-labelledby="experiencia-title">
      <div className="shell">
        <SectionHead id="experiencia" copy={sections.experience} note={avatarLines.experience} />
        <ol className="stops">
          {experiences.map((item, i) => (
            <li className={`stop ${item.current ? 'stop--current' : ''}`} key={item.id} data-reveal>
              <div className="stop__rail" aria-hidden="true">
                <span className="stop__marker">{item.start.slice(-4)}</span>
                {i < experiences.length - 1 && <PathSegment />}
              </div>
              <article className="stop__card">
                <p className="stop__when">
                  {item.current && <span className="stop__now">ahora</span>}
                  {item.start} — {item.end}
                </p>
                <h3>{item.role}</h3>
                <p className="stop__org">{item.organization}</p>
                <p className="stop__summary">{item.summary}</p>
                <ul>
                  {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <p className="tags">{item.stack.map((tag) => <span key={tag}>{tag}</span>)}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const STAMPS = ['blue', 'terra', 'sage', 'ochre'] as const;

function Projects() {
  if (!isVisible('proyectos')) return null;
  return (
    <section className="projects" id="proyectos" aria-labelledby="proyectos-title">
      <div className="shell">
        <SectionHead id="proyectos" copy={sections.projects}>
          <div className="section-head__art" data-reveal><PaperPlane /></div>
        </SectionHead>
        <ul className="postcards">
          {projects.map((project, i) => (
            <li key={project.id} className={`postcard postcard--${project.size}`} data-reveal style={delay(i % 3)}>
              <article>
                <div className="postcard__body">
                  <p className="postcard__sector">{project.sector}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</p>
                </div>
                <div className="postcard__side" aria-hidden="true">
                  <span className={`stamp stamp--${STAMPS[i % STAMPS.length]}`}>
                    <span>{project.client}</span>
                  </span>
                  <span className="postmark" />
                  <span className="postcard__lines"><i /><i /><i /></span>
                </div>
              </article>
            </li>
          ))}
          {otherClients.length > 0 && (
            <li className="sticky-note" data-reveal style={delay(2)}>
              <span className="tape" aria-hidden="true" />
              <p className="sticky-note__title">{sections.otherClientsLabel}</p>
              <ul>
                {otherClients.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}

function Skills() {
  if (!isVisible('capacidades')) return null;
  return (
    <section className="skills" id="capacidades" aria-labelledby="capacidades-title">
      <div className="shell skills__grid">
        <div className="skills__aside">
          <SectionHead id="capacidades" copy={sections.capabilities} note={avatarLines.capabilities} />
          <div className="skills__art" data-reveal><Compass /></div>
        </div>
        <div className="skills__cards">
          {capabilities.map((group, i) => (
            <article className={`skill-card skill-card--${STAMPS[i % STAMPS.length]}`} key={group.id} data-reveal style={delay(i)}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>
                {group.skills.map((skill) => <li key={skill}><mark>{skill}</mark></li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const dateFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

function Writing() {
  if (!isVisible('escritos')) return null;
  return (
    <section className="writing" id="escritos" aria-labelledby="escritos-title">
      <div className="shell">
        <SectionHead id="escritos" copy={sections.writing} note={avatarLines.writing} />
        <ul className="entries">
          {stories.map((story) => (
            <li key={story.url} data-reveal>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                <span className="entries__date">{dateFormat.format(new Date(`${story.date}T12:00:00`))}</span>
                <span className="entries__title">{story.title}</span>
                <span className="entries__excerpt">{story.excerpt}</span>
              </a>
            </li>
          ))}
        </ul>
        {identity.medium && (
          <a className="button button--paper" href={identity.medium} target="_blank" rel="noopener noreferrer">Ver todo en Medium</a>
        )}
      </div>
    </section>
  );
}

function Studies() {
  if (!isVisible('formacion')) return null;
  return (
    <section className="studies" id="formacion" aria-labelledby="formacion-title">
      <div className="shell studies__grid">
        <div>
          <SectionHead id="formacion" copy={sections.background} note={avatarLines.background} />
          <div className="studies__art" data-reveal><Books /></div>
        </div>
        <ol className="studies__list">
          {education.map((item, i) => (
            <li key={item.title} className={i === 0 ? 'studies__main' : undefined} data-reveal style={delay(i)}>
              <Check />
              <div>
                <h3>{item.title}</h3>
                <p>{item.place} · {item.period}</p>
              </div>
              {item.badge && <span className="rubber-stamp">{item.badge}</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  const subject = encodeURIComponent(`Hola ${identity.firstName}`);
  const [user, domain] = identity.email.split('@');
  return (
    <section className="contact" id="contacto" aria-labelledby="contacto-title">
      <div className="shell">
        <div className="contact__card" data-reveal>
          <div className="contact__copy">
            <p className="eyebrow">{sections.contact.eyebrow}</p>
            <h2 id="contacto-title" className="section-title">
              {sections.contact.title} <em>{sections.contact.titleMuted}</em>
            </h2>
            {sections.contact.lead && <p className="section-lead">{sections.contact.lead}</p>}
            <a className="contact__email" href={`mailto:${identity.email}?subject=${subject}`}>
              {user}@<wbr />{domain}
              <Underline />
            </a>
            <div className="contact__actions">
              <a className="button button--ink" href={`mailto:${identity.email}?subject=${subject}`}>Escríbeme</a>
              {isUrl(identity.linkedin) && (
                <a className="button button--paper" href={identity.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
              {identity.medium && (
                <a className="button button--paper" href={identity.medium} target="_blank" rel="noopener noreferrer">Medium</a>
              )}
              <a className="button button--paper" href={cvHref} target="_blank" rel="noopener">CV</a>
            </div>
          </div>
          <div className="contact__art"><Envelope /></div>
        </div>
      </div>
    </section>
  );
}

/** Enlaces de interés (LinkedIn, Medium): portada y pie. */
function InterestLinks({ className, label }: { className: string; label: string }) {
  const links = [
    isUrl(identity.linkedin) && { href: identity.linkedin, label: 'LinkedIn' },
    identity.medium && { href: identity.medium, label: 'Medium' },
  ].filter((link): link is { href: string; label: string } => Boolean(link));
  if (links.length === 0) return null;
  return (
    <nav className={`interest-links ${className}`} aria-label="Enlaces de interés">
      <span className="interest-links__label">{label}</span>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer me">{link.label} <span aria-hidden="true">↗</span></a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <InterestLinks className="footer__links" label="Enlaces de interés" />
        <span>© {new Date().getFullYear()} {identity.fullName} · {identity.location}</span>
        <span>{sections.footerCredit}</span>
        <a href="#inicio">Volver arriba ↑</a>
      </div>
    </footer>
  );
}

export default function Site() {
  useReveal();
  return (
    <>
      <Filters />
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Hero />
        <Letter />
        <Journey />
        <Projects />
        <Skills />
        <Writing />
        <Studies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

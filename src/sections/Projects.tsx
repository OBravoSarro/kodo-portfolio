import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, isVisible, otherClients, projects, scenes, sections } from '../content/portfolio';

export function Projects() {
  if (!isVisible('proyectos')) return null;
  return (
    <section className="projects" id="proyectos" aria-labelledby="projects-title">
      <div className="shell">
        <header className="projects__head">
          <div>
            <p className="eyebrow" data-reveal>{sections.projects.eyebrow}</p>
            <h2 id="projects-title" className="section-title" data-reveal>{sections.projects.title}<br /><span className="is-muted">{sections.projects.titleMuted}</span></h2>
            {sections.projects.lead && <p className="section-lead" data-reveal>{sections.projects.lead}</p>}
          </div>
          <AvatarSlot id="projects" pose={scenes.projects.pose} scene={scenes.projects.scene} facing={-1} line={avatarLines.projects} className="projects__avatar" />
        </header>
        <ul className="bento">
          {projects.map((project, index) => (
            <li className={`bento__item bento__item--${project.size}`} key={project.id} data-reveal style={{ '--i': index % 3 } as React.CSSProperties}>
              <article className={`card ${project.size === 'large' ? 'card--dark' : ''}`}>
                <p className="card__sector">{project.sector}</p>
                <h3 className="card__client">{project.client}</h3>
                <p className="card__title">{project.title}</p>
                <p className="card__text">{project.description}</p>
                <p className="card__stack">{project.stack.join(' · ')}</p>
              </article>
            </li>
          ))}
          {otherClients.length > 0 && (
          <li className="bento__item bento__item--small" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <article className="card card--quiet">
              <p className="card__sector">{sections.otherClientsLabel}</p>
              <ul className="card__list">
                {otherClients.map((client) => <li key={client}>{client}</li>)}
              </ul>
            </article>
          </li>
          )}
        </ul>
      </div>
    </section>
  );
}

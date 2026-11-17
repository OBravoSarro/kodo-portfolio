import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, otherClients, projects } from '../content/portfolio';

export function Projects() {
  return (
    <section className="projects" id="proyectos" aria-labelledby="projects-title">
      <div className="shell">
        <header className="projects__head">
          <div>
            <p className="eyebrow" data-reveal>Proyectos</p>
            <h2 id="projects-title" className="section-title" data-reveal>Producto real.<br /><span className="is-muted">Para clientes exigentes.</span></h2>
            <p className="section-lead" data-reveal>Banca, seguros, energía y retail. Plataformas construidas desde cero junto al cliente, pensadas para durar.</p>
          </div>
          <AvatarSlot id="projects" pose="explain" scene="city" facing={-1} line={avatarLines.projects} className="projects__avatar" />
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
          <li className="bento__item bento__item--small" data-reveal style={{ '--i': 2 } as React.CSSProperties}>
            <article className="card card--quiet">
              <p className="card__sector">También</p>
              <ul className="card__list">
                {otherClients.map((client) => <li key={client}>{client}</li>)}
              </ul>
            </article>
          </li>
        </ul>
      </div>
    </section>
  );
}

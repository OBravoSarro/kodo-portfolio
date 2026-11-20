import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, experiences, isVisible, scenes, sections } from '../content/portfolio';

export function Experience() {
  if (!isVisible('experiencia')) return null;
  return (
    <section className="experience" id="experiencia" aria-labelledby="experience-title">
      <div className="experience__inner shell">
        <header className="experience__head">
          <div className="experience__sticky">
            <p className="eyebrow" data-reveal>{sections.experience.eyebrow}</p>
            <h2 id="experience-title" className="section-title" data-reveal>{sections.experience.title}<br /><span className="is-muted">{sections.experience.titleMuted}</span></h2>
            {sections.experience.lead && <p className="section-lead" data-reveal>{sections.experience.lead}</p>}
            <AvatarSlot id="experience" pose={scenes.experience.pose} scene={scenes.experience.scene} facing={1} line={avatarLines.experience} className="experience__avatar" />
          </div>
        </header>
        <ol className="timeline">
          {experiences.map((item) => (
            <li className={`role ${item.current ? 'role--current' : ''}`} key={item.id} data-reveal>
              <div className="role__head">
                <h3>{item.organization}</h3>
                <span className="role__period">
                  {item.current && <span className="role__badge">Actual</span>}
                  {item.start} — {item.end}
                </span>
              </div>
              <p className="role__title">{item.role}</p>
              <p className="role__summary">{item.summary}</p>
              <ul className="role__highlights">
                {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
              <p className="role__stack"><span className="sr-only">Tecnologías: </span>{item.stack.join(' · ')}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

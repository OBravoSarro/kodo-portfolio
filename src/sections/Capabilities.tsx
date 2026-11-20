import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, capabilities, isVisible, scenes, sections } from '../content/portfolio';

export function Capabilities() {
  if (!isVisible('capacidades')) return null;
  return (
    <section className="capabilities" id="capacidades" aria-labelledby="capabilities-title">
      <div className="shell">
        <header className="capabilities__head">
          <AvatarSlot id="capabilities" pose={scenes.capabilities.pose} scene={scenes.capabilities.scene} facing={1} line={avatarLines.capabilities} className="capabilities__avatar" />
          <div>
            <p className="eyebrow" data-reveal>{sections.capabilities.eyebrow}</p>
            <h2 id="capabilities-title" className="section-title" data-reveal>{sections.capabilities.title}<br /><span className="is-muted">{sections.capabilities.titleMuted}</span></h2>
          </div>
        </header>
        <div className="capabilities__grid">
          {capabilities.map((group, index) => (
            <div className="capability" key={group.id} data-reveal style={{ '--i': index } as React.CSSProperties}>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

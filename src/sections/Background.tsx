import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, education, isVisible, scenes, sections } from '../content/portfolio';

const index = (n: number) => String(n + 1).padStart(2, '0');

export function Background() {
  if (!isVisible('formacion')) return null;
  return (
    <section className="background" id="formacion" aria-labelledby="background-title">
      <div className="shell background__inner">
        <div className="background__aside">
          <AvatarSlot id="background" pose={scenes.background.pose} scene={scenes.background.scene} facing={1} line={avatarLines.background} className="background__avatar" />
          <h2 id="background-title" className="section-title background__title reveal-lines" data-reveal>
            <span className="line" style={{ '--l': 0 } as React.CSSProperties}><span>{sections.background.title}</span></span>
            <span className="line is-muted" style={{ '--l': 1 } as React.CSSProperties}><span>{sections.background.titleMuted}</span></span>
          </h2>
        </div>

        <ol className="background__list">
          {education.map((item, i) => (
            <li key={item.title} className="background__item" data-reveal style={{ '--i': i + 1 } as React.CSSProperties}>
              <span className="background__index" aria-hidden="true">{index(i)}</span>
              <div className="background__body">
                <h3>{item.title}</h3>
                <p>{item.place}</p>
              </div>
              <span className="background__meta">{item.period}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

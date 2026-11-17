import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { avatarLines, figures, identity, letter, principles } from '../content/portfolio';

export function Letter() {
  return (
    <section className="letter" id="carta" aria-labelledby="letter-title">
      <div className="letter__inner shell" data-avatar-zone>
        <div className="letter__aside">
          <AvatarSlot id="letter" pose="present" scene="mailbox" facing={1} line={avatarLines.letter} className="letter__avatar" />
        </div>
        <article className="letter__body">
          <p className="eyebrow" data-reveal>Carta de presentación</p>
          <h2 id="letter-title" className="letter__greeting" data-reveal>{letter.greeting}</h2>
          {letter.paragraphs.map((paragraph) => (
            <p className="letter__paragraph" key={paragraph.slice(0, 24)} data-reveal>{paragraph}</p>
          ))}
          <p className="letter__closing" data-reveal>{letter.closing}</p>
          <footer className="letter__signature" data-reveal>
            <strong>{letter.signature}</strong>
            <span>{identity.role}</span>
          </footer>
        </article>
      </div>

      <div className="figures shell" aria-label="Datos profesionales">
        {figures.map((figure, index) => (
          <div className="figure" key={figure.label} data-reveal style={{ '--i': index } as React.CSSProperties}>
            <strong>{figure.value}</strong>
            <span>{figure.label}</span>
          </div>
        ))}
      </div>

      <div className="principles shell">
        <h3 className="principles__title" data-reveal>Cómo trabajo</h3>
        <ol className="principles__list">
          {principles.map((principle, index) => (
            <li key={principle.title} data-reveal style={{ '--i': index } as React.CSSProperties}>
              <span className="principles__index">{String(index + 1).padStart(2, '0')}</span>
              <h4>{principle.title}</h4>
              <p>{principle.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

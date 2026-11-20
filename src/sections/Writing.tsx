import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { ArrowIcon } from '../components/graphics/ArrowIcon';
import { avatarLines, identity, isVisible, scenes, sections, stories } from '../content/portfolio';

const dateFormat = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T12:00:00`));

export function Writing() {
  if (!isVisible('escritos')) return null;
  const [first, second, ...rest] = stories;
  const featured = [first, second].filter((story): story is NonNullable<typeof story> => Boolean(story));

  return (
    <section className="writing" id="escritos" aria-labelledby="writing-title">
      <div className="shell">
        <header className="writing__head">
          <div>
            <p className="eyebrow" data-reveal>{sections.writing.eyebrow}</p>
            <h2 id="writing-title" className="section-title" data-reveal>{sections.writing.title}<br /><span className="is-muted">{sections.writing.titleMuted}</span></h2>
            <p className="section-lead" data-reveal>{sections.writing.lead} {stories.length} artículos publicados.</p>
          </div>
          <AvatarSlot id="writing" pose={scenes.writing.pose} scene={scenes.writing.scene} facing={-1} line={avatarLines.writing} className="writing__avatar" />
        </header>

        <div className="writing__featured">
          {featured.map((story, index) => (
            <a className="story story--featured" href={story.url} target="_blank" rel="noopener noreferrer" key={story.url} data-reveal style={{ '--i': index } as React.CSSProperties}>
              <span className="story__meta">{index === 0 ? 'Lo último' : 'Reciente'} · {formatDate(story.date)} · {story.minutes} min</span>
              <h3 className="story__title">{story.title}</h3>
              <p className="story__excerpt">{story.excerpt}</p>
              <span className="story__cta">Leer en Medium <ArrowIcon size={16} /></span>
            </a>
          ))}
        </div>

        <ul className="writing__list">
          {rest.map((story) => (
            <li key={story.url} data-reveal>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                <span className="writing__date">{formatDate(story.date)}</span>
                <span className="writing__title">{story.title}</span>
                <span className="writing__minutes">{story.minutes} min</span>
                <ArrowIcon diagonal size={18} />
              </a>
            </li>
          ))}
        </ul>

        <a className="button button--link writing__all" href={identity.medium} target="_blank" rel="noopener noreferrer" data-reveal>
          Ver todo en Medium <ArrowIcon size={16} />
        </a>
      </div>
    </section>
  );
}

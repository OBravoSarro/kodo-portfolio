import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { ArrowIcon } from '../components/graphics/ArrowIcon';
import { avatarLines, hero, identity } from '../content/portfolio';

const portrait = `${import.meta.env.BASE_URL}images/oscar-bravo-720.webp`;

export function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero__inner shell">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow intro" style={{ '--i': 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            {hero.title.map((line, index) => (
              <span className="line" key={line}>
                <span className={index === hero.title.length - 1 ? 'is-muted' : undefined} style={{ '--i': index + 1 } as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero__lead intro" style={{ '--i': 4 } as React.CSSProperties}>{hero.lead}</p>
          <div className="hero__actions intro" style={{ '--i': 5 } as React.CSSProperties}>
            <a className="button button--primary" href="#carta">Leer mi carta</a>
            <a className="button button--link" href={`${import.meta.env.BASE_URL}cv.html`} target="_blank" rel="noopener">
              Descargar CV <ArrowIcon size={16} />
            </a>
          </div>
          <dl className="hero__meta intro" style={{ '--i': 6 } as React.CSSProperties}>
            <div><dt>Ubicación</dt><dd>{identity.location}</dd></div>
            <div><dt>Desde</dt><dd>{identity.since}</dd></div>
            <div><dt>Ahora</dt><dd>{identity.company}</dd></div>
          </dl>
        </div>
        <AvatarSlot
          id="hero"
          pose="explain"
          scene="garden"
          facing={-1}
          line={avatarLines.hero}
          className="hero__avatar"
          fallback={<img className="avatar-fallback" src={portrait} alt="" width="720" height="788" />}
        />
      </div>
      <a className="hero__scroll" href="#carta" aria-label="Ir a la carta de presentación">
        <span />
      </a>
    </section>
  );
}

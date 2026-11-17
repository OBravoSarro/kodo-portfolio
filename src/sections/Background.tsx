import { education } from '../content/portfolio';

export function Background() {
  return (
    <section className="background shell" id="formacion" aria-labelledby="background-title">
      <h2 id="background-title" className="background__title" data-reveal>Formación</h2>
      <ul className="background__list" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
        {education.map((item) => (
          <li key={item.title}>
            <div><strong>{item.title}</strong><span>{item.place}</span></div>
            <span className="background__meta">{item.period}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

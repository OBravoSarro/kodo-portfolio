import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { ArrowIcon } from '../components/graphics/ArrowIcon';
import { avatarLines, identity } from '../content/portfolio';

export function Contact() {
  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="contact__inner shell">
        <AvatarSlot id="contact" pose="explain" scene="torii" facing={1} greet line={avatarLines.contact} className="contact__avatar" />
        <div className="contact__copy">
          <p className="eyebrow" data-reveal>Contacto</p>
          <h2 id="contact-title" className="section-title" data-reveal>¿Construimos algo<br /><span className="is-muted">juntos?</span></h2>
          <p className="section-lead" data-reveal>Si tienes un reto de arquitectura, un equipo que hacer crecer o un producto que construir bien, escríbeme.</p>
          <a className="contact__email" href={`mailto:${identity.email}?subject=Hola%20%C3%93scar`} data-reveal>
            {identity.email.split('@')[0]}@<wbr />{identity.email.split('@')[1]}
          </a>
          <div className="contact__actions" data-reveal>
            <a className="button button--primary button--light" href={`mailto:${identity.email}?subject=Hola%20%C3%93scar`}>Escríbeme</a>
            <a className="button button--ghost" href={identity.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowIcon diagonal size={15} /></a>
            <a className="button button--ghost" href={identity.medium} target="_blank" rel="noopener noreferrer">Medium <ArrowIcon diagonal size={15} /></a>
            <a className="button button--ghost" href={`${import.meta.env.BASE_URL}cv.html`} target="_blank" rel="noopener">CV <ArrowIcon diagonal size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

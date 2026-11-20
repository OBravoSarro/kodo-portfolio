import { AvatarSlot } from '../components/avatar/AvatarSlot';
import { ArrowIcon } from '../components/graphics/ArrowIcon';
import { avatarLines, identity, scenes, sections } from '../content/portfolio';

const subject = encodeURIComponent(`Hola ${identity.firstName}`);

export function Contact() {
  return (
    <section className="contact" id="contacto" aria-labelledby="contact-title">
      <div className="contact__inner shell">
        <AvatarSlot id="contact" pose={scenes.contact.pose} scene={scenes.contact.scene} facing={1} greet line={avatarLines.contact} className="contact__avatar" />
        <div className="contact__copy">
          <p className="eyebrow" data-reveal>{sections.contact.eyebrow}</p>
          <h2 id="contact-title" className="section-title" data-reveal>{sections.contact.title}<br /><span className="is-muted">{sections.contact.titleMuted}</span></h2>
          {sections.contact.lead && <p className="section-lead" data-reveal>{sections.contact.lead}</p>}
          <a className="contact__email" href={`mailto:${identity.email}?subject=${subject}`} data-reveal>
            {identity.email.split('@')[0]}@<wbr />{identity.email.split('@')[1]}
          </a>
          <div className="contact__actions" data-reveal>
            <a className="button button--primary button--light" href={`mailto:${identity.email}?subject=${subject}`}>Escríbeme</a>
            <a className="button button--ghost" href={identity.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowIcon diagonal size={15} /></a>
            {identity.medium && <a className="button button--ghost" href={identity.medium} target="_blank" rel="noopener noreferrer">Medium <ArrowIcon diagonal size={15} /></a>}
            <a className="button button--ghost" href={`${import.meta.env.BASE_URL}cv.html`} target="_blank" rel="noopener">CV <ArrowIcon diagonal size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

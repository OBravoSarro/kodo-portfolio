import { identity, sections } from '../../content/portfolio';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner shell">
        <span>© {new Date().getFullYear()} {identity.fullName} · {identity.location}</span>
        <span>{sections.footerCredit}</span>
        <nav className="footer__links" aria-label="Perfiles">
          <a href={identity.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {identity.medium && <a href={identity.medium} target="_blank" rel="noopener noreferrer">Medium</a>}
          <a href="#inicio">Volver arriba ↑</a>
        </nav>
      </div>
    </footer>
  );
}

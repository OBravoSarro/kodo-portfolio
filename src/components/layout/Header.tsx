import { useEffect, useRef, useState } from 'react';
import { identity, navigation } from '../../content/portfolio';
import { useActiveSection } from '../../hooks/useActiveSection';

const sectionIds = navigation.map((item) => item.id);

export function Header() {
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sheet = useRef<HTMLElement>(null);

  // React 18 has no `inert` prop: closed menu links must not be focusable.
  useEffect(() => {
    sheet.current?.toggleAttribute('inert', !open);
  }, [open]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.classList.add('no-scroll');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${open ? 'header--open' : ''}`}>
      <div className="header__bar shell">
        <a className="header__brand" href="#inicio" onClick={() => setOpen(false)}>
          {identity.displayName}
        </a>
        <nav className="header__nav" aria-label="Principal">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header__cta" href={`${import.meta.env.BASE_URL}cv.html`} target="_blank" rel="noopener">
          Descargar CV
        </a>
        <button
          className="header__toggle"
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
      </div>
      <nav className="header__sheet" id="mobile-menu" aria-label="Menú" ref={sheet}>
        {navigation.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}>{item.label}</a>
        ))}
        <a href={`${import.meta.env.BASE_URL}cv.html`} target="_blank" rel="noopener" onClick={() => setOpen(false)}>Descargar CV</a>
      </nav>
    </header>
  );
}

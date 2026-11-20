/**
 * Ilustraciones «dibujadas a mano» de la plantilla cuaderno.
 *
 * Técnica: SVG plano + dos filtros compartidos (definidos una vez en <Filters/>):
 *  - #cq-ink  desplaza ligeramente los trazos → línea de tinta irregular.
 *  - #cq-wash deforma los rellenos → mancha de acuarela; con mix-blend-mode
 *    multiply las manchas se mezclan como pigmento.
 * Los trazos con clase `draw` y pathLength=1 se «dibujan» al entrar en pantalla
 * (ver cuaderno.css). Todo es decorativo: aria-hidden.
 */
import type { ReactNode } from 'react';

export function Filters() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="cq-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="cq-wash" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="11" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feGaussianBlur in="shape" stdDeviation="0.8" />
        </filter>
      </defs>
    </svg>
  );
}

function Art({ viewBox, className = '', children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg className={`art ${className}`} viewBox={viewBox} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const Draw = ({ d, className = '' }: { d: string; className?: string }) => <path className={`ink draw ${className}`} d={d} pathLength={1} />;

/** Portada: poste indicador en una colina con caminos que se bifurcan. Orientar = elegir camino. */
export function Signpost() {
  return (
    <Art viewBox="0 0 520 470" className="art--signpost">
      {/* Cielo */}
      <circle className="wash wash--ochre" cx="410" cy="96" r="54" />
      <g className="ink ink--soft">
        <path d="M410 22 v14 M466 46 l-10 10 M484 98 h-14 M354 46 l10 10 M342 98 h14" />
      </g>
      <path className="ink paper-fill float" d="M66 112 c-20 0 -26 -24 -6 -30 c2 -20 28 -26 38 -10 c12 -18 42 -12 44 8 c20 0 24 26 4 32 Z" />
      <g className="ink float float--slow">
        <path d="M296 70 q8 -9 16 0 q8 -9 16 0" />
        <path d="M334 104 q6 -7 12 0 q6 -7 12 0" />
      </g>

      {/* Colinas */}
      <path className="wash wash--sage-light" d="M0 330 C 90 280, 200 270, 300 300 S 460 290, 520 268 L520 470 L0 470 Z" />
      <path className="ink ink--soft" d="M0 330 C 90 280, 200 270, 300 300 S 460 290, 520 268" />
      <path className="wash wash--sage" d="M0 382 C 120 342, 230 350, 330 372 S 470 362, 520 352 L520 470 L0 470 Z" />
      <Draw d="M0 382 C 120 342, 230 350, 330 372 S 470 362, 520 352" />

      {/* Caminos: el principal llega al poste y se bifurca hacia el horizonte */}
      <path className="wash wash--ochre-light" d="M88 470 C 150 440, 240 426, 246 382 L262 382 C 268 426, 222 452, 178 470 Z" />
      <Draw d="M88 470 C 150 440, 240 426, 246 382" />
      <Draw d="M178 470 C 222 452, 268 426, 262 382" />
      <path className="ink trail" d="M264 372 C 300 352, 350 340, 400 322 S 470 300, 508 292" />
      <path className="ink trail" d="M244 372 C 200 350, 150 336, 92 322" />

      {/* Árbol */}
      <circle className="wash wash--sage-deep" cx="444" cy="270" r="34" />
      <circle className="wash wash--sage-deep" cx="418" cy="290" r="22" />
      <circle className="wash wash--sage" cx="468" cy="290" r="24" />
      <Draw d="M414 302 c-16 -4 -14 -28 4 -28 c-2 -22 26 -32 40 -18 c14 -12 38 0 32 18 c16 6 12 30 -6 30 c-6 10 -24 10 -30 2 c-10 8 -30 6 -40 -4 Z" />
      <Draw d="M438 360 C 440 336, 438 318, 441 300 M448 360 C 448 336, 450 318, 447 300 M444 330 l14 -12" />

      {/* Poste */}
      <path className="wash wash--terra-light" d="M244 384 L245 152 L257 150 L258 384 Z" />
      <Draw d="M244 386 L245 152 L251 140 L257 150 L258 386" />
      <path className="wash wash--blue" d="M256 166 L372 162 L394 181 L373 200 L256 198 Z" />
      <Draw d="M256 166 L372 162 L394 181 L373 200 L256 198 Z" />
      <path className="wash wash--sage" d="M246 220 L142 218 L120 237 L141 256 L246 253 Z" />
      <Draw d="M246 220 L142 218 L120 237 L141 256 L246 253 Z" />
      <path className="wash wash--terra" d="M256 274 L352 277 L372 294 L351 311 L256 308 Z" />
      <Draw d="M256 274 L352 277 L372 294 L351 311 L256 308 Z" />
      <g className="hand-svg">
        <text x="270" y="190" transform="rotate(-1.5 320 182)">Universidad</text>
        <text x="150" y="245" transform="rotate(1 190 237)">Empleo</text>
        <text x="274" y="301" transform="rotate(1.2 310 293)">Europa</text>
      </g>
      <g className="ink-dot">
        <circle cx="262" cy="182" r="2.2" /><circle cx="240" cy="236" r="2.2" /><circle cx="262" cy="291" r="2.2" />
      </g>
      <path className="ink" d="M230 388 l4 -10 l3 9 l4 -12 l3 12 M262 388 l3 -9 l3 8 l4 -11" />

      {/* Flores */}
      <g className="flower">
        <path className="ink ink--soft" d="M120 418 v14 M150 404 v12 M380 398 v14 M402 410 v10" />
        <circle cx="120" cy="415" r="4.5" /><circle cx="150" cy="401" r="4" /><circle cx="380" cy="395" r="4.5" /><circle cx="402" cy="407" r="3.5" />
      </g>

      {/* Nota al margen */}
      <g className="note-svg">
        <text x="14" y="214" transform="rotate(-6 70 210)">¿y ahora, por dónde?</text>
        <path className="ink ink--accent" d="M62 228 C 72 262, 104 270, 124 256" />
        <path className="ink ink--accent" d="M114 252 L125 256 L119 266" />
      </g>
    </Art>
  );
}

/** Competencias: brújula con la aguja oscilando suavemente. */
export function Compass() {
  const ticks = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const r1 = i % 4 === 0 ? 64 : 71;
    return `M${110 + Math.sin(a) * r1} ${110 - Math.cos(a) * r1} L${110 + Math.sin(a) * 79} ${110 - Math.cos(a) * 79}`;
  }).join(' ');
  return (
    <Art viewBox="0 0 220 220" className="art--compass">
      <circle className="wash wash--ochre" cx="110" cy="110" r="94" />
      <circle className="ink draw" cx="110" cy="110" r="86" pathLength={1} />
      <circle className="ink ink--soft" cx="110" cy="110" r="80" />
      <path className="ink ink--soft" d={ticks} />
      <g className="hand-svg hand-svg--center">
        <text x="110" y="46">N</text>
        <text x="110" y="190">S</text>
        <text x="182" y="118">E</text>
        <text x="38" y="118">O</text>
      </g>
      <g className="needle">
        <path className="wash wash--terra-strong" d="M110 50 L122 110 L98 110 Z" />
        <path className="ink" d="M110 50 L122 110 L110 170 L98 110 Z M98 110 L122 110" />
        <circle className="ink-dot" cx="110" cy="110" r="6" />
      </g>
    </Art>
  );
}

/** Formación: pila de libros con birrete y una planta que crece. */
export function Books() {
  return (
    <Art viewBox="0 0 240 240" className="art--books">
      <path className="wash wash--blue" d="M30 204 L210 200 L212 226 L32 230 Z" />
      <Draw d="M30 204 L210 200 L212 226 L32 230 Z M52 203 L54 229 M64 216 L120 214" />
      <path className="wash wash--terra" d="M46 174 L196 176 L194 202 L44 200 Z" />
      <Draw d="M46 174 L196 176 L194 202 L44 200 Z M176 176 L174 201 M60 188 L130 189" />
      <path className="wash wash--sage" d="M60 148 L184 144 L186 172 L62 176 Z" />
      <Draw d="M60 148 L184 144 L186 172 L62 176 Z M78 147 L80 175 M92 160 L150 158" />
      {/* Birrete */}
      <path className="wash wash--ink" d="M66 124 L98 110 L130 124 L98 138 Z" />
      <Draw d="M66 124 L98 110 L130 124 L98 138 Z M80 131 L80 144 C 90 150, 106 150, 116 144 L116 131 M98 124 L122 129 L124 140" />
      {/* Planta */}
      <Draw d="M156 146 C 154 122, 162 102, 156 78" />
      <path className="wash wash--sage-deep" d="M156 112 C 136 106, 130 94, 134 86 C 148 88, 156 98, 156 112 Z" />
      <Draw d="M156 112 C 136 106, 130 94, 134 86 C 148 88, 156 98, 156 112 Z" />
      <path className="wash wash--sage-deep" d="M158 98 C 176 88, 184 76, 180 68 C 166 70, 158 82, 158 98 Z" />
      <Draw d="M158 98 C 176 88, 184 76, 180 68 C 166 70, 158 82, 158 98 Z" />
      <path className="wash wash--sage" d="M156 80 C 148 68, 152 56, 158 52 C 164 60, 164 72, 156 80 Z" />
      <Draw d="M156 80 C 148 68, 152 56, 158 52 C 164 60, 164 72, 156 80 Z" />
    </Art>
  );
}

function star(cx: number, cy: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }).join(' ') + ' Z';
}

/** Proyectos europeos: corona de estrellas y un avión de papel que viaja. */
export function PaperPlane() {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return star(74 + Math.sin(a) * 36, 62 - Math.cos(a) * 36, 6.5);
  }).join(' ');
  return (
    <Art viewBox="0 0 360 180" className="art--plane">
      <path className="star-fill" d={stars} />
      <path className="ink ink--soft" d={stars} />
      <path className="ink trail" d="M30 164 C 70 164, 84 110, 126 116 S 166 168, 206 128 S 254 62, 292 64" />
      <g className="float">
        <path className="paper-fill ink" d="M282 58 L352 26 L310 70 Z" />
        <path className="wash wash--blue" d="M310 70 L352 26 L322 94 Z" />
        <Draw d="M282 58 L352 26 L322 94 L310 70 Z M310 70 L352 26" />
      </g>
    </Art>
  );
}

/** Contacto: sobre lacrado con un avión de papel saliendo. */
export function Envelope() {
  return (
    <Art viewBox="0 0 300 210" className="art--envelope">
      <path className="ink trail" d="M170 112 C 200 70, 228 64, 250 44" />
      <g className="float">
        <path className="paper-fill ink" d="M246 40 L290 18 L262 50 Z" />
        <path className="wash wash--blue" d="M262 50 L290 18 L270 66 Z" />
        <path className="ink" d="M246 40 L290 18 L270 66 L262 50 Z" />
      </g>
      <path className="wash wash--terra-light" d="M36 82 L246 74 L252 192 L40 198 Z" />
      <Draw d="M36 82 L246 74 L252 192 L40 198 Z" />
      <Draw d="M36 82 L144 144 L246 74 M40 198 L116 136 M252 192 L172 134" />
      <circle className="wash wash--terra-strong" cx="144" cy="146" r="16" />
      <circle className="ink" cx="144" cy="146" r="14" />
      <text className="hand-svg seal" x="144" y="153">T</text>
    </Art>
  );
}

/* ---------- Garabatos reutilizables ---------- */

export function Underline({ className = '' }: { className?: string }) {
  return (
    <svg className={`doodle doodle--underline ${className}`} viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="draw" pathLength={1} d="M4 13 C 44 6, 96 4, 196 9" />
      <path className="draw draw--late" pathLength={1} d="M18 18 C 74 13, 132 12, 186 15" />
    </svg>
  );
}

export function Circle() {
  return (
    <svg className="doodle doodle--circle" viewBox="0 0 140 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="draw" pathLength={1} d="M70 7 C 26 6, 5 26, 9 44 C 13 64, 56 74, 92 70 C 124 66, 136 46, 128 28 C 118 10, 84 4, 50 11" />
    </svg>
  );
}

export function CurlyArrow({ className = '' }: { className?: string }) {
  return (
    <svg className={`doodle doodle--arrow ${className}`} viewBox="0 0 64 44" aria-hidden="true" focusable="false">
      <path className="draw" pathLength={1} d="M4 6 C 6 30, 30 40, 56 28" />
      <path className="draw draw--late" pathLength={1} d="M46 24 L57 28 L50 37" />
    </svg>
  );
}

export function Check() {
  return (
    <svg className="doodle doodle--check" viewBox="0 0 24 22" aria-hidden="true" focusable="false">
      <path className="draw" pathLength={1} d="M3 12 C 6 14, 8 17, 9 19 C 12 12, 16 7, 22 3" />
    </svg>
  );
}

/** Tramo ondulado del camino de la trayectoria (se estira con su elemento). */
export function PathSegment() {
  return (
    <svg className="path-segment" viewBox="0 0 24 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M12 0 C 3 22, 21 46, 12 70 S 8 92, 12 100" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

# Óscar Bravo — CV y carta de presentación

Web personal de **Óscar Bravo Sarro** (Frontend Architect & Chapter Lead). Funciona como CV y como carta de presentación: un avatar 3D inspirado en su retrato acompaña al visitante por cada sección, cambia de pose según el contenido y reacciona al cursor.

## Incluye

- Hero, carta de presentación en primera persona, cifras, principios de trabajo, experiencia, proyectos, capacidades, formación y contacto.
- Avatar 3D procedural (sin modelos externos): cabeza rapada, barba, camisa negra, tatuaje en el antebrazo derecho y reloj en la muñeca izquierda.
- Un único canvas WebGL fijo con una isla flotante animada por sección (jardín con cerezo y linterna, buzón para la carta, camino de piedras, ciudad enterprise, bloques, libros con avión de papel, torii con sol).
- El avatar no vuela: se desvanece en su isla y reaparece, ya en su pose, en la isla de la siguiente sección.
- Sección «Escritos» con los artículos de Medium, sincronizados en build desde el RSS público.
- CV imprimible en `public/cv.html` (botón «Guardar como PDF»).
- Animaciones de aparición en CSS (solo `opacity`/`transform`), `prefers-reduced-motion` respetado y foto como alternativa sin WebGL.

## Requisitos

- Node.js >= 20.19 (recomendado Node.js 22)
- npm
- Navegador moderno con soporte WebGL para las escenas 3D. Existe una representación alternativa sin WebGL.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL local indicada por Vite (normalmente `http://localhost:5173/`).

## Comprobaciones

```bash
npm run test:content
npm run typecheck
npm run build
npm run preview
```

Los archivos de producción se generan en `dist/`.

## Publicación en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo `kodo-portfolio`.
2. Descomprime este ZIP y sube **los archivos y carpetas que contiene** a la raíz del repositorio. Es importante subir también la carpeta oculta `.github/workflows`.
3. En GitHub, entra en **Settings → Pages → Build and deployment** y selecciona **GitHub Actions** como origen.
4. Haz `push` a la rama `main`. Se ejecutará el workflow `.github/workflows/deploy.yml`.
5. La web se publicará en `https://TU_USUARIO.github.io/kodo-portfolio/`.

El workflow detecta automáticamente el nombre real del repositorio y configura la ruta `base` necesaria para los recursos de Vite. Si el repositorio se llama `TU_USUARIO.github.io`, usará la raíz (`/`).

### Comandos Git iniciales

```bash
git init
git add .
git commit -m "feat: launch personal CV site"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPOSITORIO.git
git push -u origin main
```

Sustituye las dos variables `TU_USUARIO` y `NOMBRE_REPOSITORIO` por tus valores. No se ha incluido una URL de GitHub inventada.

### Dominio personalizado

Si en el futuro usas un dominio personalizado, cambia la variable `GITHUB_PAGES_BASE` del workflow a `/` y configura el dominio en GitHub Pages. Revisa también la URL de la imagen Open Graph para que sea absoluta si quieres la máxima compatibilidad con las redes sociales.

## Estructura

```text
src/
  components/
    avatar/         Avatar 3D: modelo (AvatarRig), poses, stage y slots del DOM
    layout/         Cabecera y pie
  content/          portfolio.ts — única fuente de verdad del contenido
  hooks/            Reveal, sección activa, WebGL y movimiento reducido
  sections/         Hero, Letter, Experience, Projects, Capabilities, Background, Contact
  styles/           Sistema visual y responsive
public/
  cv.html           CV imprimible / PDF
  images/           Retrato (fallback sin WebGL) y cubierta social
```

## Cómo funciona el avatar

1. Cada sección coloca un `<AvatarSlot id pose scene facing line />`. El layout decide dónde está la isla, no la escena 3D.
2. `AvatarStage` usa una cámara ortográfica donde 1 unidad = 1 px CSS. Cada frame lee el `getBoundingClientRect()` de cada slot y coloca su isla (`Dioramas.tsx`); `layout.ts` define dónde está el suelo para que isla y avatar coincidan.
3. El slot activo es el de la sección que más ocupa la banda central del viewport. Al cambiar, el avatar se desvanece (0,28 s), se coloca en la nueva isla con la pose ya aplicada y aparece (0,65 s). Nunca cruza la pantalla.
4. Las poses (`poses.ts`) son ángulos objetivo por articulación interpolados con `damp`. Saluda al llegar a contacto, al pasar el cursor o al hacer clic; la cabeza y los ojos siguen al cursor.

## Artículos de Medium

`npm run sync:medium` descarga `https://medium.com/feed/@OscarBravelop` y guarda `src/content/medium.json`. Se ejecuta automáticamente en `npm run build`; si Medium no responde, se conserva la copia actual y el build continúa.

El workflow de GitHub Pages se lanza también **cada día a las 06:17 UTC**, así que un artículo nuevo aparece en la web como mucho en 24 horas sin tocar el repositorio. Para verlo al momento: *Actions → Deploy CV site → Run workflow*. GitHub desactiva los workflows programados tras 60 días sin actividad en el repositorio; si ocurre, se reactivan desde la pestaña Actions. El RSS de Medium no permite CORS, por eso no se consulta desde el navegador.

## Cómo editar el contenido

Todo el texto está en `src/content/portfolio.ts`, basado en `cv-oscar-bravo-ats.md`. Si cambias el CV, actualiza también `public/cv.html`. Los tests de `scripts/content.test.mjs` comprueban empresas, clientes, contacto y que el teléfono no se publica.

## Decisiones técnicas

- **React 18 + TypeScript estricto + Vite**, estático y apto para GitHub Pages.
- **React Three Fiber 8 / Drei 9 / Three.js**, cargados de forma diferida para no bloquear el primer render.
- **Sin GSAP**: las apariciones usan IntersectionObserver + transiciones CSS; el 3D usa el bucle de R3F.
- **Tipografía del sistema** (SF Pro en dispositivos Apple) con Inter como alternativa.

## Revisión editorial antes de hacer público

Comprueba el texto, el email, los periodos laborales y los enlaces sociales. El CV muestra fechas solapadas entre Freelandstudio y Adeuve; se han respetado tal cual. El teléfono del CV ATS **no** se publica en la web ni en `cv.html`.

## Créditos y licencia

Concepto y código preparados para Oscar Bravo Sarro. Fotografía proporcionada por el propietario del portfolio. No se incluye una licencia de reutilización de su fotografía ni de sus datos personales.

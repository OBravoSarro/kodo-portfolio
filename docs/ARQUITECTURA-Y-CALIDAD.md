# KŌDŌ — Arquitectura, dirección artística y criterios de calidad

## Objetivo y alcance

Portfolio narrativo **personal** de Oscar Bravo Sarro, no la web corporativa ni una aplicación de negocio. Se publica como un sitio estático en GitHub Pages. Su contenido público procede de los documentos aportados (CV y briefing creativo) y de la fotografía del titular.

## Dirección visual

- Identidad: KŌDŌ — The Digital Journey.
- Paleta: ivory `#F4F1EA`, tinta `#171717`, rojo japonés `#B52B32`, verde `#667B61`, arena `#D9D4CA`.
- Ritmo: predominio de superficies claras, sección editorial oscura para el retrato y cierre nocturno.
- Tipografía: Manrope y DM Sans para interfaces y textos, serif tradicional en los titulares de contraste, Noto Serif JP para elementos japoneses.
- Geometría procedural voxel con torii, islas, árboles, nubes y pequeños objetos animados.
- Los tres trabajos seleccionados utilizan composiciones tridimensionales **conceptuales**; no se han presentado como capturas de productos ni como diseño visual original del cliente.

## División funcional

| Módulo | Responsabilidad |
|---|---|
| `src/content/portfolio.ts` | Fuente editorial, experiencia, contacto, estudios, competencias y trabajos |
| `src/sections/` | Presentación semántica de cada capítulo |
| `src/components/three/` | Escenas React Three Fiber, geometría y animación de cámara |
| `src/components/graphics/` | Marca, identidad gráfica, fallback y componentes de lectura |
| `src/hooks/` | Preferencias, visibilidad y movimiento asociado al scroll |
| `src/styles/global.css` | Sistema visual, responsive y estados accesibles |
| `.github/workflows/deploy.yml` | Compilación y publicación continua en Pages |

Los datos no están acoplados a la implementación 3D. No existe una base de datos ni un servidor: las modificaciones de contenido requieren editar el archivo de datos y publicar una nueva versión.

## Rendimiento

1. Las escenas se cargan con `React.lazy` y `Suspense`.
2. Las escenas de proyectos se montan solo cerca de su viewport mediante `IntersectionObserver`.
3. El Hero y el camino usan `frameloop="demand"` cuando dejan de estar visibles.
4. No se descargan modelos GLTF, texturas externas ni paquetes de iconos.
5. La imagen personal está convertida a WebP en dos resoluciones (archivo original excluido del bundle).
6. El movimiento reducido, el ahorro de datos y la ausencia de WebGL activan una ilustración alternativa.
7. GSAP y CSS gestionan animaciones ligeras sin reemplazar el scroll nativo.

## Accesibilidad

- Contenido y experiencia profesionales disponibles como texto semántico sin depender del canvas.
- Navegación por anclas, enlace para saltar al contenido principal y foco visible.
- Menú móvil operable con teclado, Escape para cerrarlo y estados ARIA.
- `prefers-reduced-motion` elimina animaciones no esenciales y evita WebGL.
- Textos significativos en HTML fuera de las escenas decorativas (`aria-hidden`).

## Seguridad y privacidad

- No hay recogida de datos ni infraestructura con secretos.
- Enlaces externos con `rel="noopener noreferrer"`.
- Sin analytics, cookies ni almacenamiento local.
- Los assets de fotografía y contacto pertenecen al titular: revisar antes de convertir el repositorio en público.
- Las dependencias deben mantenerse actualizadas, especialmente los componentes gráficos; recomendable ejecutar auditorías en una máquina con acceso a npm.

## Comprobaciones reales y pendientes

**Comprobado durante la preparación del proyecto:**

- Integridad básica del contenido con `node --test`.
- Análisis sintáctico de TypeScript/TSX mediante el compilador TypeScript.
- Resolución de todas las rutas de imports relativas.
- Parseo sintáctico de la hoja CSS.
- Existencia y optimización de los assets.

**Pendiente en un entorno con acceso a npm y navegador local sin restricciones:**

- `npm install`, `npm run build` y `npm run preview`.
- Revisión visual de WebGL y errores de consola.
- Pruebas de interacción en desktop/tablet/móvil, incluido Safari iOS.
- Lighthouse para rendimiento, accesibilidad, buenas prácticas y SEO.
- Primer despliegue de prueba en GitHub Pages para confirmar permisos de Pages y caché de recursos.

La integración continua ejecuta las comprobaciones de contenido y compilación durante el primer push.

## Opciones futuras, sin sobreingeniería inicial

- Sustituir representaciones conceptuales por capturas o estudios de caso verificables si se autorizan.
- Añadir repositorios y perfil GitHub únicamente cuando se facilite la URL oficial.
- Si el contenido se hace frecuente, integrar un CMS en una fase posterior; no es necesario para el alcance actual.
- Añadir tests E2E con Playwright, informes Lighthouse y monitorización de errores si el proyecto pasa a mantenimiento continuo.

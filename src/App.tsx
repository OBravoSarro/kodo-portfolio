import { lazy, Suspense, useEffect } from 'react';
import { avatarStore } from './components/avatar/avatarStore';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useReveal } from './hooks/useReveal';
import { useWebGL } from './hooks/useWebGL';
import { Background } from './sections/Background';
import { Capabilities } from './sections/Capabilities';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Letter } from './sections/Letter';
import { Projects } from './sections/Projects';
import { Writing } from './sections/Writing';

// Three.js is ~600 kB: keep it out of the critical path.
const AvatarStage = lazy(() => import('./components/avatar/AvatarStage'));

function App() {
  const webgl = useWebGL();
  const reducedMotion = useReducedMotion();
  useReveal();

  useEffect(() => {
    if (webgl === false) avatarStore.setStatus('unsupported');
  }, [webgl]);

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido">
        <Hero />
        <Letter />
        <Experience />
        <Projects />
        <Capabilities />
        <Writing />
        <Background />
        <Contact />
      </main>
      <Footer />
      {webgl && (
        <Suspense fallback={null}>
          <AvatarStage reducedMotion={reducedMotion} />
        </Suspense>
      )}
    </>
  );
}

export default App;

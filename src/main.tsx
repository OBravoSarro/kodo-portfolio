import React from 'react';
import ReactDOM from 'react-dom/client';
// `@template` = src/templates/<template de profiles/<PROFILE>/profile.json> (vite.config.ts).
// Solo se empaqueta la plantilla del perfil activo, con sus estilos.
import Site from '@template/Site';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Site />
  </React.StrictMode>,
);

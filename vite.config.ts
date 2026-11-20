import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * One codebase, one site per person. PROFILE selects `profiles/<id>/`:
 * content (aliased as `@profile`), public assets and <head> metadata.
 * profile.json → `template` selects the design in `src/templates/<template>/`
 * (aliased as `@template`): only that template is bundled.
 */
const PROFILE = process.env.PROFILE || 'oscar';
const root = path.dirname(fileURLToPath(import.meta.url));
const profileDir = path.join(root, 'profiles', PROFILE);
if (!existsSync(path.join(profileDir, 'profile.json'))) {
  throw new Error(`PROFILE="${PROFILE}" no existe: falta profiles/${PROFILE}/profile.json`);
}
const meta = JSON.parse(readFileSync(path.join(profileDir, 'profile.json'), 'utf8')) as Record<string, unknown>;
const templateDir = path.join(root, 'src', 'templates', String(meta.template));
if (!existsSync(path.join(templateDir, 'Site.tsx'))) {
  throw new Error(`profiles/${PROFILE}/profile.json: template "${String(meta.template)}" no existe en src/templates/`);
}

const escape = (value: unknown) =>
  String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Replaces %PROFILE_<KEY>% placeholders in index.html with profile.json values. */
function profileHtml(): Plugin {
  return {
    name: 'profile-html',
    // 'pre': run before Vite's own %ENV% replacement, which would warn about these keys.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(/%PROFILE_([A-Z_]+)%/g, (_, key: string) => {
          const camel = key.toLowerCase().replace(/_([a-z])/g, (__, c: string) => c.toUpperCase());
          if (!(camel in meta)) throw new Error(`profiles/${PROFILE}/profile.json no define "${camel}"`);
          return escape(meta[camel]);
        }),
    },
  };
}

export default defineConfig({
  plugins: [react(), profileHtml()],
  base: process.env.GITHUB_PAGES_BASE || '/',
  publicDir: path.join(profileDir, 'public'),
  resolve: {
    alias: { '@profile': profileDir, '@template': templateDir },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
  },
});

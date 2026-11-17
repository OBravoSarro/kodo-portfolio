import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const content = readFileSync(new URL('../src/content/portfolio.ts', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
const medium = JSON.parse(readFileSync(new URL('../src/content/medium.json', import.meta.url), 'utf8'));
const printableCv = readFileSync(new URL('../public/cv.html', import.meta.url), 'utf8');

test('portfolio contains every employer from the supplied CV', () => {
  for (const employer of ['INNOCV Solutions', 'inserious DIGITAL', 'Adeuve', 'Freelandstudio', 'hayCANAL.com', 'B&G innovación']) {
    assert.ok(content.includes(employer), `Missing ${employer}`);
  }
});

test('contact details match the supplied CV', () => {
  assert.ok(content.includes('desarrollador.oscar.bravo@gmail.com'));
  assert.ok(content.includes('oscar-bravo-sarro-0a900665'));
});

test('selected work stays traceable to documented experiences', () => {
  for (const phrase of ['arquetipos frontend reutilizables', 'plataforma de gamificación', 'plataforma de gestión']) {
    assert.ok(content.toLowerCase().includes(phrase));
  }
});

test('GitHub Pages workflow adjusts Vite base for project pages', () => {
  assert.ok(workflow.includes('GITHUB_PAGES_BASE=/$REPOSITORY_NAME/'));
  assert.ok(workflow.includes('GITHUB_PAGES_BASE=/'));
  assert.ok(viteConfig.includes('process.env.GITHUB_PAGES_BASE'));
});

test('current role matches the latest CV', () => {
  assert.ok(content.includes('Frontend Architect'));
  assert.ok(content.includes('Chapter Lead'));
  for (const client of ['Evo Bank', 'Mapfre', 'Repsol', 'Unicaja', 'Santa Lucía']) {
    assert.ok(content.includes(client), `Missing client ${client}`);
  }
});

test('printable CV is published and does not expose the phone number', () => {
  assert.ok(printableCv.includes('desarrollador.oscar.bravo@gmail.com'));
  assert.ok(!/636\s?67\s?05\s?76/.test(printableCv));
});

test('Medium snapshot is valid and newest first', () => {
  assert.equal(medium.profile, 'https://medium.com/@OscarBravelop');
  assert.ok(medium.stories.length > 0);
  for (const story of medium.stories) {
    assert.ok(story.title && story.url.startsWith('https://medium.com/@OscarBravelop/'));
    assert.match(story.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  const dates = medium.stories.map((story) => story.date);
  assert.deepEqual([...dates].sort().reverse(), dates);
});

test('Medium feed parser extracts title, url, date and excerpt', async () => {
  const { parseFeed } = await import('./sync-medium.mjs');
  const xml = '<item><title><![CDATA[Hola]]></title><link>https://medium.com/@OscarBravelop/hola-1?source=rss</link><pubDate>Tue, 17 Nov 2026 08:31:01 GMT</pubDate><content:encoded><![CDATA[<p>Un párrafo suficientemente largo como para ser el extracto del artículo.</p>]]></content:encoded></item>';
  const [story] = parseFeed(xml);
  assert.equal(story.title, 'Hola');
  assert.equal(story.url, 'https://medium.com/@OscarBravelop/hola-1');
  assert.equal(story.date, '2026-11-17');
  assert.ok(story.excerpt.startsWith('Un párrafo'));
});

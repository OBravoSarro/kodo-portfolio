/**
 * Checks shared by every profile. Person-specific facts live in
 * profiles/<id>/content.test.mjs.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const workflow = read('.github/workflows/deploy.yml');
const viteConfig = read('vite.config.ts');
const profiles = readdirSync(new URL('profiles/', root)).filter((id) => existsSync(new URL(`profiles/${id}/profile.json`, root)));
const REQUIRED_META = ['id', 'draft', 'template', 'lang', 'locale', 'title', 'description', 'author', 'ogTitle', 'ogDescription', 'ogImage', 'medium', 'themeColor', 'fontsHref'];

test('there is at least one profile and oscar is one of them', () => {
  assert.ok(profiles.includes('oscar'));
});

test('GitHub Pages workflow adjusts Vite base for project pages', () => {
  assert.ok(workflow.includes('GITHUB_PAGES_BASE=/$REPOSITORY_NAME/'));
  assert.ok(workflow.includes('GITHUB_PAGES_BASE=/'));
  assert.ok(viteConfig.includes('process.env.GITHUB_PAGES_BASE'));
  assert.ok(viteConfig.includes('process.env.PROFILE'));
});

test('Medium feed parser extracts title, url, date and excerpt', async () => {
  const { parseFeed } = await import('./sync-medium.mjs');
  const xml = '<item><title><![CDATA[Hola]]></title><link>https://medium.com/@OscarBravelop/hola-1?source=rss</link><pubDate>Tue, 17 Nov 2026 08:31:01 GMT</pubDate><content:encoded><![CDATA[<figure><img alt="" src="https://cdn-images-1.medium.com/max/1024/1*abc.jpeg" /></figure><p>Un párrafo suficientemente largo como para ser el extracto del artículo.</p>]]></content:encoded></item>';
  const [story] = parseFeed(xml);
  assert.equal(story.title, 'Hola');
  assert.equal(story.url, 'https://medium.com/@OscarBravelop/hola-1');
  assert.equal(story.date, '2026-11-17');
  assert.ok(story.excerpt.startsWith('Un párrafo'));
  assert.equal(story.image, 'https://cdn-images-1.medium.com/max/1024/1*abc.jpeg');
});

for (const id of profiles) {
  const dir = `profiles/${id}/`;
  const meta = JSON.parse(read(`${dir}profile.json`));
  const content = read(`${dir}content.ts`);

  test(`[${id}] profile.json is complete and matches its folder`, () => {
    for (const key of REQUIRED_META) assert.ok(key in meta, `Missing "${key}"`);
    assert.equal(meta.id, id);
    assert.ok(existsSync(new URL(`src/templates/${meta.template}/Site.tsx`, root)), `Template "${meta.template}" does not exist`);
    assert.ok(content.includes('satisfies Profile'), 'content.ts must end with `satisfies Profile`');
  });

  test(`[${id}] has its own public assets: printable CV, favicon and robots`, () => {
    for (const file of ['cv.html', 'icons/favicon.svg', 'robots.txt']) {
      assert.ok(existsSync(new URL(`${dir}public/${file}`, root)), `Missing public/${file}`);
    }
  });

  test(`[${id}] never publishes forbidden data (phone numbers, etc.)`, () => {
    const cv = read(`${dir}public/cv.html`);
    for (const pattern of meta.forbiddenPatterns ?? []) {
      const regex = new RegExp(pattern);
      assert.ok(!regex.test(cv), `cv.html matches ${pattern}`);
      assert.ok(!regex.test(content), `content.ts matches ${pattern}`);
    }
  });

  test(`[${id}] Medium snapshot is valid and newest first`, () => {
    const medium = JSON.parse(read(`${dir}medium.json`));
    assert.ok(Array.isArray(medium.stories));
    if (!meta.medium) {
      assert.equal(medium.stories.length, 0, 'No Medium handle but stories present');
      return;
    }
    assert.equal(medium.profile, `https://medium.com/@${meta.medium}`);
    for (const story of medium.stories) {
      assert.ok(story.title && story.url.startsWith(`https://medium.com/@${meta.medium}/`));
      assert.match(story.date, /^\d{4}-\d{2}-\d{2}$/);
    }
    const dates = medium.stories.map((story) => story.date);
    assert.deepEqual([...dates].sort().reverse(), dates);
  });

  // Drafts can hold placeholders; a published profile must not.
  test(`[${id}] published profiles contain no pending placeholders`, { skip: meta.draft ? 'draft' : false }, () => {
    for (const file of ['content.ts', 'public/cv.html']) {
      assert.ok(!/PENDIENTE/.test(read(`${dir}${file}`)), `${file} still has PENDIENTE`);
    }
  });
}

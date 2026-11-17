#!/usr/bin/env node
/**
 * Pulls the latest stories from Medium's public RSS feed and writes them to
 * src/content/medium.json. Medium's feed has no CORS headers, so the site
 * cannot fetch it at runtime: we snapshot it at build time instead.
 *
 * Never fails the build: if the network or the feed is unavailable, the
 * existing snapshot is kept.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FEED = 'https://medium.com/feed/@OscarBravelop';
const OUTPUT = new URL('../src/content/medium.json', import.meta.url);
const WORDS_PER_MINUTE = 220;

const decode = (text) =>
  text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const stripTags = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function excerptFrom(html) {
  const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => stripTags(match[1]));
  const first = paragraphs.find((text) => text.length > 40) ?? '';
  if (first.length <= 170) return first;
  const cut = first.slice(0, 170);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

export function parseFeed(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const pick = (tag) => item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1] ?? '';
    const html = pick('content:encoded');
    const words = stripTags(html).split(' ').filter(Boolean).length;
    return {
      title: decode(pick('title')),
      url: pick('link').split('?')[0],
      date: new Date(pick('pubDate')).toISOString().slice(0, 10),
      excerpt: excerptFrom(html),
      minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      tags: [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map(([, tag]) => tag),
    };
  });
  return items.filter((item) => item.title && item.url);
}

async function main() {
  try {
    const response = await fetch(FEED, { headers: { 'user-agent': 'oscar-bravo-cv-site' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const stories = parseFeed(await response.text());
    if (stories.length === 0) throw new Error('Feed sin artículos');
    const next = `${JSON.stringify({ profile: 'https://medium.com/@OscarBravelop', stories }, null, 2)}\n`;
    let previous = '';
    try { previous = readFileSync(OUTPUT, 'utf8'); } catch { /* first run */ }
    if (previous !== next) writeFileSync(OUTPUT, next);
    console.log(`medium: ${stories.length} artículos sincronizados`);
  } catch (error) {
    console.warn(`medium: se mantiene la copia actual (${error.message})`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

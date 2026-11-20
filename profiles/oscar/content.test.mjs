/** Facts specific to Óscar's CV (source: people/oscar/cv/cv-oscar-bravo-ats.md). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const content = readFileSync(new URL('./content.ts', import.meta.url), 'utf8');
const printableCv = readFileSync(new URL('./public/cv.html', import.meta.url), 'utf8');

test('[oscar] portfolio contains every employer from the supplied CV', () => {
  for (const employer of ['INNOCV Solutions', 'inserious DIGITAL', 'Adeuve', 'Freelandstudio', 'hayCANAL.com', 'B&G innovación']) {
    assert.ok(content.includes(employer), `Missing ${employer}`);
  }
});

test('[oscar] contact details match the supplied CV', () => {
  assert.ok(content.includes('desarrollador.oscar.bravo@gmail.com'));
  assert.ok(content.includes('oscar-bravo-sarro-0a900665'));
  assert.ok(printableCv.includes('desarrollador.oscar.bravo@gmail.com'));
});

test('[oscar] selected work stays traceable to documented experiences', () => {
  for (const phrase of ['arquetipos frontend reutilizables', 'plataforma de gamificación', 'plataforma de gestión']) {
    assert.ok(content.toLowerCase().includes(phrase));
  }
});

test('[oscar] current role matches the latest CV', () => {
  assert.ok(content.includes('Frontend Architect'));
  assert.ok(content.includes('Chapter Lead'));
  for (const client of ['Evo Bank', 'Mapfre', 'Repsol', 'Unicaja', 'Santa Lucía']) {
    assert.ok(content.includes(client), `Missing client ${client}`);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ROOT, loadCatalog, validateCatalog, inside, escapeHTML } from '../scripts/catalog.mjs';
import { homePage, detailPage } from '../src/templates.mjs';
const data = JSON.parse(await readFile(resolve(ROOT, 'catalog.json'), 'utf8'));

test('all bilingual records have intact source artwork, prompts and revision inputs', async () => {
  const books = await loadCatalog();
  assert.equal(books.length, 20);
  assert.equal(books.filter((b) => b.group === 'chinese').length, 10);
  assert.equal(books.filter((b) => b.group === 'world').length, 10);
  assert.equal(books.filter((b) => b.volume === 2).length, 10);
});
test('invalid, duplicate or incomplete metadata fails before building', () => {
  const duplicate = structuredClone(data);
  duplicate.books.push(duplicate.books[0]);
  assert.throws(() => validateCatalog(duplicate), /duplicate/);
  const missing = structuredClone(data);
  delete missing.books[0].title.en;
  assert.throws(() => validateCatalog(missing), /Missing title.en/);
  const typo = structuredClone(data);
  typo.books[0].titleLines.zh = ['平凡世界'];
  assert.throws(() => validateCatalog(typo), /alter the title/);
  const path = structuredClone(data);
  path.books[0].artwork = '../private.png';
  assert.throws(() => validateCatalog(path), /Unexpected source path/);
  const ink = structuredClone(data);
  ink.books[0].typography.zh.ink = 'url(https://example.com)';
  assert.throws(() => validateCatalog(ink), /typography ink/);
  const imprint = structuredClone(data);
  imprint.books[0].coverImprint = 'false';
  assert.throws(() => validateCatalog(imprint), /cover imprint/);
  const reversed = structuredClone(data);
  reversed.books.find((b) => b.id === 'white-horse').typography.zh.centers = [414, 570];
  assert.throws(() => validateCatalog(reversed), /right to left/);
  const incomplete = structuredClone(data);
  incomplete.books[0].typography.zh.sizes = [];
  assert.throws(() => validateCatalog(incomplete), /typography sizes/);
});
test('filesystem helpers reject traversal and HTML helpers escape markup', () => {
  assert.throws(() => inside(ROOT, '../../secret'), /leaves project/);
  assert.throws(() => inside(ROOT, '/tmp/secret'), /relative path/);
  assert.equal(inside(ROOT, 'artwork/ordinary-world.png'), resolve(ROOT, 'artwork/ordinary-world.png'));
  assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('both languages have actual permanent pages, translated controls and safe content', () => {
  const b = structuredClone(data.books[0]);
  b.concept.zh = '<script>alert(1)</script>';
  const zh = detailPage(b, [b], 'zh', 'prompt <img onerror="x">');
  assert.ok(zh.includes('&lt;script&gt;'));
  assert.ok(!zh.includes('<script>alert(1)'));
  assert.ok(zh.includes('../../en/books/ordinary-world/'));
  const en = homePage(data.books, 'en');
  assert.ok(en.includes('lang="en"'));
  assert.ok(en.includes('../en/books/ordinary-world/'));
  assert.ok(en.includes('Read the skill'));
  assert.ok(en.includes('id="collection-count"'));
});

test('new revision recipes retain their actual reason and source without changing legacy records', () => {
  const b = data.books.find((b) => b.id === 'fortress-besieged');
  const zh = detailPage(
    b,
    data.books,
    'zh',
    'original generation',
    'remove clutter',
    'standalone simplified courtyard recipe',
  );
  assert.ok(zh.includes('VOL. 02'));
  assert.ok(zh.includes('树、罐子、长凳和落叶'));
  assert.ok(zh.includes('process/vol-02/fortress-besieged-v1.png'));
  assert.ok(zh.includes('standalone simplified courtyard recipe'));
  assert.ok(!zh.includes('首稿占用了作者署名区'));
  assert.doesNotThrow(() => validateCatalog(data));
  const invalid = structuredClone(data);
  invalid.books.find((book) => book.id === 'fortress-besieged').generation.revision.recipe = '../outside.txt';
  assert.throws(() => validateCatalog(invalid), /leaves project/);
});

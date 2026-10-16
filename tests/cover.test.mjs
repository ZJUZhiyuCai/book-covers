import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { loadCatalog, ROOT, sha256 } from '../scripts/catalog.mjs';
import { coverLayout, textBounds, textPaths, renderCover, wrapText } from '../scripts/cover.mjs';
import { parseExportArgs } from '../scripts/export.mjs';
const books = await loadCatalog({ verifyAssets: false });

test('all twenty layouts fit the reserved title and author regions', () => {
  for (const b of books)
    for (const lang of ['zh', 'en']) {
      const layout = coverLayout(b, lang);
      for (const line of [...layout.title, ...layout.subtitle]) {
        const box = textBounds(line.text, line.x, line.y, line.size, line);
        assert.ok(box.left >= 70 && box.right <= 954, `${b.id}/${lang} exceeds a side margin`);
        assert.ok(box.top >= 130 && box.bottom < 615, `${b.id}/${lang} enters the picture`);
        assert.doesNotThrow(() => textPaths(line.text, line.x, line.y, line.size, line));
      }
      const a = layout.author,
        box = textBounds(a.text, a.x, a.y, a.size, a);
      assert.ok(box.top > 1400 && box.bottom < 1500);
      assert.ok(box.left >= 70 && box.right <= 954);
      assert.doesNotThrow(() => textPaths(a.text, a.x, a.y, a.size, a));
      const boxes = [...layout.title, ...layout.subtitle].map((e) => textBounds(e.text, e.x, e.y, e.size, e));
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i],
            b = boxes[j];
          assert.ok(
            a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top,
            'Typography overlaps',
          );
        }
    }
});

test('vertical reading order and bilingual title content survive individual glyph placement', () => {
  for (const b of books)
    for (const lang of ['zh', 'en']) {
      const layout = coverLayout(b, lang);
      assert.equal(
        layout.title
          .map((l) => l.text)
          .join('')
          .replace(/\s/g, ''),
        b.title[lang].replace(/\s/g, ''),
      );
      assert.equal(layout.author.text, b.author[lang]);
      if (b.typography?.[lang]?.mode === 'vertical') {
        const cells = layout.title;
        for (let i = 1; i < cells.length; i++) {
          const prev = cells[i - 1],
            next = cells[i];
          assert.ok(next.x < prev.x - 40 || next.y > prev.y + 40, 'Vertical reading order is reversed');
        }
      }
    }
});
test('Chinese titles keep one character scale across lines and when a long line needs fitting', () => {
  for (const book of books) {
    const layout = coverLayout(book, 'zh');
    assert.equal(new Set(layout.title.map((line) => line.size)).size, 1, book.id);
    assert.equal(new Set(layout.title.map((line) => line.weight)).size, 1, book.id);
  }
  const book = structuredClone(books.find((b) => b.id === 'ordinary-world'));
  book.titleLines.zh = ['平凡的', '世界'];
  book.typography.zh = {
    mode: 'left',
    size: 170,
    baselines: [260, 430],
    offsets: [450, 0],
    tracking: 10,
  };
  const title = coverLayout(book, 'zh').title;
  assert.ok(title[0].size < 170, 'the constrained first line must fit its available width');
  assert.equal(title[1].size, title[0].size, 'a short line must keep the same fitted size');
  book.typography.zh.sizes = [112, 148];
  assert.throws(() => coverLayout(book, 'zh'), /equal size/);
});
test('PNG export has correct dimensions, adds typography, preserves the illustration and source file', async () => {
  const b = books[0],
    path = resolve(ROOT, b.artwork),
    source = await readFile(path);
  const result = await renderCover(b, 'zh');
  const meta = await sharp(result).metadata();
  assert.equal(meta.width, 1024);
  assert.equal(meta.height, 1536);
  assert.equal(meta.format, 'png');
  const artArea = { left: 0, top: 640, width: 1024, height: 700 };
  const sourceArt = await sharp(source).removeAlpha().extract(artArea).raw().toBuffer();
  const outputArt = await sharp(result).removeAlpha().extract(artArea).raw().toBuffer();
  assert.deepEqual(outputArt, sourceArt);
  const titleArea = { left: 70, top: 120, width: 800, height: 300 };
  assert.notDeepEqual(
    await sharp(source).extract(titleArea).raw().toBuffer(),
    await sharp(result).extract(titleArea).raw().toBuffer(),
  );
  assert.equal(sha256(await readFile(path)), b.sha256);
  const thumb = await sharp(await renderCover(b, 'en', { width: 180, format: 'webp' })).metadata();
  assert.equal(thumb.width, 180);
  assert.equal(thumb.height, 270);
});
test('export rejects bad inputs and missing glyphs instead of making broken files', async () => {
  await assert.rejects(() => renderCover(books[0], 'xx'), /Unknown language/);
  await assert.rejects(() => renderCover(books[0], 'zh', { width: 7 }), /width/);
  assert.throws(() => textPaths('\u{10ffff}', 0, 100, 30), /no glyph/);
  assert.throws(() => parseExportArgs(['--lang', 'fr']), /Language/);
  assert.throws(() => parseExportArgs(['--book']), /incomplete/);
  assert.throws(() => parseExportArgs(['--out', '../../private']), /leaves project/);
  assert.deepEqual(parseExportArgs(['--book', 'ordinary-world', '--lang', 'en', '--width', '2048']), {
    lang: 'en',
    width: 2048,
    out: 'output',
    book: 'ordinary-world',
  });
  assert.deepEqual(wrapText('one two three', 90, 20), ['one two', 'three']);
});

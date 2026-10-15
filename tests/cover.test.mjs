import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { loadCatalog, ROOT, sha256 } from '../scripts/catalog.mjs';
import { coverLayout, textWidth, textPaths, renderCover, wrapText } from '../scripts/cover.mjs';
import { parseExportArgs } from '../scripts/export.mjs';
const books = await loadCatalog({ verifyAssets: false });

test('all twenty layouts fit the reserved title and author regions', () => {
  for (const b of books)
    for (const lang of ['zh', 'en']) {
      const layout = coverLayout(b, lang);
      for (const line of [...layout.title, ...layout.subtitle]) {
        assert.ok(
          line.x + textWidth(line.text, line.size, line.weight) <= 950,
          `${b.id}/${lang} exceeds right margin`,
        );
        assert.ok(line.y < 615, `${b.id}/${lang} enters the picture`);
        assert.doesNotThrow(() => textPaths(line.text, line.x, line.y, line.size, { weight: line.weight }));
      }
      assert.ok(layout.author.y > 1400 && layout.author.y < 1500);
      assert.ok(layout.author.x + textWidth(layout.author.text, layout.author.size) <= 950);
    }
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

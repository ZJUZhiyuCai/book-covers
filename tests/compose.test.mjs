import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { composeFromSpec, validateCoverSpec } from '../scripts/compose.mjs';
import { coverLayout, composeCover } from '../scripts/cover.mjs';
import { ROOT, sha256 } from '../scripts/catalog.mjs';
const specPath = resolve(ROOT, 'examples/complete-cover.json');
const spec = JSON.parse(await readFile(specPath, 'utf8'));

test('complete-cover specs require exact titles, authors and intact meaningful breaks', () => {
  assert.equal(validateCoverSpec(spec), spec);
  for (const lang of ['zh', 'en']) {
    assert.throws(() => validateCoverSpec({ ...spec, author: { ...spec.author, [lang]: '' } }), /author/);
    assert.throws(
      () => validateCoverSpec({ ...spec, titleLines: { ...spec.titleLines, [lang]: ['Different'] } }),
      /alter/,
    );
  }
  assert.throws(() => validateCoverSpec({ ...spec, id: '../escape' }), /safe book id/);
  assert.throws(
    () => coverLayout({ ...spec, typography: { en: { mode: 'left', baselines: [260, 260] } } }, 'en'),
    /overlaps/,
  );
});

test('external composition writes complete bilingual images, preserves art, and refuses accidental replacement', async () => {
  const out = await mkdtemp(join(tmpdir(), 'quiet-covers-compose-'));
  try {
    const original = await readFile(resolve(ROOT, 'artwork/ordinary-world.png'));
    const receipt = await composeFromSpec(specPath, out);
    assert.equal(receipt.files.length, 4);
    assert.equal(receipt.artworkSha256, sha256(original));
    for (const lang of ['zh', 'en']) {
      const output = await readFile(join(out, `ordinary-world-${lang}.png`));
      for (const region of [
        { left: 70, top: 130, width: 850, height: 470 },
        { left: 70, top: 1400, width: 850, height: 100 },
      ])
        assert.notDeepEqual(
          await sharp(output).extract(region).removeAlpha().raw().toBuffer(),
          await sharp(original).extract(region).removeAlpha().raw().toBuffer(),
          'title and author must be in the exported pixels',
        );
      const meta = await sharp(join(out, `ordinary-world-${lang}.webp`)).metadata();
      assert.equal(meta.width, 640);
      assert.equal(meta.height, 960);
    }
    await assert.rejects(() => composeFromSpec(specPath, out), /Output exists/);
    const wrongShape = await sharp(original).resize(400, 400).png().toBuffer();
    await assert.rejects(() => composeCover(spec, 'zh', wrongShape), /1024×1536/);
    assert.equal(sha256(await readFile(resolve(ROOT, 'artwork/ordinary-world.png'))), sha256(original));
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

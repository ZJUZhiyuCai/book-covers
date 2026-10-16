import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm, readdir, link, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { composeFromSpec, validateCoverSpec } from '../scripts/compose.mjs';
import { coverLayout, composeCover } from '../scripts/cover.mjs';
import { ROOT, sha256 } from '../scripts/catalog.mjs';
import { prepareFonts, requiredFaces } from '../skills/book-covers/runtime/prepare-fonts.mjs';
const specPath = resolve(ROOT, 'examples/complete-cover.json');
const spec = JSON.parse(await readFile(specPath, 'utf8'));

async function withTemp(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'book-covers-compose-'));
  try {
    await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
async function writeSpec(dir, changes = {}) {
  const book = {
    ...spec,
    artwork: resolve(ROOT, 'artwork/ordinary-world.png'),
    prompt: resolve(ROOT, 'prompts/ordinary-world.txt'),
    ...changes,
  };
  const path = join(dir, 'book.json');
  await writeFile(path, JSON.stringify(book));
  return path;
}
test('specs require exact titles, authors, a prompt and valid type plans', () => {
  assert.equal(validateCoverSpec(spec), spec);
  for (const lang of ['zh', 'en']) {
    assert.throws(() => validateCoverSpec({ ...spec, author: { ...spec.author, [lang]: '' } }), /author/);
    assert.throws(
      () => validateCoverSpec({ ...spec, titleLines: { ...spec.titleLines, [lang]: ['Different'] } }),
      /alter/,
    );
  }
  assert.throws(() => validateCoverSpec({ ...spec, prompt: '' }), /prompt/);
  assert.throws(() => validateCoverSpec({ ...spec, id: '../escape' }), /safe book id/);
  assert.throws(() => validateCoverSpec({ ...spec, languages: ['fr'] }), /languages/);
  assert.throws(
    () => coverLayout({ ...spec, typography: { en: { mode: 'left', baselines: [260, 270] } } }, 'en'),
    /overlaps/,
  );
});
test('default bilingual export has three output types, includes letters in pixels and preserves exact artwork/prompt', async () =>
  withTemp(async (dir) => {
    const out = join(dir, 'covers');
    const original = await readFile(resolve(ROOT, 'artwork/ordinary-world.png'));
    const receipt = await composeFromSpec(specPath, out);
    assert.deepEqual((await readdir(out)).sort(), [
      'ordinary-world-artwork.png',
      'ordinary-world-en.png',
      'ordinary-world-prompt.txt',
      'ordinary-world-zh.png',
    ]);
    assert.equal(receipt.files.length, 4);
    assert.deepEqual(await readFile(join(out, 'ordinary-world-artwork.png')), original);
    assert.deepEqual(
      await readFile(join(out, 'ordinary-world-prompt.txt')),
      await readFile(resolve(ROOT, 'prompts/ordinary-world.txt')),
    );
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
          'title and author must be in exported pixels',
        );
    }
    await assert.rejects(() => composeFromSpec(specPath, out), /Output exists/);
    await assert.rejects(
      async () => composeCover(spec, 'zh', await sharp(original).resize(400, 400).png().toBuffer()),
      /1024×1536/,
    );
    assert.equal(sha256(await readFile(resolve(ROOT, 'artwork/ordinary-world.png'))), sha256(original));
  }));
test('a single-language brief produces exactly three files without inventing a translated subtitle or imprint', async () =>
  withTemp(async (dir) => {
    const single = {
      title: { zh: '平凡的世界' },
      author: { zh: '路遥' },
      titleLines: { zh: ['平凡的世界'] },
      typography: { zh: spec.typography.zh },
      number: undefined,
    };
    const path = await writeSpec(dir, single);
    const receipt = await composeFromSpec(path, join(dir, 'out'));
    assert.equal(receipt.files.length, 3);
    assert.deepEqual(receipt.languages, ['zh']);
    assert.deepEqual(coverLayout({ ...spec, ...single }, 'zh').subtitle, []);
    assert.deepEqual(requiredFaces({ ...spec, ...single }, ['zh']), ['zhuque']);
  }));
test('failed later-language rendering leaves no deliverables; optional WebP and receipt are opt-in', async () =>
  withTemp(async (dir) => {
    const path = await writeSpec(dir, { author: { ...spec.author, en: '\u{10ffff}' } });
    await assert.rejects(() => composeFromSpec(path, join(dir, 'broken')), /no glyph/);
    await assert.rejects(() => readdir(join(dir, 'broken')), { code: 'ENOENT' });
    const receipt = await composeFromSpec(specPath, join(dir, 'good'), {
      webp: true,
      receipt: join(dir, 'audit.json'),
    });
    assert.equal(receipt.files.length, 6);
    assert.equal(JSON.parse(await readFile(join(dir, 'audit.json'), 'utf8')).renderer, 'book-covers/1.4.0');
    assert.equal((await sharp(join(dir, 'good/ordinary-world-zh.webp')).metadata()).width, 640);
  }));
test('--force cannot destroy source art, prompt, spec, hardlinks or symlink targets', async () =>
  withTemp(async (dir) => {
    const original = await readFile(resolve(ROOT, 'artwork/ordinary-world.png'));
    const art = join(dir, 'ordinary-world-artwork.png');
    await writeFile(art, original);
    const path = await writeSpec(dir, { artwork: art });
    await assert.rejects(() => composeFromSpec(path, dir, { force: true }), /overwrite a source/);
    assert.deepEqual(await readFile(art), original);
    const safePath = await writeSpec(dir);
    await assert.rejects(
      () => composeFromSpec(safePath, join(dir, 'out'), { force: true, receipt: safePath }),
      /overwrite a source/,
    );
    await rm(art);
    await link(resolve(ROOT, 'artwork/ordinary-world.png'), art);
    await assert.rejects(() => composeFromSpec(safePath, dir, { force: true }), /overwrite a source/);
    await rm(art);
    await symlink(resolve(ROOT, 'artwork/ordinary-world.png'), art);
    await assert.rejects(() => composeFromSpec(safePath, dir, { force: true }), /symlink output/);
  }));
test('font provenance is verified and damaged cache fails explicitly', async () =>
  withTemp(async (dir) => {
    const fonts = await prepareFonts(spec, ['zh', 'en'], { root: ROOT, download: false });
    assert.ok(fonts.every((f) => f.download.includes('6c71356c86f8a0b533012cceffcd1c4dbc9fd807')));
    const { mkdir } = await import('node:fs/promises');
    await mkdir(join(dir, 'fonts/cormorant'), { recursive: true });
    await writeFile(join(dir, 'fonts/cormorant/CormorantGaramond.ttf'), 'broken');
    await assert.rejects(
      () => prepareFonts({ number: '01', title: {} }, [], { root: dir }),
      /checksum mismatch/,
    );
  }));

test('adversarial: reject reversed reading order and receipt aliases before touching valid PNGs', async () =>
  withTemp(async (dir) => {
    const reversed = {
      ...spec,
      title: { zh: '边城' },
      author: { zh: '沈从文' },
      titleLines: { zh: ['边', '城'] },
      typography: { zh: { mode: 'centered', size: 126, baselines: [490, 250] } },
    };
    assert.throws(() => validateCoverSpec(reversed), /top to bottom/);
    const out = join(dir, 'covers');
    await composeFromSpec(specPath, out);
    const good = await readFile(join(out, 'ordinary-world-zh.png'));
    await symlink(out, join(dir, 'alias'), 'dir');
    await assert.rejects(
      () =>
        composeFromSpec(specPath, out, { force: true, receipt: join(dir, 'alias/ordinary-world-zh.png') }),
      /collide/,
    );
    assert.deepEqual(await readFile(join(out, 'ordinary-world-zh.png')), good);
    await assert.rejects(
      () =>
        composeFromSpec(specPath, out, {
          force: true,
          receipt: join(out, 'ordinary-world-zh.png/audit.json'),
        }),
      /ENOTDIR|collide/,
    );
  }));

test('adversarial: case-only receipt collision is rejected even before the first PNG exists', async () =>
  withTemp(async (dir) => {
    const out = join(dir, 'new-covers');
    await assert.rejects(
      () => composeFromSpec(specPath, out, { force: true, receipt: join(out, 'ORDINARY-WORLD-ZH.PNG') }),
      /collide/,
    );
    await assert.rejects(() => readdir(out), { code: 'ENOENT' });
  }));

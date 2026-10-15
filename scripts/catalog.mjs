import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const LANGS = ['zh', 'en'];
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export function inside(root, path) {
  if (typeof path !== 'string' || !path || isAbsolute(path))
    throw new Error(`Expected relative path: ${path}`);
  const target = resolve(root, path);
  const rel = relative(root, target);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Path leaves project: ${path}`);
  return target;
}

export function validateTypography(plan, lines, lang) {
  if (plan === undefined) return;
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('Invalid typography plan.');
  if (!['left', 'centered', 'vertical'].includes(plan.mode)) throw new Error('Invalid typography mode.');
  if (plan.mode === 'vertical' && lang !== 'zh') throw new Error('Vertical typography requires Chinese.');
  if (plan.face !== undefined && !['zhuque', 'brush'].includes(plan.face))
    throw new Error('Invalid Chinese title face.');
  if (plan.ink !== undefined && !/^#[0-9a-f]{6}$/i.test(plan.ink)) throw new Error('Invalid typography ink.');
  for (const key of ['sizes', 'baselines', 'offsets', 'centers', 'topOffsets']) {
    if (plan[key] === undefined) continue;
    if (
      !Array.isArray(plan[key]) ||
      plan[key].length !== lines.length ||
      plan[key].some((n) => !Number.isFinite(n) || n < 0 || n > 950)
    )
      throw new Error(`Invalid typography ${key}.`);
  }
  for (const key of ['size', 'top', 'leading', 'tracking']) {
    if (plan[key] !== undefined && (!Number.isFinite(plan[key]) || plan[key] < 0 || plan[key] > 600))
      throw new Error(`Invalid typography ${key}.`);
  }
  if (plan.mode === 'vertical' && plan.centers?.some((x, i) => i && x >= plan.centers[i - 1]))
    throw new Error('Vertical columns must read from right to left.');
  if (
    plan.italicLines !== undefined &&
    (!Array.isArray(plan.italicLines) ||
      plan.italicLines.some((n) => !Number.isInteger(n) || n < 0 || n >= lines.length))
  )
    throw new Error('Invalid italic line index.');
}

export function validateCatalog(data) {
  if (data?.version !== 1 || !Array.isArray(data.books) || !data.books.length)
    throw new Error('Expected a version 1 catalog with books.');
  const ids = new Set();
  const numbers = new Set();
  for (const b of data.books) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.id) || ids.has(b.id))
      throw new Error(`Invalid or duplicate book id: ${b.id}`);
    ids.add(b.id);
    if (!/^\d{2,3}$/.test(b.number) || numbers.has(b.number))
      throw new Error(`Invalid or duplicate number: ${b.number}`);
    numbers.add(b.number);
    if (!['chinese', 'world'].includes(b.group)) throw new Error(`Invalid group: ${b.id}`);
    for (const lang of LANGS) {
      for (const key of ['title', 'author', 'mood', 'concept', 'restraint', 'alt']) {
        if (typeof b[key]?.[lang] !== 'string' || !b[key][lang].trim())
          throw new Error(`Missing ${key}.${lang}: ${b.id}`);
      }
      const lines = b.titleLines?.[lang];
      if (
        !Array.isArray(lines) ||
        !lines.length ||
        lines.length > 3 ||
        lines.some((l) => typeof l !== 'string' || !l.trim())
      )
        throw new Error(`Invalid title lines: ${b.id}/${lang}`);
      if (lines.join('').replace(/\s/g, '') !== b.title[lang].replace(/\s/g, ''))
        throw new Error(`Title lines alter the title: ${b.id}/${lang}`);
      validateTypography(b.typography?.[lang], lines, lang);
    }
    if (
      !Array.isArray(b.palette) ||
      b.palette.length !== 2 ||
      b.palette.some((c) => !/^#[0-9a-f]{6}$/i.test(c))
    )
      throw new Error(`Expected two ink colours: ${b.id}`);
    if (b.artwork !== `artwork/${b.id}.png` || b.prompt !== `prompts/${b.id}.txt`)
      throw new Error(`Unexpected source path: ${b.id}`);
    if (!/^[a-f0-9]{64}$/.test(b.sha256)) throw new Error(`Missing artwork checksum: ${b.id}`);
    if (!b.generation?.tool || !/^\d{4}-\d{2}-\d{2}$/.test(b.generation?.date))
      throw new Error(`Missing generation provenance: ${b.id}`);
    if (b.generation.revision) {
      inside(ROOT, b.generation.revision.input);
      inside(ROOT, b.generation.revision.prompt);
    }
  }
  return data.books;
}

export async function loadCatalog({ verifyAssets = true } = {}) {
  const books = validateCatalog(JSON.parse(await readFile(resolve(ROOT, 'catalog.json'), 'utf8')));
  if (verifyAssets)
    for (const b of books) {
      const bytes = await readFile(inside(ROOT, b.artwork));
      if (sha256(bytes) !== b.sha256) throw new Error(`Artwork changed without updating provenance: ${b.id}`);
      const m = await sharp(bytes).metadata();
      if (m.format !== 'png' || m.width !== 1024 || m.height !== 1536)
        throw new Error(`Expected 1024×1536 PNG artwork: ${b.id}`);
      if (!(await readFile(inside(ROOT, b.prompt), 'utf8')).trim()) throw new Error(`Empty prompt: ${b.id}`);
      if (b.generation.revision) {
        await readFile(inside(ROOT, b.generation.revision.input));
        await readFile(inside(ROOT, b.generation.revision.prompt));
      }
    }
  return books;
}

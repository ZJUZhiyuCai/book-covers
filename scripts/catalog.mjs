import { readFile } from 'node:fs/promises';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));
import { LANGS, sha256, validateTypography } from '../skills/book-covers/runtime/validation.mjs';
export { LANGS, sha256, validateTypography };
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
      if (b.generation.revision.recipe) inside(ROOT, b.generation.revision.recipe);
      if (b.generation.revision.reason && typeof b.generation.revision.reason !== 'string')
        for (const lang of LANGS)
          if (
            typeof b.generation.revision.reason[lang] !== 'string' ||
            !b.generation.revision.reason[lang].trim()
          )
            throw new Error(`Missing revision reason.${lang}: ${b.id}`);
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
        if (
          b.generation.revision.recipe &&
          !(await readFile(inside(ROOT, b.generation.revision.recipe), 'utf8')).trim()
        )
          throw new Error(`Empty revision recipe: ${b.id}`);
      }
    }
  return books;
}

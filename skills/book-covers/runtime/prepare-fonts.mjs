import { readFile, mkdir, writeFile, rename, rm } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { sha256 } from './validation.mjs';

export const CACHE = fileURLToPath(new URL('.cache/', import.meta.url));
export const fontManifest = JSON.parse(await readFile(new URL('fonts.json', import.meta.url), 'utf8'));
export function requiredFaces(book, languages) {
  const faces = new Set(book.number ? ['cormorant'] : []);
  for (const lang of languages) {
    if (lang === 'zh') {
      faces.add(book.typography?.zh?.face || 'zhuque');
      if (book.title.en) faces.add('cormorant-italic');
    } else {
      faces.add('cormorant');
      faces.add('cormorant-italic');
      if (book.title.zh) faces.add('zhuque');
    }
  }
  return [...faces];
}
export async function prepareFonts(book, languages, { root = CACHE, download = true } = {}) {
  const used = fontManifest.filter((entry) => requiredFaces(book, languages).includes(entry.face));
  for (const entry of used) {
    const target = resolve(root, entry.file);
    try {
      if (sha256(await readFile(target)) !== entry.sha256)
        throw new Error(`Font checksum mismatch: ${entry.family}. Remove the damaged cached file and retry.`);
      continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      if (!download) throw new Error(`Missing font: ${entry.file}`);
    }
    const response = await fetch(entry.download, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Font download failed (${response.status}): ${entry.family}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (sha256(bytes) !== entry.sha256) throw new Error(`Downloaded font checksum mismatch: ${entry.family}`);
    await mkdir(dirname(target), { recursive: true });
    const temporary = `${target}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, bytes, { flag: 'wx' });
      await rename(temporary, target);
    } finally {
      await rm(temporary, { force: true });
    }
  }
  return used;
}

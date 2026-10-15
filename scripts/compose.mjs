import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LANGS, validateTypography, sha256, ROOT } from './catalog.mjs';
import { composeCover } from './cover.mjs';

export function validateCoverSpec(book) {
  if (!book || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.id)) throw new Error('A safe book id is required.');
  if (!/^\d{2,3}$/.test(book.number)) throw new Error('A two- or three-digit series number is required.');
  if (typeof book.artwork !== 'string' || !book.artwork.trim())
    throw new Error('An artwork path is required.');
  for (const lang of LANGS) {
    for (const field of ['title', 'author'])
      if (typeof book[field]?.[lang] !== 'string' || !book[field][lang].trim())
        throw new Error(`A complete cover requires ${field}.${lang}.`);
    const lines = book.titleLines?.[lang];
    if (
      !Array.isArray(lines) ||
      !lines.length ||
      lines.length > 3 ||
      lines.some((s) => typeof s !== 'string' || !s.trim())
    )
      throw new Error(`Supply one to three meaningful title lines for ${lang}.`);
    if (lines.join('').replace(/\s/g, '') !== book.title[lang].replace(/\s/g, ''))
      throw new Error(`Title lines alter the title: ${lang}.`);
    validateTypography(book.typography?.[lang], lines, lang);
  }
  return book;
}

export async function composeFromSpec(specPath, out, { force = false } = {}) {
  const absoluteSpec = resolve(specPath);
  const book = validateCoverSpec(JSON.parse(await readFile(absoluteSpec, 'utf8')));
  const artwork = await readFile(resolve(dirname(absoluteSpec), book.artwork));
  const outputs = [];
  // Render and validate both languages before writing any of the deliverables.
  for (const lang of LANGS)
    for (const format of ['png', 'webp']) {
      const name = `${book.id}-${lang}.${format}`;
      const bytes = await composeCover(book, lang, artwork, { format, width: format === 'png' ? 1024 : 640 });
      outputs.push({ name, bytes });
    }
  const destination = resolve(out || resolve(dirname(absoluteSpec), 'covers'));
  const receiptName = `${book.id}-cover.json`;
  for (const name of [...outputs.map((o) => o.name), receiptName]) {
    if (force) continue;
    try {
      await access(resolve(destination, name));
    } catch (err) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
    throw new Error(`Output exists: ${name}. Choose another directory or use --force.`);
  }
  const { version } = JSON.parse(await readFile(resolve(ROOT, 'package.json'), 'utf8'));
  const fonts = JSON.parse(await readFile(resolve(ROOT, 'fonts/SOURCES.json'), 'utf8'));
  const receipt = {
    renderer: `quiet-covers/${version}`,
    artwork: basename(book.artwork),
    artworkSha256: sha256(artwork),
    title: book.title,
    author: book.author,
    titleLines: book.titleLines,
    typography: book.typography || {},
    fonts,
    files: outputs.map(({ name, bytes }) => ({ name, bytes: bytes.length, sha256: sha256(bytes) })),
  };
  await mkdir(destination, { recursive: true });
  for (const { name, bytes } of outputs) await writeFile(resolve(destination, name), bytes);
  await writeFile(resolve(destination, receiptName), JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    const args = process.argv.slice(2),
      options = {};
    if (args.includes('--help')) {
      console.log(
        'Usage: npm run compose -- --spec book.json [--out covers] [--force]\nWrites complete Chinese and English PNG/WebP covers and a provenance receipt. Artwork paths resolve relative to the spec.',
      );
    } else {
      for (let i = 0; i < args.length; i++) {
        const flag = args[i];
        if (flag === '--force') options.force = true;
        else if (['--spec', '--out'].includes(flag) && args[i + 1] && !args[i + 1].startsWith('--'))
          options[flag.slice(2)] = args[++i];
        else throw new Error(`Unknown or incomplete argument: ${flag}`);
      }
      if (!options.spec) throw new Error('--spec is required.');
      const result = await composeFromSpec(options.spec, options.out, options);
      console.log(
        `Completed ${result.files.length} cover files; title and author included in both languages.`,
      );
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}

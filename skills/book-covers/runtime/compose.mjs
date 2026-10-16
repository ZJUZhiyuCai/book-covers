import { readFile, mkdir, writeFile, lstat, stat, realpath, mkdtemp, rename, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LANGS, validateTypography, sha256 } from './validation.mjs';
import { composeCover, useFontDirectory } from './cover.mjs';
import { CACHE, prepareFonts } from './prepare-fonts.mjs';

export function languagesFor(book) {
  return book.languages ?? LANGS.filter((lang) => book.title?.[lang] !== undefined);
}
export function validateCoverSpec(book) {
  if (!book || typeof book.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(book.id))
    throw new Error('A safe book id is required.');
  if (book.number !== undefined && !/^\d{2,3}$/.test(book.number))
    throw new Error('An optional series number must have two or three digits.');
  for (const field of ['artwork', 'prompt'])
    if (typeof book[field] !== 'string' || !book[field].trim())
      throw new Error(`A ${field} path is required.`);
  const languages = languagesFor(book);
  if (
    !Array.isArray(languages) ||
    !languages.length ||
    new Set(languages).size !== languages.length ||
    languages.some((lang) => !LANGS.includes(lang))
  )
    throw new Error('Choose languages from zh and en without duplicates.');
  if (!book.title || Object.keys(book.title).some((lang) => !LANGS.includes(lang)))
    throw new Error('Supported title languages are zh and en.');
  for (const [lang, title] of Object.entries(book.title))
    if (typeof title !== 'string' || !title.trim()) throw new Error(`Invalid title.${lang}.`);
  for (const lang of languages) {
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
async function canonicalTarget(path) {
  try {
    return await realpath(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return resolve(await canonicalTarget(dirname(path)), basename(path));
  }
}
async function checkDestinations(paths, sources, force) {
  const sourceStats = await Promise.all(sources.map((path) => stat(path)));
  const sourceNames = await Promise.all(sources.map((path) => realpath(path)));
  // Be conservative across case-insensitive/Unicode-normalising filesystems,
  // including targets that do not exist yet and therefore cannot be realpathed.
  const canonical = (await Promise.all(paths.map(canonicalTarget))).map((path) =>
    path.normalize('NFC').toLowerCase(),
  );
  if (
    new Set(canonical).size !== paths.length ||
    canonical.some((path, i) => canonical.some((other, j) => i !== j && path.startsWith(other + '/')))
  )
    throw new Error('Output names collide, including directory aliases.');
  for (const path of paths) {
    if (sourceNames.includes(path)) throw new Error(`Refusing to overwrite a source: ${basename(path)}`);
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink()) throw new Error(`Refusing a symlink output: ${basename(path)}`);
      if (sourceStats.some((s) => s.dev === info.dev && s.ino === info.ino))
        throw new Error(`Refusing to overwrite a source: ${basename(path)}`);
      if (!info.isFile()) throw new Error(`Output is not a regular file: ${basename(path)}`);
      if (!force)
        throw new Error(`Output exists: ${basename(path)}. Choose another directory or use --force.`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}
export async function composeFromSpec(
  specPath,
  out,
  { force = false, webp = false, receipt: receiptPath, fontRoot = CACHE, downloadFonts = true } = {},
) {
  const absoluteSpec = resolve(specPath);
  const book = validateCoverSpec(JSON.parse(await readFile(absoluteSpec, 'utf8')));
  const artworkPath = resolve(dirname(absoluteSpec), book.artwork);
  const promptPath = resolve(dirname(absoluteSpec), book.prompt);
  const artwork = await readFile(artworkPath);
  const prompt = await readFile(promptPath);
  if (!prompt.toString('utf8').trim()) throw new Error('The generation prompt must not be empty.');
  const languages = languagesFor(book);
  const destination = resolve(out || resolve(dirname(absoluteSpec), 'covers'));
  const names = [
    `${book.id}-artwork.png`,
    ...languages.map((lang) => `${book.id}-${lang}.png`),
    `${book.id}-prompt.txt`,
  ];
  if (webp) names.push(...languages.map((lang) => `${book.id}-${lang}.webp`));
  const paths = names.map((name) => resolve(destination, name));
  if (receiptPath) paths.push(resolve(receiptPath));
  const sources = [absoluteSpec, artworkPath, promptPath];
  await checkDestinations(paths, sources, force);
  const fonts = await prepareFonts(book, languages, { root: fontRoot, download: downloadFonts });
  useFontDirectory(fontRoot);
  const outputs = [{ name: names[0], bytes: artwork }];
  // Validate and render every requested language before writing any deliverable.
  for (const lang of languages)
    outputs.push({ name: `${book.id}-${lang}.png`, bytes: await composeCover(book, lang, artwork) });
  outputs.push({ name: `${book.id}-prompt.txt`, bytes: prompt });
  if (webp)
    for (const lang of languages)
      outputs.push({
        name: `${book.id}-${lang}.webp`,
        bytes: await composeCover(book, lang, artwork, { format: 'webp', width: 640 }),
      });
  const { version } = JSON.parse(await readFile(new URL('package.json', import.meta.url), 'utf8'));
  const receipt = {
    renderer: `book-covers/${version}`,
    languages,
    artwork: basename(artworkPath),
    artworkSha256: sha256(artwork),
    promptSha256: sha256(prompt),
    title: book.title,
    author: book.author,
    titleLines: book.titleLines,
    typography: book.typography || {},
    fonts,
    files: outputs.map(({ name, bytes }) => ({ name, bytes: bytes.length, sha256: sha256(bytes) })),
  };
  await mkdir(destination, { recursive: true });
  const staging = await mkdtemp(resolve(destination, '.book-covers-'));
  try {
    for (const { name, bytes } of outputs) await writeFile(resolve(staging, name), bytes);
    // Recheck after rendering; --force never permits modifying input artwork or symlinks.
    await checkDestinations(paths, sources, force);
    for (const { name, bytes } of outputs) {
      const target = resolve(destination, name);
      if (force) await rename(resolve(staging, name), target);
      else await writeFile(target, bytes, { flag: 'wx' });
    }
    if (receiptPath) {
      await checkDestinations(
        [resolve(receiptPath)],
        [...sources, ...outputs.map(({ name }) => resolve(destination, name))],
        force,
      );
      await mkdir(dirname(resolve(receiptPath)), { recursive: true });
      await writeFile(resolve(receiptPath), JSON.stringify(receipt, null, 2) + '\n', {
        flag: force ? 'w' : 'wx',
      });
    }
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  return receipt;
}
export async function runCLI(args = process.argv.slice(2), defaults = {}) {
  if (args.includes('--help')) {
    console.log(
      'Usage: node compose.mjs --spec book.json [--out covers] [--webp] [--receipt audit.json] [--force]\nDefault: text-free PNG, typeset PNG per requested language, and a copyable prompt TXT. Fonts download automatically into a checksum-verified cache; no OS font installation.',
    );
    return;
  }
  const options = { ...defaults };
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (['--force', '--webp'].includes(flag)) options[flag.slice(2)] = true;
    else if (['--spec', '--out', '--receipt'].includes(flag) && args[i + 1] && !args[i + 1].startsWith('--'))
      options[flag.slice(2)] = args[++i];
    else throw new Error(`Unknown or incomplete argument: ${flag}`);
  }
  if (!options.spec) throw new Error('--spec is required.');
  const result = await composeFromSpec(options.spec, options.out, options);
  console.log(
    `Created ${result.files.length} files (${result.languages.join(', ')}):\n${result.files.map((f) => f.name).join('\n')}`,
  );
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href)
  runCLI().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

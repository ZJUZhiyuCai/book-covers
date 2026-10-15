import { readFile, writeFile, mkdir, cp, rm, readdir, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import subsetFont from 'subset-font';
import { loadCatalog, ROOT, LANGS, sha256 } from './catalog.mjs';
import { renderCover } from './cover.mjs';
import { homePage, detailPage, SITE } from '../src/templates.mjs';

export async function checkLocalLinks(out) {
  const files = [];
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, item.name);
      if (item.isDirectory()) await walk(path);
      else if (item.name.endsWith('.html')) files.push(path);
    }
  }
  await walk(out);
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = match[1];
      if (/^(https?:|data:|mailto:|#)/.test(url)) continue;
      const target = resolve(dirname(file), decodeURIComponent(url.split(/[?#]/)[0]));
      try {
        const s = await stat(target);
        if (s.isDirectory()) await stat(resolve(target, 'index.html'));
      } catch {
        throw new Error(`Broken local link in ${file}: ${url}`);
      }
    }
  }
  return files.length;
}

export async function build() {
  const books = await loadCatalog();
  const out = resolve(ROOT, 'dist');
  await rm(out, { recursive: true, force: true });
  for (const dir of ['assets', 'covers', 'previews', 'downloads', 'en'])
    await mkdir(resolve(out, dir), { recursive: true });
  for (const dir of ['artwork', 'prompts', 'process'])
    await cp(resolve(ROOT, dir), resolve(out, dir), { recursive: true });
  for (const name of ['style.css', 'app.js', 'mark.svg'])
    await cp(resolve(ROOT, 'src', name), resolve(out, 'assets', name));
  const revision = await readFile(resolve(ROOT, 'prompts/margin-revision.txt'), 'utf8');
  const pages = [];
  for (const b of books) {
    await sharp(resolve(ROOT, b.artwork))
      .resize(640, 960)
      .webp({ quality: 86 })
      .toFile(resolve(out, 'previews', `${b.id}.webp`));
    const prompt = await readFile(resolve(ROOT, b.prompt), 'utf8');
    for (const lang of LANGS) {
      const png = await renderCover(b, lang);
      await writeFile(resolve(out, 'downloads', `${b.id}-${lang}.png`), png);
      await sharp(png)
        .resize(640, 960)
        .webp({ quality: 87 })
        .toFile(resolve(out, 'covers', `${b.id}-${lang}.webp`));
      const path = `${lang === 'en' ? 'en/' : ''}books/${b.id}/`;
      const html = detailPage(b, books, lang, prompt, b.generation.revision ? revision : '');
      await mkdir(resolve(out, path), { recursive: true });
      await writeFile(resolve(out, path, 'index.html'), html);
      pages.push({ path, html });
    }
  }
  for (const lang of LANGS) {
    const path = lang === 'en' ? 'en/' : '';
    const html = homePage(books, lang);
    await writeFile(resolve(out, path, 'index.html'), html);
    pages.push({ path, html });
  }
  const fontBytes = await readFile(resolve(ROOT, 'fonts/NotoSerifSC.ttf'));
  const glyphs = [...new Set(pages.map((p) => p.html).join(''))].join('');
  const webFont = await subsetFont(fontBytes, glyphs, {
    targetFormat: 'woff2',
    preserveNameIds: [0, 13, 14],
    variationAxes: { wght: { min: 400, max: 600, default: 400 } },
  });
  await writeFile(resolve(out, 'assets/serif.woff2'), webFont);
  await cp(resolve(ROOT, 'fonts/OFL.txt'), resolve(out, 'assets/OFL.txt'));
  await mkdir(resolve(out, 'assets/font-licenses'), { recursive: true });
  for (const name of ['cormorant', 'zhuque', 'mashanzheng'])
    await cp(resolve(ROOT, `fonts/${name}/OFL.txt`), resolve(out, `assets/font-licenses/${name}-OFL.txt`));
  await writeFile(resolve(out, 'catalog.json'), JSON.stringify({ version: 1, books }, null, 2) + '\n');
  await writeFile(resolve(out, '.nojekyll'), '');
  await writeFile(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
  await writeFile(
    resolve(out, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((p) => `<url><loc>${SITE}${p.path}</loc></url>`).join('')}</urlset>`,
  );
  try {
    await sharp(resolve(ROOT, 'press/github-cover.png'))
      .resize(1200, 630, { fit: 'contain', background: '#f4f0e7' })
      .jpeg({ quality: 90 })
      .toFile(resolve(out, 'assets/og.jpg'));
  } catch (e) {
    if (!String(e.message).includes('missing')) throw e;
    await sharp(resolve(out, 'covers/ordinary-world-zh.webp'))
      .resize(1200, 630, { fit: 'contain', background: '#f4f0e7' })
      .jpeg()
      .toFile(resolve(out, 'assets/og.jpg'));
  }
  await writeFile(
    resolve(out, '404.html'),
    '<!doctype html><html lang="en"><meta charset="utf-8"><title>Not found · Quiet Covers</title><meta name="viewport" content="width=device-width"><body style="background:#f4f0e7;color:#303a35;font-family:Georgia,serif;padding:12vw"><h1>This page is still blank.</h1><p>这一页，暂时留白。</p><p><a href="' +
      SITE +
      '">Return to Quiet Covers →</a></p></body></html>',
  );
  const hashes = {};
  for (const name of await readdir(resolve(out, 'downloads')))
    hashes[name] = sha256(await readFile(resolve(out, 'downloads', name)));
  await writeFile(resolve(out, 'downloads/checksums.json'), JSON.stringify(hashes, null, 2) + '\n');
  const count = await checkLocalLinks(out);
  console.log(
    `Built ${books.length} studies, ${books.length * 2} typeset covers and ${count} HTML pages. Web font: ${(webFont.length / 1024).toFixed(0)} KiB. Local links checked.`,
  );
  return out;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();

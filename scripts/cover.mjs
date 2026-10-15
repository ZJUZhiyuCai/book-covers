import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import { ROOT, inside, LANGS } from './catalog.mjs';

const family = fontkit.openSync(resolve(ROOT, 'fonts/NotoSerifSC.ttf'));
const fonts = new Map();
export function font(weight = 400) {
  if (!fonts.has(weight)) fonts.set(weight, family.getVariation({ wght: weight }));
  return fonts.get(weight);
}

export function textWidth(text, size, weight = 400, tracking = 0) {
  const f = font(weight);
  const run = f.layout(text);
  return (
    (run.positions.reduce((sum, p) => sum + p.xAdvance, 0) * size) / f.unitsPerEm +
    Math.max(0, run.glyphs.length - 1) * tracking
  );
}

export function textPaths(text, x, baseline, size, { weight = 400, fill = '#292c29', tracking = 0 } = {}) {
  const f = font(weight);
  for (const ch of text)
    if (!f.hasGlyphForCodePoint(ch.codePointAt(0))) throw new Error(`Font has no glyph for ${ch}`);
  const { glyphs, positions } = f.layout(text);
  const scale = size / f.unitsPerEm;
  let pen = x;
  return glyphs
    .map((g, i) => {
      const p = positions[i];
      const path = `<path d="${g.path.toSVG()}" transform="translate(${pen + p.xOffset * scale},${baseline - p.yOffset * scale}) scale(${scale},${-scale})" fill="${fill}"/>`;
      pen += p.xAdvance * scale + tracking;
      return path;
    })
    .join('');
}

export function wrapText(text, maxWidth, size, weight = 400) {
  const words = text.includes(' ') ? text.split(' ') : [...text];
  const sep = text.includes(' ') ? ' ' : '';
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? line + sep + word : word;
    if (textWidth(next, size, weight) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.some((l) => textWidth(l, size, weight) > maxWidth))
    throw new Error(`Unbreakable text exceeds width: ${text}`);
  return lines;
}

export function coverLayout(book, lang) {
  if (!LANGS.includes(lang)) throw new Error(`Unknown language: ${lang}`);
  const lines = book.titleLines[lang];
  const widest = Math.max(...lines.map((t) => textWidth(t, 1, 500)));
  const size = Math.min(lang === 'zh' ? 84 : 76, 840 / widest);
  if (size < 50) throw new Error(`Title too long; supply better line breaks: ${book.id}/${lang}`);
  const leading = lang === 'zh' ? 114 : 94;
  const title = lines.map((text, i) => ({ text, x: 92, y: 210 + leading * i, size, weight: 500 }));
  const other = lang === 'zh' ? 'en' : 'zh';
  const subtitle = wrapText(book.title[other], 800, 28).map((text, i) => ({
    text,
    x: 96,
    y: title.at(-1).y + 67 + i * 42,
    size: 28,
    weight: 400,
  }));
  if (subtitle.at(-1).y > 610) throw new Error(`Typography enters artwork: ${book.id}/${lang}`);
  const authorSize = Math.min(30, 810 / textWidth(book.author[lang], 1));
  return {
    title,
    subtitle,
    author: { text: book.author[lang], x: 96, y: 1466, size: authorSize, weight: 400 },
  };
}

export function typographySVG(book, lang) {
  const { title, subtitle, author } = coverLayout(book, lang);
  const p = (e) => textPaths(e.text, e.x, e.y, e.size, { weight: e.weight });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">${textPaths(`QUIET COVERS  /  ${book.number}`, 96, 105, 22, { fill: '#69685e', tracking: 2 })}${title.map(p).join('')}${subtitle.map((e) => textPaths(e.text, e.x, e.y, e.size, { fill: '#65665e' })).join('')}${p(author)}</svg>`;
}

export async function renderCover(book, lang, { width = 1024, format = 'png' } = {}) {
  if (!Number.isInteger(width) || width < 128 || width > 4096)
    throw new Error('Export width must be an integer from 128 to 4096.');
  if (!['png', 'webp'].includes(format)) throw new Error('Export format must be png or webp.');
  const art = await readFile(inside(ROOT, book.artwork));
  // Typography is a separate deterministic layer. The source illustration is never rewritten.
  const full = await sharp(art)
    .composite([{ input: Buffer.from(typographySVG(book, lang)) }])
    .png()
    .toBuffer();
  const resized = sharp(full).resize(width, Math.round(width * 1.5));
  return format === 'webp' ? resized.webp({ quality: 87 }).toBuffer() : resized.png().toBuffer();
}

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as fontkit from 'fontkit';
import sharp from 'sharp';
import { ROOT, inside, LANGS } from './catalog.mjs';

const fontFiles = {
  noto: 'fonts/NotoSerifSC.ttf',
  zhuque: 'fonts/zhuque/ZhuqueFangsong-Regular.ttf',
  brush: 'fonts/mashanzheng/MaShanZheng-Regular.ttf',
  cormorant: 'fonts/cormorant/CormorantGaramond.ttf',
  'cormorant-italic': 'fonts/cormorant/CormorantGaramond-Italic.ttf',
};
const families = new Map();
const fonts = new Map();
export function font(weight = 400, face = 'noto') {
  if (!fontFiles[face]) throw new Error(`Unknown font face: ${face}`);
  if (!families.has(face)) families.set(face, fontkit.openSync(resolve(ROOT, fontFiles[face])));
  const family = families.get(face);
  const key = `${face}/${weight}`;
  if (!fonts.has(key))
    fonts.set(key, family.variationAxes?.wght ? family.getVariation({ wght: weight }) : family);
  return fonts.get(key);
}

export function textWidth(text, size, weight = 400, tracking = 0, face = 'noto') {
  const f = font(weight, face);
  const run = f.layout(text);
  return (
    (run.positions.reduce((sum, p) => sum + p.xAdvance, 0) * size) / f.unitsPerEm +
    Math.max(0, run.glyphs.length - 1) * tracking
  );
}

export function textPaths(
  text,
  x,
  baseline,
  size,
  { weight = 400, fill = '#292c29', tracking = 0, face = 'noto' } = {},
) {
  const f = font(weight, face);
  for (const ch of text)
    if (!f.hasGlyphForCodePoint(ch.codePointAt(0))) throw new Error(`Font ${face} has no glyph for ${ch}`);
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

// Ink bounds include italic overhangs and glyph sidebearings, unlike advance width.
export function textBounds(text, x, y, size, { face = 'noto', weight = 400, tracking = 0 } = {}) {
  const f = font(weight, face),
    scale = size / f.unitsPerEm;
  const { glyphs, positions } = f.layout(text);
  let pen = x,
    left = Infinity,
    top = Infinity,
    right = -Infinity,
    bottom = -Infinity;
  glyphs.forEach((g, i) => {
    const p = positions[i],
      b = g.bbox;
    if (b.maxX > b.minX && b.maxY > b.minY) {
      left = Math.min(left, pen + (p.xOffset + b.minX) * scale);
      right = Math.max(right, pen + (p.xOffset + b.maxX) * scale);
      top = Math.min(top, y - (p.yOffset + b.maxY) * scale);
      bottom = Math.max(bottom, y - (p.yOffset + b.minY) * scale);
    }
    pen += p.xAdvance * scale + tracking;
  });
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function line(text, baseline, size, options = {}) {
  const { anchor = 96, align = 'left', maxWidth = 832, ...style } = options;
  let bounds = textBounds(text, 0, baseline, size, style);
  while (bounds.width > maxWidth && size >= 24) {
    size -= 0.5;
    bounds = textBounds(text, 0, baseline, size, style);
  }
  if (bounds.width > maxWidth) throw new Error(`Text cannot fit: ${text}`);
  const x = anchor - bounds.left - (align === 'center' ? bounds.width / 2 : 0);
  return { text, x, y: baseline, size, ...style };
}

export function coverLayout(book, lang) {
  if (!LANGS.includes(lang)) throw new Error(`Unknown language: ${lang}`);
  const plan = book.typography?.[lang] || {};
  const mode = plan.mode || 'left';
  const centered = mode === 'centered' || mode === 'vertical';
  const ink = plan.ink || '#30382f';
  const title = [];
  if (mode === 'vertical') {
    if (lang !== 'zh') throw new Error('Vertical setting requires a Chinese title.');
    book.titleLines.zh.forEach((column, col) => {
      const size = plan.size || 126;
      const centerX = plan.centers?.[col] ?? 512 - col * 150;
      [...column].forEach((text, row) => {
        const centerY =
          (plan.top || 170) + (plan.topOffsets?.[col] || 0) + row * (plan.leading || 138) + size / 2;
        const style = { face: plan.face || 'zhuque', weight: 400, fill: ink };
        const b = textBounds(text, 0, 0, size, style);
        title.push({
          text,
          x: centerX - (b.left + b.right) / 2,
          y: centerY - (b.top + b.bottom) / 2,
          size,
          ...style,
        });
      });
    });
  } else {
    book.titleLines[lang].forEach((text, i) => {
      const face =
        lang === 'zh'
          ? plan.face || 'zhuque'
          : plan.italicLines?.includes(i)
            ? 'cormorant-italic'
            : 'cormorant';
      const e = line(text, plan.baselines?.[i] ?? 250 + i * 142, plan.sizes?.[i] ?? 126, {
        face,
        weight: lang === 'en' ? 500 : 400,
        fill: ink,
        tracking: plan.tracking || 0,
        anchor: centered ? 512 : 96 + (plan.offsets?.[i] || 0),
        align: centered ? 'center' : 'left',
        maxWidth: 832 - (centered ? 0 : plan.offsets?.[i] || 0),
      });
      if (e.size < 60) throw new Error(`Title too long; supply better line breaks: ${book.id}/${lang}`);
      title.push(e);
    });
  }
  const titleBottom = Math.max(...title.map((e) => textBounds(e.text, e.x, e.y, e.size, e).bottom));
  const other = lang === 'zh' ? 'en' : 'zh';
  const translated = line(
    book.title[other],
    titleBottom + (mode === 'vertical' ? 52 : 72),
    lang === 'zh' ? 38 : 32,
    {
      face: lang === 'zh' ? 'cormorant-italic' : 'zhuque',
      weight: lang === 'zh' ? 500 : 400,
      tracking: lang === 'en' ? 4 : 0,
      fill: '#62655b',
      anchor: centered ? 512 : 98,
      align: centered ? 'center' : 'left',
      maxWidth: 810,
    },
  );
  const author = line(book.author[lang], 1468, lang === 'zh' ? 48 : 48, {
    face: lang === 'zh' ? (plan.face === 'brush' ? 'brush' : 'zhuque') : 'cormorant-italic',
    weight: lang === 'en' ? 500 : 400,
    tracking: lang === 'zh' ? 8 : 0,
    fill: ink,
    anchor: centered ? 512 : 98,
    align: centered ? 'center' : 'left',
    maxWidth: 810,
  });
  const layout = { title, subtitle: [translated], author };
  for (const e of [...title, translated, author]) {
    const b = textBounds(e.text, e.x, e.y, e.size, e);
    if (
      ![b.left, b.right, b.top, b.bottom].every(Number.isFinite) ||
      b.left < 70 ||
      b.right > 954 ||
      (e === author ? b.top < 1400 || b.bottom > 1500 : b.top < 130 || b.bottom > 610)
    )
      throw new Error(`Typography outside reserved region: ${book.id}/${lang}/${e.text}`);
  }
  const boxes = [...title, translated].map((e) => textBounds(e.text, e.x, e.y, e.size, e));
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i],
        b = boxes[j];
      if (a.right > b.left && b.right > a.left && a.bottom > b.top && b.bottom > a.top)
        throw new Error(`Typography overlaps: ${book.id}/${lang}`);
    }
  return layout;
}

export function typographySVG(book, lang) {
  const { title, subtitle, author } = coverLayout(book, lang);
  const p = (e) => textPaths(e.text, e.x, e.y, e.size, e);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536" viewBox="0 0 1024 1536">${textPaths(`BOOK COVERS  /  ${book.number}`, 96, 104, 23, { face: 'cormorant', weight: 600, fill: '#69685e', tracking: 3 })}${title.map(p).join('')}${subtitle.map(p).join('')}${p(author)}</svg>`;
}

export async function renderCover(book, lang, { width = 1024, format = 'png' } = {}) {
  const art = await readFile(inside(ROOT, book.artwork));
  return composeCover(book, lang, art, { width, format });
}

// External books can use the same complete-cover pipeline without entering the public catalog.
export async function composeCover(book, lang, art, { width = 1024, format = 'png' } = {}) {
  if (!Number.isInteger(width) || width < 128 || width > 4096)
    throw new Error('Export width must be an integer from 128 to 4096.');
  if (!['png', 'webp'].includes(format)) throw new Error('Export format must be png or webp.');
  const meta = await sharp(art).metadata();
  if (meta.width !== 1024 || meta.height !== 1536 || meta.pages > 1)
    throw new Error('Artwork must be a single 1024×1536 image; do not silently crop it.');
  // Typography is a separate deterministic layer. The source illustration is never rewritten.
  const full = await sharp(art)
    .composite([{ input: Buffer.from(typographySVG(book, lang)) }])
    .png()
    .toBuffer();
  const resized = sharp(full).resize(width, Math.round(width * 1.5));
  return format === 'webp' ? resized.webp({ quality: 87 }).toBuffer() : resized.png().toBuffer();
}

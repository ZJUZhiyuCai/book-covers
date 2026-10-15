import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadCatalog, ROOT, inside } from './catalog.mjs';
import { renderCover, textPaths, typographySVG } from './cover.mjs';

const PAPER = '#f4f0e7';
const INK = '#303a35';
const FONT = { fill: INK };
const lines = (text, x, y, size, leading, opts = FONT) =>
  text
    .split('\n')
    .map((l, i) => textPaths(l, x, y + i * leading, size, opts))
    .join('');
const plate = (width, height, content) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${PAPER}"/>${content}</svg>`,
  );

export async function exportPress(out = resolve(ROOT, 'output')) {
  await mkdir(out, { recursive: true });
  const books = await loadCatalog();
  const covers = new Map();
  for (const b of books) covers.set(b.id, await renderCover(b, 'zh'));
  async function sheet(name, title, subtitle, ids) {
    let design =
      textPaths('QUIET COVERS  /  纸间', 84, 100, 26, { tracking: 1 }) +
      lines(title, 84, 223, 65, 92) +
      textPaths(subtitle, 88, 318, 27, { fill: '#6c7065' });
    design +=
      '<path d="M84 1724H1356" stroke="#c9c6b9"/>' +
      textPaths('10 部文学作品 · AI 插画 × 独立排版 × 开源 Skill', 84, 1785, 26) +
      textPaths('github.com/ZJUZhiyuCai/quiet-covers', 84, 1845, 24, { fill: '#6c7065' });
    const layers = [];
    const width = 370,
      height = 555;
    for (let i = 0; i < ids.length; i++) {
      const row = Math.floor(i / 3),
        col = i % 3;
      const offset = ids.length === 5 && row === 1 ? 215 : 0;
      layers.push({
        input: await sharp(covers.get(ids[i])).resize(width, height).png().toBuffer(),
        left: 84 + col * 450 + offset,
        top: 420 + row * 650,
      });
    }
    await sharp(plate(1440, 1920, design))
      .composite(layers)
      .png()
      .toFile(resolve(out, name));
  }
  await sheet('01-introduction.png', '给文学，留一点空白。', '把一本书的余韵，留在一幅画里。', [
    'ordinary-world',
    'monte-cristo',
    'white-horse',
    'steel-tempered',
    'red-chamber',
    'old-man-sea',
  ]);
  await sheet(
    '02-chinese-literature.png',
    '五部作品，五处心境。',
    '黄土坡、渡口、沙丘、空庭与窄巷。',
    books.filter((b) => b.group === 'chinese').map((b) => b.id),
  );
  await sheet(
    '03-world-literature.png',
    '走进另一个文学空间。',
    '孤岛、雪地、海面、房间与远岸。',
    books.filter((b) => b.group === 'world').map((b) => b.id),
  );
  const b = books[0];
  let method =
    textPaths('QUIET COVERS  /  THE METHOD', 84, 100, 26, { tracking: 1 }) +
    lines('从故事，到画面，\n再到封面。', 84, 240, 72, 108) +
    textPaths('每一层都可拆开，每一个选择都有理由。', 88, 439, 28, { fill: '#6c7065' });
  const cards = [
    await sharp(resolve(ROOT, b.artwork)).resize(370, 555).png().toBuffer(),
    await sharp(plate(1024, 1536, typographySVG(b, 'zh').replace(/^<svg[^>]*>|<\/svg>$/g, '')))
      .resize(370, 555)
      .png()
      .toBuffer(),
    await sharp(covers.get(b.id)).resize(370, 555).png().toBuffer(),
  ];
  const labels = [
    ['01  生成插画', '用小路和窑洞，表达生活的韧性。'],
    ['02  独立排版', '书名准确，中文英文各有呼吸。'],
    ['03  合成封面', '留白、画面、文字，成为一体。'],
  ];
  labels.forEach((a, i) => {
    method +=
      textPaths(a[0], 84 + 450 * i, 1255, 30) + textPaths(a[1], 84 + 450 * i, 1317, 20, { fill: '#6c7065' });
  });
  method +=
    lines('开放的不止是图片。\n还有提示词、选择过程，以及可以继续使用的 Skill。', 84, 1510, 30, 60) +
    textPaths('github.com/ZJUZhiyuCai/quiet-covers', 84, 1845, 24, { fill: '#6c7065' });
  await sharp(plate(1440, 1920, method))
    .composite(cards.map((input, i) => ({ input, left: 84 + i * 450, top: 590 })))
    .png()
    .toFile(resolve(out, '04-process.png'));
  let banner =
    textPaths('QUIET COVERS / 纸间', 88, 94, 20, { tracking: 1 }) +
    lines('Quiet\nCovers', 84, 290, 119, 144) +
    textPaths('A book, distilled to one image.', 90, 549, 28) +
    textPaths('一本书，一幅留白。', 90, 620, 33) +
    textPaths('ARTWORK  /  PROMPTS  /  AGENT SKILL', 90, 798, 18, { fill: '#6c7065', tracking: 1 });
  const bannerIDs = [
    'ordinary-world',
    'monte-cristo',
    'red-chamber',
    'white-horse',
    'steel-tempered',
    'old-man-sea',
  ];
  const tiles = [];
  for (let i = 0; i < bannerIDs.length; i++)
    tiles.push({
      input: await sharp(covers.get(bannerIDs[i])).resize(224, 336).png().toBuffer(),
      left: 880 + (i % 3) * 280,
      top: 82 + Math.floor(i / 3) * 404,
    });
  await sharp(plate(1800, 900, banner))
    .composite(tiles)
    .png()
    .toFile(resolve(out, 'github-cover.png'));
  console.log(`Exported four 1440×1920 press sheets and a GitHub banner to ${out}`);
}

export function parseExportArgs(args) {
  const options = { lang: 'zh', width: 1024, out: 'output' };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') return { help: true };
    const key = { '--book': 'book', '--lang': 'lang', '--width': 'width', '--out': 'out' }[args[i]];
    if (!key || !args[i + 1] || args[i + 1].startsWith('--'))
      throw new Error(`Unknown or incomplete export argument: ${args[i]}`);
    options[key] = key === 'width' ? Number(args[++i]) : args[++i];
  }
  if (!['zh', 'en'].includes(options.lang)) throw new Error('Language must be zh or en.');
  if (!Number.isInteger(options.width) || options.width < 128 || options.width > 4096)
    throw new Error('Width must be an integer from 128 to 4096.');
  inside(ROOT, options.out);
  return options;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseExportArgs(process.argv.slice(2));
  if (options.help)
    console.log(
      'npm run export [-- --book <id> --lang zh|en --width 1024 --out output]\nWithout --book, exports four press sheets and a GitHub banner.',
    );
  else if (options.book) {
    const books = await loadCatalog();
    const book = books.find((b) => b.id === options.book);
    if (!book) throw new Error(`Unknown book: ${options.book}`);
    const out = inside(ROOT, options.out);
    await mkdir(out, { recursive: true });
    const file = resolve(out, `${book.id}-${options.lang}.png`);
    await writeFile(file, await renderCover(book, options.lang, { width: options.width }));
    console.log(`Exported ${file}`);
  } else await exportPress(inside(ROOT, options.out));
}

import { escapeHTML as h } from '../scripts/catalog.mjs';

export const REPO = 'https://github.com/ZJUZhiyuCai/book-covers';
export const SITE = 'https://zjuzhiyucai.github.io/book-covers/';
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const external = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
const t = (lang, zh, en) => (lang === 'zh' ? zh : en);
const prefix = (lang) => (lang === 'en' ? 'en/' : '');
const bookPath = (b, lang) => `${prefix(lang)}books/${b.id}/`;

function header(lang, root, path = '') {
  const other = lang === 'zh' ? 'en' : 'zh';
  return `<header class="site-header"><a class="brand" href="${root}${prefix(lang)}"><img src="${root}assets/mark.svg" width="25" height="30" alt=""/><span>Book Covers</span></a><nav aria-label="${t(lang, '主导航', 'Main navigation')}"><a class="nav-collection" href="${root}${prefix(lang)}#collection">${t(lang, '封面集', 'Collection')}</a><a class="nav-method" href="${root}${prefix(lang)}#method">${t(lang, '方法', 'The approach')}</a><a href="${REPO}" class="github-link" target="_blank" rel="noopener noreferrer">GitHub ${external}</a><a class="language" data-locale href="${root}${prefix(other)}${path}" lang="${other === 'zh' ? 'zh-CN' : 'en'}" aria-label="${t(lang, 'Switch to English', '切换至中文')}">${t(lang, 'EN', '中')}</a></nav></header>`;
}
function footer(lang, root) {
  return `<footer class="site-footer"><a href="${root}${prefix(lang)}" class="footer-name">Book Covers</a><p>${t(lang, '创作与策划', 'Created & curated by')} <a href="https://caizhiyu.com/" target="_blank" rel="noopener noreferrer">Zhiyu Cai ${external}</a></p><p>${t(lang, 'AI 生成插画 · 独立文学封面实验', 'AI-generated illustrations · Independent literary cover studies')}<br><a href="${REPO}/blob/main/LICENSE">${t(lang, '代码 MIT', 'Code MIT')}</a> <span> / </span> <a href="${REPO}/blob/main/ASSETS.md">${t(lang, '插画 CC BY 4.0', 'Artwork CC BY 4.0')}</a></p></footer>`;
}
function shell({ lang, root, title, description, path = '', body }) {
  const canonical = SITE + prefix(lang) + path;
  return `<!doctype html><html lang="${lang === 'zh' ? 'zh-CN' : 'en'}" data-lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(title)}</title><meta name="description" content="${h(description)}"><meta name="theme-color" content="#f4f0e7"><link rel="icon" type="image/svg+xml" href="${root}assets/mark.svg"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="zh-CN" href="${SITE}${path}"><link rel="alternate" hreflang="en" href="${SITE}en/${path}"><meta property="og:type" content="website"><meta property="og:title" content="${h(title)}"><meta property="og:description" content="${h(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}assets/og.jpg"><meta name="twitter:card" content="summary_large_image"><link rel="preload" href="${root}assets/serif.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${root}assets/style.css"><script type="module" src="${root}assets/app.js"></script></head><body><a class="skip" href="#main">${t(lang, '跳至正文', 'Skip to content')}</a>${header(lang, root, path)}${body}${footer(lang, root)}</body></html>`;
}

export function homePage(books, lang) {
  const root = lang === 'zh' ? './' : '../';
  const heroBooks = ['white-horse', 'ordinary-world', 'monte-cristo'].map((id) =>
    books.find((b) => b.id === id),
  );
  const cards = books
    .map(
      (b) =>
        `<article class="book" data-group="${b.group}"><a href="${root}${bookPath(b, lang)}" class="book-link" aria-label="${h(t(lang, `查看《${b.title.zh}》`, `Explore ${b.title.en}`))}"><div class="book-image"><img src="${root}covers/${b.id}-${lang}.webp" width="640" height="960" loading="lazy" decoding="async" alt="${h(b.alt[lang])}"><span class="book-open" aria-hidden="true">${external}</span></div><div class="book-caption"><span class="book-number">${b.number}</span><div><h3>${h(b.title[lang])}</h3><p>${h(b.author[lang])}</p></div></div></a></article>`,
    )
    .join('');
  const installPrompt = t(
    lang,
    '请安装 Book Covers skill：\nhttps://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers\n使用你原生的技能安装方式，包含引用素材；如已安装，保留本地修改后更新。完成后告诉我调用方式。',
    'Please install the Book Covers skill:\nhttps://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers\nUse your native skill installer and include its resources. Preserve local edits before updating. Tell me how to invoke it.',
  );
  const body = `<main id="main"><section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow">AN OPEN LITERARY COVER COLLECTION</p><h1 id="hero-title">Book<br>Covers</h1><p class="hero-intro">${t(lang, '把一本书的余韵，<br>留在一幅画里。', 'A book, distilled<br>to one image.')}</p><a class="text-link" href="#collection">${t(lang, '翻开这本封面集', 'Explore the collection')} ${arrow}</a></div><div class="hero-visual" aria-label="${t(lang, '系列封面精选', 'Selected covers')}">${heroBooks.map((b, i) => `<a class="hero-book hero-book-${i}" href="${root}${bookPath(b, lang)}" aria-label="${h(b.title[lang])}"><img src="${root}covers/${b.id}-${lang}.webp" width="640" height="960" alt="${h(b.title[lang])}" ${i === 1 ? 'fetchpriority="high"' : ''}></a>`).join('')}<span class="hero-note">VOL. 01 &nbsp; / &nbsp; ${t(lang, '故事与留白', 'STORIES & SPACE')}</span></div><div class="hero-bottom"><span>${t(lang, '10 部作品 · 10 个文学空间', '10 WORKS · 10 LITERARY SPACES')}</span><span>${t(lang, '插画、提示词与方法，全部开放', 'ARTWORK, PROMPTS & METHOD — OPEN TO EXPLORE')}</span></div></section>
  <section class="collection section-pad" id="collection" aria-labelledby="collection-title"><div class="section-heading"><div><p class="eyebrow">01 / THE COLLECTION</p><h2 id="collection-title">${t(lang, '故事，落在纸上。', 'Stories, on paper.')}</h2></div><p>${t(lang, '点击封面，看看这幅画从何而来。', 'Open a cover to see the thought behind it.')}</p></div><div class="collection-toolbar"><div class="filters" aria-label="${t(lang, '作品分类', 'Filter collection')}"><button type="button" data-filter="all" aria-pressed="true">${t(lang, '全部', 'All works')}</button><button type="button" data-filter="chinese" aria-pressed="false">${t(lang, '中国文学', 'Chinese literature')}</button><button type="button" data-filter="world" aria-pressed="false">${t(lang, '世界文学', 'World literature')}</button></div><span id="collection-count" role="status" aria-live="polite">10 ${t(lang, '部作品', 'works')}</span></div><div class="books">${cards}</div></section>
  <section class="method section-pad" id="method" aria-labelledby="method-title"><div class="section-heading"><div><p class="eyebrow">02 / THE APPROACH</p><h2 id="method-title">${t(lang, '少画一点，多留一点。', 'Less on the page.<br>More in the mind.')}</h2></div><p>${t(lang, '从故事出发，让空间承接情绪。', 'Begin with the story.<br>Let space carry the feeling.')}</p></div><div class="method-steps"><div><span>01</span><h3>${t(lang, '找到一种关系', 'Find a relationship')}</h3><p>${t(lang, '海很大，船很小。道路很长，门很远。比起罗列元素，先找到故事中牵动人的那种关系。', 'A large sea, a small boat. A long path, a distant door. Begin with the relationship that gives the story its emotional weight.')}</p></div><div><span>02</span><h3>${t(lang, '收成一处空间', 'Make room for a scene')}</h3><p>${t(lang, '一条雪中的铁轨，一片风里的沙丘。用少量颜色和明确的构图，让画面在缩小后依然成立。', 'Tracks through snow. A dune in the wind. A few colours and a clear composition keep the image alive, even at thumbnail size.')}</p></div><div><span>03</span><h3>${t(lang, '把留白交给文字', 'Leave space for words')}</h3><p>${t(lang, '插画由 AI 生成，文字独立编排。中文的笔形、英文的正斜体，各自回应故事；书名与作者都有自己的位置。', 'AI generates the illustration. Chinese letterforms and English roman/italic rhythms respond to each story, with deliberate space for the title and author.')}</p></div></div></section>
  <section class="skill-section section-pad" id="skill"><div class="skill-copy"><p class="eyebrow">03 / MAKE SOMETHING OF YOUR OWN</p><h2>${t(lang, '把这套方法，<br>带去下一本书。', 'Take the method<br>to your next book.')}</h2><p>${t(lang, '把这段指令交给 Codex 或其他支持 Skills 的 Agent，由它完成安装。然后说出书名，让它把文字与画面一起设计。', 'Give the prompt to Codex or another skill-capable agent. It handles installation; you name the book and it designs the lettering and image together.')}</p><a class="text-link" href="${REPO}/tree/main/skills/book-covers" target="_blank" rel="noopener noreferrer">${t(lang, '阅读 Skill', 'Read the skill')} ${arrow}</a></div><div class="skill-install"><p class="install-label">${t(lang, '交给你的 Agent', 'GIVE THIS TO YOUR AGENT')}</p><pre><code>${h(installPrompt)}</code></pre><button type="button" class="copy-button" data-copy="${h(installPrompt)}">${t(lang, '复制给 Agent', 'Copy for your agent')}</button><p class="skill-example">${t(lang, '然后试试：', 'Then try:')}<br><code>${t(lang, '$book-covers 为《边城》设计一张封面', '$book-covers Design a cover for Border Town')}</code></p><small>${t(lang, '无需手动下载安装包或安装字体。创作需要 Agent 自带生图能力。', 'No manual ZIP download or font setup. Creating covers requires an image-capable agent.')}</small><div class="install-resources"><a href="${REPO}/blob/main/INSTALL.md">${t(lang, '安装方式', 'Installation guide')} ↗</a><a href="${root}process/generated-lettering/ordinary-world-zh.png">${t(lang, '无需字体的生成示例', 'Generated-lettering example')} ↗</a></div><details class="install-cli"><summary>${t(lang, '其他 Agent · Skills CLI', 'Other agents · Skills CLI')}</summary><pre><code>npx skills add ZJUZhiyuCai/book-covers --skill book-covers</code></pre><small>${t(lang, '也可让 Agent 执行这条命令，并选择对应宿主。此方式需要 Node/npm。', 'An agent can run this command and select its host. This optional route needs Node/npm.')}</small></details></div></section></main>`;
  return shell({
    lang,
    root,
    title: t(lang, 'Book Covers — 文学封面集', 'Book Covers — A book, distilled to one image'),
    description: t(
      lang,
      '10 部中外文学作品的原创 AI 封面实验。双语排版、完整提示词、高清下载与可复用的开源 Skill。',
      'An open collection of ten AI-illustrated literary cover studies, with bilingual typography, full prompts, downloads and a reusable agent skill.',
    ),
    body,
  });
}

export function detailPage(book, books, lang, prompt, revisionPrompt = '') {
  const root = lang === 'zh' ? '../../' : '../../../';
  const index = books.indexOf(book);
  const previous = books[(index + books.length - 1) % books.length];
  const next = books[(index + 1) % books.length];
  const cover = `${root}covers/${book.id}-${lang}.webp`;
  const raw = `${root}previews/${book.id}.webp`;
  const body = `<main id="main" class="detail-main"><a class="back-link" href="${root}${prefix(lang)}#collection">← ${t(lang, '返回封面集', 'Back to the collection')}</a><div class="detail-layout"><div class="detail-display"><div class="display-modes" role="group" aria-label="${t(lang, '查看图层', 'View artwork layers')}"><button type="button" data-view="cover" aria-pressed="true">${t(lang, '排版封面', 'Typeset cover')}</button><button type="button" data-view="art" aria-pressed="false">${t(lang, '插画原图', 'Artwork only')}</button></div><img id="cover-preview" src="${cover}" data-cover="${cover}" data-art="${raw}" width="1024" height="1536" alt="${h(book.alt[lang])}" fetchpriority="high"><p class="display-caption">2:3 &nbsp; / &nbsp; 1024 × 1536 &nbsp; / &nbsp; ${t(lang, '暖白纸面', 'WARM IVORY PAPER')}</p></div><div class="detail-copy"><p class="eyebrow">VOL. 01 &nbsp; / &nbsp; ${book.number}</p><h1>${h(book.title[lang])}</h1><p class="detail-subtitle">${h(book.title[lang === 'zh' ? 'en' : 'zh'])} <span>·</span> ${h(book.author[lang])}</p><p class="detail-mood">${h(book.mood[lang])}</p><p class="detail-concept">${h(book.concept[lang])}</p><p class="detail-restraint">${h(book.restraint[lang])}</p><div class="palette" aria-label="${t(lang, '主色参考', 'Palette reference')}">${book.palette.map((c) => `<span><i style="background:${c}" aria-hidden="true"></i>${c.toUpperCase()}</span>`).join('')}</div><div class="download-links"><a class="download-primary" href="${root}downloads/${book.id}-${lang}.png" download>${t(lang, '下载中文封面', 'Download English cover')} ${arrow}</a><a href="${root}downloads/${book.id}-${lang === 'zh' ? 'en' : 'zh'}.png" download>${t(lang, '英文封面', 'Chinese cover')} ↗</a><a href="${root}artwork/${book.id}.png" download>${t(lang, '无字插画', 'Text-free artwork')} ↗</a></div><p class="edition-note">${t(lang, '独立封面设计实验，非出版社版本。插画由 AI 生成，书名与作者由代码排版。', 'An independent cover study, not a publisher edition. Illustration generated with AI; title and author typeset in code.')}</p><details class="prompt-details"><summary>${t(lang, '提示词与生成记录', 'Prompt & generation notes')}</summary><p>${t(lang, '生成日期', 'Generated')}: ${book.generation.date}<br>${t(lang, '工具：OpenAI 内置生图；工具未提供具体模型版本。', 'Tool: OpenAI built-in image generation; exact model version not exposed by the tool.')}</p><pre id="prompt-text">${h(prompt)}</pre><button class="copy-button" type="button" data-copy="${h(prompt)}">${t(lang, '复制提示词', 'Copy prompt')}</button><a class="prompt-file" href="${root}prompts/${book.id}.txt" download>${t(lang, '下载 TXT', 'Download TXT')}</a>${revisionPrompt ? `<h3>${t(lang, '一次局部修正', 'A targeted revision')}</h3><p>${t(lang, '首稿占用了作者署名区。保留构图，用生图编辑清出底部留白。', 'The first draft invaded the author margin. An image edit cleared the lower edge while preserving the composition.')}</p><a href="${root}process/${book.id}-v1.png">${t(lang, '查看首稿', 'View the first draft')} ↗</a><pre>${h(revisionPrompt)}</pre>` : ''}</details></div></div><nav class="book-pagination" aria-label="${t(lang, '浏览其他封面', 'Browse covers')}"><a href="${root}${bookPath(previous, lang)}"><small>← ${t(lang, '上一篇', 'Previous')}</small><span>${h(previous.title[lang])}</span></a><a href="${root}${bookPath(next, lang)}"><small>${t(lang, '下一篇', 'Next')} →</small><span>${h(next.title[lang])}</span></a></nav></main>`;
  return shell({
    lang,
    root,
    path: `books/${book.id}/`,
    title: `${book.title[lang]} — Book Covers`,
    description: book.concept[lang],
    body,
  });
}

# Quiet Covers · 纸间

**A book, distilled to one image.**

[Live collection](https://zjuzhiyucai.github.io/quiet-covers/en/) · [中文](README.md) · [The skill](skills/quiet-book-covers/SKILL.md) · [Downloads](https://github.com/ZJUZhiyuCai/quiet-covers/releases/latest)

![Quiet Covers — artwork, prompts and an agent skill](press/github-cover.png)

An open literary-cover experiment built around warm paper, restrained ink and narrative space. The first collection contains **10 generated illustrations and 20 Chinese/English typeset covers**, together with a reusable agent skill.

A path through heavy earth. Railway tracks into winter. A small boat within a large sea. Begin with an emotional relationship, then choose what to draw.

## What is included

- A bilingual static gallery with a permanent page for every cover.
- Original text-free artwork, design briefs, exact prompts and generation provenance.
- An independently installable [quiet-book-covers skill](skills/quiet-book-covers/SKILL.md), including four visual references and a review method.
- A deterministic typesetting pipeline. Titles and author names use licensed font outlines, not AI-generated lettering.
- Four 1440 × 1920 presentation sheets and a wide project banner in [press/](press/).

The illustrations were made with OpenAI's built-in image-generation tool. Generation is stochastic: the process and actual outputs are shared, but identical prompts do not guarantee identical pixels. The gallery has no generation API, backend account or API-key requirement.

## Volume 01 — Stories & space

| Chinese literature | World literature |
|---|---|
| Ordinary World — Lu Yao | The Count of Monte Cristo — Alexandre Dumas |
| Border Town — Shen Congwen | How the Steel Was Tempered — Nikolai Ostrovsky |
| White Horse Neighs in the West Wind — Jin Yong | The Old Man and the Sea — Ernest Hemingway |
| Dream of the Red Chamber — Cao Xueqin | The Metamorphosis — Franz Kafka |
| Rickshaw Boy — Lao She | To the Lighthouse — Virginia Woolf |

Four founding studies came from the author's personal-library design exploration; six were created for this project. These are independent interpretations, not publisher editions. No novel text is included.

## Install the skill

The skill itself needs no Node runtime. Download `quiet-book-covers-v1.0.0.zip` from the latest release and place the enclosed `quiet-book-covers` directory in your agent's skills directory. Codex defaults to `~/.codex/skills/`, or `$CODEX_HOME/skills/` when configured.

Alternatively, with Node.js 22+:

```sh
git clone https://github.com/ZJUZhiyuCai/quiet-covers.git
cd quiet-covers
npm ci
npm run skill:install
```

Existing installations are preserved. After reviewing local edits, use `npm run skill:install -- --force` to update. Reload your agent session, then try:

```text
Use $quiet-book-covers to design a cover for To the Lighthouse.
Keep the lighthouse small and let distance carry the emotion.
Deliver the artwork, English cover and exact generation prompt.
```

Other agents that support directory-based skills can read the same folder. Actual image generation and export depend on the host's capabilities. Without an image tool, the skill produces a finished prompt and reports that the image remains ungenerated.

## Run and export

```sh
npm ci
npm run dev                 # http://127.0.0.1:4187/
npm test                    # content, typography, source integrity, HTTP behavior
npm run build               # static gallery + previews + twenty PNG covers
npm run export              # press sheets and banner → output/
npm run export -- --book ordinary-world --lang en
npm run export -- --book border-town --lang zh --width 2048
```

Builds and exports run offline after dependency installation. The dev server builds once on startup; after editing, run `npm run build` and reload. Set `PORT` to change the preview port.

Source images are 1024 × 1536. A larger export scales the illustration; it does not invent higher-resolution detail. See `npm run export -- --help` for options.

## Make another cover

Use the skill to write an emotional and spatial brief, then generate a text-free image. Save it under `artwork/`, retain the exact prompt in `prompts/`, and add a bilingual record to `catalog.json`, including deliberate title line breaks and the source SHA-256. Run the checks and inspect both the full cover and a 180 px thumbnail.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [design notes](docs/design.md) for the decisions behind the project. Source images are kept intact. Two first drafts and their targeted margin revisions are retained as process evidence.

## Implementation

Static HTML/CSS with a small progressive-enhancement script; no client framework or analytics. Every work has a real page and direct downloads. The renderer uses `fontkit` for glyph outlines and `sharp` for compositing. Noto Serif SC supplies both Chinese and Latin glyphs; `subset-font` produces a small gallery WOFF2. Builds validate artwork checksums and local links. GitHub Actions tests and deploys to GitHub Pages.

## Reuse and credits

Code, prompts and skill instructions: [MIT](LICENSE). Original generated artwork and derivatives: [CC BY 4.0](LICENSE-ARTWORK), to the extent rights can be licensed. Font: [OFL 1.1](fonts/OFL.txt). See [ASSETS.md](ASSETS.md) for provenance, limitations and suggested credit.

Created and curated by [Zhiyu Cai](https://caizhiyu.com/). Typography: [Noto Serif SC / Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoserifsc).

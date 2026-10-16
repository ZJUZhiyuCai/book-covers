# Book Covers

**A book, distilled to one image.**

[Gallery](https://zjuzhiyucai.github.io/book-covers/en/) · [简体中文](README.md) · [Install](INSTALL.md) · [Releases](https://github.com/ZJUZhiyuCai/book-covers/releases)

![Book Covers](press/github-cover.png)

An open literary-cover experiment: warm paper, spare printed scenes and separately composed Chinese and English typography. The first collection contains **10 generated illustrations and 20 typeset covers**, plus an independently installable agent skill.

## Three default outputs

| Output | What it contains |
|---|---|
| Text-free PNG | The intact selected generated illustration |
| Typeset PNG | Exact title and author composed from font files, not image-generated letters |
| Generation prompt | Complete copyable text, also delivered as a TXT file |

A single-language brief produces exactly three files. A bilingual brief adds a second typeset PNG while sharing the artwork and prompt. Each gallery page exposes all three output types directly. Editable plans, receipts and WebP previews are optional working materials.

## Install with your agent

```text
Please install the Book Covers skill:
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
Use your native installer and include references and runtime.
Preserve local edits before updating. Tell me how to invoke it.
```

Codex can use its built-in skill installer. There is no manual ZIP download or full gallery checkout. After the host refreshes skill discovery, try:

```text
Use $book-covers to design an English cover for Ordinary World by Lu Yao.
Deliver text-free PNG, deterministically typeset PNG, and a copyable generation prompt.
```

Other compatible agents can use their native installer or the [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add ZJUZhiyuCai/book-covers --skill book-covers
```

Creation needs the host's image generation and local execution. The portable renderer needs Node.js 22+; the agent prepares npm dependencies and downloads only required fonts from pinned, checksum-verified sources. No system font installation. Subsequent composition can run offline. See [installation verification](INSTALL.md) and [runtime usage](skills/book-covers/references/runtime.md). The skill does not install an image model or credentials.

## Typography and the collection

The approved anchors are Dream of the Red Chamber, Border Town, To the Lighthouse and White Horse Neighs in the West Wind: vertical rhythm, open short titles, roman/italic phrasing and controlled brush strokes. Chinese main titles keep equal character size and weight across lines. Spacing, axes and negative space create the variation.

v1.4 revises Chinese settings for Ordinary World, The Count of Monte Cristo and How the Steel Was Tempered, plus the English setting for The Old Man and the Sea. All original artwork and the eight approved bilingual anchor covers are preserved. The earlier generated-lettering experiment remains in `process/generated-lettering/` as history, outside the default workflow.

The other works are Rickshaw Boy and The Metamorphosis. These are independent interpretations, not publisher editions or novel texts. Illustrations use OpenAI's built-in image tool; its exact model version was not exposed. Prompts reproduce a process, not guaranteed identical pixels.

[Typography guide](skills/book-covers/references/typography.md) · [Design and limits](docs/design.md) · [Adversarial review](docs/review-v1.4.0.md)

## Run and export

```sh
npm ci
npm run dev                 # http://127.0.0.1:4187/
npm test                    # content, layout, output contract, input safety, HTTP behavior
npm run build               # gallery, twenty typeset PNGs, artwork and prompt downloads
npm run export              # five portrait sheets and a banner → output/
npm run compose -- --spec examples/complete-cover.json --out output/custom
```

Builds run offline after dependencies are prepared. The dev server builds once at startup; rebuild and reload after editing. Set `PORT` to change the port.

`compose` accepts books outside the gallery. Copy the example spec, specify the requested languages and exact title/author, and provide artwork and prompt paths relative to that JSON file. Defaults are the three output types; use `--webp` or `--receipt audit.json` for optional extras. Existing outputs require `--force`; source inputs remain protected even then.

Source images are 1024 × 1536. Upscaling does not add illustration detail. These are screen-resolution front-cover studies, without print bleed, spine or colour-proofing.

## Contribute and reuse

See [CONTRIBUTING.md](CONTRIBUTING.md). Preserve actual generation/edit records and source checksums. The gallery and installed skill share one renderer: fontkit outlines real glyphs and sharp composites them. Local links, source integrity and actual ink bounds are checked before publishing. Static HTML/CSS and small progressive enhancements; no analytics or generation backend.

Code, prompts and skill instructions: [MIT](LICENSE). Original artwork and derivatives: [CC BY 4.0](LICENSE-ARTWORK), to the extent rights can be licensed. Fonts: [OFL](fonts/OFL.txt), with original notices bundled in the repository and skill. See [ASSETS.md](ASSETS.md).

Created and curated by [Zhiyu Cai](https://caizhiyu.com/).

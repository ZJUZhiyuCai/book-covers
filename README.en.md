# Book Covers

**A book, distilled to one image.**

[Gallery](https://zjuzhiyucai.github.io/book-covers/en/) · [简体中文](README.md) · [Install and use](#install-and-use) · [Releases](https://github.com/ZJUZhiyuCai/book-covers/releases)

![Book Covers — Literary covers, prompts and a reusable skill](press/github-cover.png)

Book Covers is an open collection of literary covers and a standalone agent skill. It pairs generated illustrations with titles and author names composed from real font files, giving the image and the lettering a deliberate place in the design.

The current skill is **version 1.4.0**, with two volumes containing **20 generated illustrations and 40 Chinese and English covers**. Warm paper, spare ink colours and open compositions give the series its visual character. Browse and download the work in the gallery, or install the skill in your own agent to design covers for other books.

## What you get

| Output            | Contents                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| Text-free PNG     | The selected generated illustration, preserved intact                    |
| Typeset PNG       | The illustration with its title and author rendered from real font files |
| Generation prompt | Complete copyable text, also supplied as a UTF-8 TXT file                |

A cover in one language produces three files. A bilingual brief shares the artwork and prompt, with a separate typeset cover for each language: four files in three categories. Every book page has download links and a prompt-copying control. Layout specs, WebP previews and provenance records are optional extras.

## Install and use

Send this request to Codex or another agent that supports Skills:

```text
Please install the Book Covers skill:
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
Use your native skill installer and include references and runtime.
If already installed, preserve local edits before updating. Tell me how to invoke it.
```

Codex can use its built-in `skill-installer`; no manual ZIP download or full gallery checkout is needed. Follow your agent's instructions to refresh its skill list, then try:

```text
Use $book-covers to design an English cover for Ordinary World by Lu Yao.
Deliver the text-free PNG, a cover typeset with real fonts, and a copyable generation prompt.
```

Other compatible agents can also use the [Skills CLI](https://github.com/vercel-labs/skills):

```sh
npx skills add ZJUZhiyuCai/book-covers --skill book-covers
```

### Requirements

- **Image generation:** supplied by the host agent. The skill includes creative guidance, reference images and a renderer, but no image model or API credits.
- **Local execution:** the renderer needs Node.js 22+ and npm. The agent prepares its dependencies.
- **Font files:** the renderer downloads pinned open-source fonts as needed and verifies their checksums. No system font installation or manual file search is required. Once dependencies and the fonts needed for a cover are cached, typesetting can run offline.

See [installation details](INSTALL.md) and [runtime usage](skills/book-covers/references/runtime.md).

## Image and type

Each cover begins with a spatial relationship: a path leading to a cave dwelling in the loess hills, or a white horse crossing a broad dune. A few forms carry the story's mood; the empty space leaves room for the title and the reader.

Restraint serves the story. Judge a cover by its sense of place, scale and typography, rather than by how few elements remain. A little paper texture can contribute to the image; texture that competes with the subject needs editing. Review the covers together too: a new colour or prop alone does not make a composition distinct.

Most Chinese titles use Zhuque Fangsong, while _White Horse Neighs in the West Wind_ uses the brush forms of Ma Shan Zheng. Characters in a Chinese main title keep the same size and weight, with rhythm shaped by spacing, line breaks and alignment. English titles use Cormorant Garamond roman and its separately drawn italic, with hierarchy following the phrasing.

The vertical title of _Dream of the Red Chamber_, the open spacing of _Border Town_, the roman/italic pairing of _To the Lighthouse_ and the brush strokes of _White Horse_ show how the typography can vary within a series.

[Art direction](skills/book-covers/references/art-direction.md) · [Typography guide](skills/book-covers/references/typography.md) · [Design decisions and limits](docs/design.md) · [Review](docs/review-v1.4.0.md)

## Volume I: Stories and space

| Chinese literature                               | International titles                             |
| ------------------------------------------------ | ------------------------------------------------ |
| _Ordinary World_ · Lu Yao                        | _The Count of Monte Cristo_ · Alexandre Dumas    |
| _Border Town_ · Shen Congwen                     | _How the Steel Was Tempered_ · Nikolai Ostrovsky |
| _White Horse Neighs in the West Wind_ · Jin Yong | _The Old Man and the Sea_ · Ernest Hemingway     |
| _Dream of the Red Chamber_ · Cao Xueqin          | _The Metamorphosis_ · Franz Kafka                |
| _Rickshaw Boy_ · Lao She                         | _To the Lighthouse_ · Virginia Woolf             |

These are independent cover studies, not publisher editions, and contain no novel texts. The illustrations were made with OpenAI's built-in image tool, which did not expose a specific model version. The repository preserves the original images and actual prompts; reusing a prompt will not necessarily reproduce the same image.

## Volume II: Everyday echoes

| Chinese literature                        | International titles                                     |
| ----------------------------------------- | -------------------------------------------------------- |
| _To Live_ · Yu Hua                        | _The Moon and Sixpence_ · W. Somerset Maugham            |
| _Fortress Besieged_ · Qian Zhongshu       | _One Hundred Years of Solitude_ · Gabriel García Márquez |
| _Tales of Hulan River_ · Xiao Hong        | _Snow Country_ · Yasunari Kawabata                       |
| _My Memories of Old Beijing_ · Lin Haiyin | _Pride and Prejudice_ · Jane Austen                      |
| _Call to Arms_ · Lu Xun                   | _Letter from an Unknown Woman_ · Stefan Zweig            |

[Browse Volume II](https://zjuzhiyucai.github.io/book-covers/en/?shelf=volume-2#collection) · [Ten-cover stability observations](docs/stability/vol-02/README.en.md)

![The ten English covers in Volume II](docs/stability/vol-02/thumbnails-en.jpg)

## Observed results and current limits

On 16 October 2026, ten works were produced with unchanged Skill 1.4.0. The agent developed a visual brief and type plan for each book, then reviewed the generated results. The record includes editorial selection and revision.

| Check                         | Result in this batch                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| Illustration generation       | 10 new generations, plus one simplification edit to _Fortress Besieged_                    |
| Bilingual typesetting         | All 20 initial layouts exported successfully, without changes to the type plans            |
| Same-environment repeat       | With fixed artwork, fonts and settings, all 40 delivery files had identical SHA-256 hashes |
| Skill and gallery consistency | All 20 typeset PNGs and 10 prompt files matched                                            |

**Typography and file delivery were consistent; the images still need individual judgment.** Some covers have excess texture, similar compositions or imprecise whitespace. The notes retain reservations about _My Memories of Old Beijing_ and _One Hundred Years of Solitude_. The gallery's _The Moon and Sixpence_ has since been [redesigned following reader feedback](docs/revisions/moon-sixpence-2026-10-16.md); the other covers retain their selected versions. The thumbnails and measurements above remain a record of the original trial.

Repeating typography on saved artwork does not mean a fresh image generation will reproduce it. Nor do ten examples establish a success rate for other books, image models or environments. The [full observations](docs/stability/vol-02/README.en.md) include actual prompts, revisions, checksums and replay specs.

## Local development and export

To work on the gallery or compose a cover from the command line, clone the repository and run these commands from its root:

```sh
npm ci
npm run dev                 # Local preview: http://127.0.0.1:4187/
npm test                    # Check catalog, layout, file protection and local server
npm run build               # Build the gallery, covers and prompt downloads
npm run export              # Seven portrait sheets and a banner → output/
npm run compose -- --spec examples/complete-cover.json --out output/custom
```

The dev server builds once at startup. After editing, run `npm run build` and reload the browser. Use `PORT=4190 npm run dev` to choose another port. Gallery builds and exports run offline once dependencies are installed.

For a book outside the collection, copy the [example spec](examples/complete-cover.json), supply the title, author and line breaks, and set artwork and prompt paths relative to the JSON file. The three output categories are the default; `--webp` adds 640 × 960 previews, and `--receipt audit.json` saves checksums and font provenance. Existing outputs are protected unless `--force` is used; input files remain protected even then.

Source images are **1024 × 1536 pixels**, intended for screen display. Upscaling does not add illustration detail. Print preparation—including trim size, bleed, spine and colour-proofing—is outside the current scope.

## Structure and contributions

New books and design ideas are welcome. The [contribution guide](CONTRIBUTING.md) explains how to preserve actual prompts, original images and revision records. Each new cover should find a literary space of its own.

```text
skills/book-covers/  Standalone skill, reference images and renderer
catalog.json        Bilingual metadata, design notes, type plans and source checksums
artwork/            Original generated illustrations
prompts/            Actual generation and revision prompts
process/            Past revisions, experimental inputs and evidence
src/                Static page templates, styles and interactions
scripts/            Build, composition, export and local preview
press/              Shareable collection images
fonts/              Font files, sources and OFL licenses
tests/              Content, layout, file protection and server checks
```

The gallery uses static HTML/CSS and a little JavaScript, with no analytics or online generation backend. It shares a renderer with the skill: `fontkit` extracts glyph outlines and `sharp` composites PNGs, with actual ink bounds checked for clipping and overlap. `subset-font` creates WOFF2 subsets for the interface; GitHub Actions handles tests, builds and deployment.

## License and credits

- Code, prompts and skill instructions: [MIT](LICENSE).
- Original artwork and derivatives: [CC BY 4.0](LICENSE-ARTWORK), to the extent rights can be licensed.
- Fonts: [SIL Open Font License 1.1](fonts/OFL.txt), with original notices included in the repository and skill.

See [ASSETS.md](ASSETS.md) for sources and attribution details.

Created and curated by Zhiyu Cai. Contact: [22519085@zju.edu.cn](mailto:22519085@zju.edu.cn).

# Asset provenance and reuse

All ten illustrations in `artwork/` were generated with OpenAI's built-in image-generation tool for this project or its founding personal-library studies, under Zhiyu Cai's art direction. The exact model version was not exposed by the tool. No publisher covers, novel passages or personal photographs are bundled.

`catalog.json` records each selected image's SHA-256, creation date, prompt path and origin. Four founding studies were selected from Zhiyu Cai's personal website; six are new studies for Book Covers. Two first drafts are retained in `process/`, alongside their revision prompt in `prompts/margin-revision.txt`. Re-running a prompt does not guarantee identical pixels.

## Licenses

| Material | License |
|---|---|
| Code, prompts, written design briefs and skill instructions | [MIT](LICENSE) |
| Original generated illustrations and their derivatives in `artwork/`, `process/`, `press/`, skill reference images and generated cover downloads | [CC BY 4.0](LICENSE-ARTWORK), to the extent the contributor holds rights that can be licensed |
| Noto Serif SC font and subsets | [SIL Open Font License 1.1](fonts/OFL.txt) |
| Zhuque Fangsong, Cormorant Garamond (roman and italic), Ma Shan Zheng | Their respective OFL notices under `fonts/zhuque/`, `fonts/cormorant/`, `fonts/mashanzheng/` |

Suggested artwork credit: **Book Covers — Zhiyu Cai, AI-generated illustration, CC BY 4.0.** Link to this repository and identify changes when reusing the artwork under that license. This notice does not assert exclusive copyright in wholly machine-generated elements or grant rights in the underlying literary works, authors' names or any third-party marks.

The covers are independent visual interpretations. They are not official editions, endorsements or covers supplied by the authors or publishers. English title wording is editorial metadata; it does not identify a particular published translation.

## Font source

Noto Serif SC is distributed by [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoserifsc), with upstream metadata preserved in `fonts/UPSTREAM.pb`. It supplies interface and promotional copy; the build makes a smaller WOFF2 subset for the static gallery.

The v1.1 cover layer adds [Zhuque Fangsong](https://github.com/TrionesType/zhuque) preview v0.212 by TrionesType, [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) roman and italic by Christian Thalmann, and [Ma Shan Zheng](https://github.com/google/fonts/tree/main/ofl/mashanzheng) for selected brush titles. Google Fonts distributes the latter two; their metadata and original OFL notices are kept beside the font files. Original bytes, source URLs and SHA-256 hashes are listed in `fonts/SOURCES.json`. No system or proprietary fonts are redistributed.

`process/typography-v1/` contains two 640 × 960 WebP derivatives of the public v1.0.0 covers, retained solely for the before/after typography sheet. The updated `press/` sheets and the skill's `references/images/typography.jpg` use the same generated illustration originals with a new, separately rendered text layer. They are derivatives under the artwork license above. Source illustration hashes are unchanged.

`process/generated-lettering/ordinary-world-zh.png` is a complete image-generation edit made on 2026-10-16 from the original Ordinary World artwork. Its title, subtitle, author and imprint are generated pixels, not named font outlines. The exact prompt and provenance are linked in that directory; it demonstrates the optional no-font route and is not the gallery default. It uses the artwork license above.

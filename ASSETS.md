# Asset provenance and reuse

All ten illustrations in `artwork/` were generated with OpenAI's built-in image-generation tool for this project or its founding personal-library studies, under Zhiyu Cai's art direction. The exact model version was not exposed by the tool. No publisher covers, novel passages or personal photographs are bundled.

`catalog.json` records each selected image's SHA-256, creation date, prompt path and origin. Four founding studies were selected from Zhiyu Cai's personal website; six are new studies for Quiet Covers. Two first drafts are retained in `process/`, alongside their revision prompt in `prompts/margin-revision.txt`. Re-running a prompt does not guarantee identical pixels.

## Licenses

| Material | License |
|---|---|
| Code, prompts, written design briefs and skill instructions | [MIT](LICENSE) |
| Original generated illustrations and their derivatives in `artwork/`, `process/`, `press/`, skill reference images and generated cover downloads | [CC BY 4.0](LICENSE-ARTWORK), to the extent the contributor holds rights that can be licensed |
| Noto Serif SC font and subsets | [SIL Open Font License 1.1](fonts/OFL.txt) |

Suggested artwork credit: **Quiet Covers — Zhiyu Cai, AI-generated illustration, CC BY 4.0.** Link to this repository and identify changes when reusing the artwork under that license. This notice does not assert exclusive copyright in wholly machine-generated elements or grant rights in the underlying literary works, authors' names or any third-party marks.

The covers are independent visual interpretations. They are not official editions, endorsements or covers supplied by the authors or publishers. English title wording is editorial metadata; it does not identify a particular published translation.

## Font source

Noto Serif SC is distributed by [Google Fonts](https://github.com/google/fonts/tree/main/ofl/notoserifsc), with upstream metadata preserved in `fonts/UPSTREAM.pb`. The original variable font is retained for complete glyph coverage in exported covers; the build makes a smaller WOFF2 subset for the static gallery. No system or proprietary fonts are redistributed.

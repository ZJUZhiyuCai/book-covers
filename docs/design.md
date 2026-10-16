# Book Covers: design decisions

**Visual thesis:** warm paper and spare printed landscapes turn a literary shelf into a quiet, browsable exhibition.

**Content plan:** one cover-led opening → ten works → a short explanation of the method → an installable skill. Each cover has a permanent page with three direct output types: original text-free PNG, typeset PNG and a copyable prompt recipe. Historical generation/edit prompts remain separately available.

**Interaction thesis:** a brief staggered arrival of the opening covers, a subtle lift that identifies clickable artwork, and a cover/artwork toggle that makes the separation of illustration and typography tangible. Respect reduced-motion preferences. No autoplay, scroll trapping or canvas-only content.

The four founding studies were selected by Zhiyu Cai. Six new works test the same visual language across different narrative spaces. All illustrations are AI-generated; briefs, selection, revisions and typesetting form the design process. These are interpretations, not publisher editions.

The gallery has no client framework, analytics, API keys or image-generation backend. `catalog.json` supplies multilingual content and per-language type plans. Build-time glyph outlines preserve selected letterforms and positions; native rasterizers can still produce tiny antialiasing differences across systems. The interface font is subsetted for the gallery; original OFL font files are retained for exports.

## Typography revision, v1.1

The first version put title, translation and author in a single body-oriented serif. Its type read more like annotation than cover design. The revised covers choose faces per script: Zhuque Fangsong for most Chinese titles, Ma Shan Zheng for the written gesture of White Horse, and Cormorant Garamond roman/true italic for English. Author names have larger, deliberate settings.

The collection shares paper, margins and imprint but varies the title silhouette: stepped Chinese phrases, open short titles, a few upright vertical columns, and English phrase hierarchies. All wording stays in `titleLines`; editable `typography` plans carry each language's composition. Optical bounds include italic overhangs and CJK sidebearings. Before/after comparisons retain identical illustration content. See [the reusable typography reference](../skills/book-covers/references/typography.md).

Source illustrations stay intact. WebP previews are resized derivatives; PNG jackets add separately rendered title and author typography. Two new illustrations needed image-tool revisions to restore a clear author margin; their original drafts and revision prompt remain in `process/` and `prompts/`.

## Historical step: agent installation and equal-scale titles · v1.3 (superseded workflow)

The primary entry is a copyable natural-language installation request pointing to the skill directory. Codex uses its native installer; other compatible agents can use their installer or the open Skills CLI. No gallery checkout or system font setup is required to use the skill.

A Chinese title is one typographic unit: fit every line at the same size rather than promoting individual words. The reference renderer uses bundled font files directly and fits Chinese lines together. When local layout is unavailable, the standalone skill can generate lettering with the illustration and must check exact wording in the actual output. The no-font Ordinary World demonstration has separate provenance and does not replace the gallery original.

## Current direction · v1.4

The default contract is three outputs: intact generated artwork, deterministically typeset cover and a complete copyable generation prompt. Generated lettering remains a historical experiment; font preparation is handled by a portable runtime with pinned downloads, not by changing the production route. A single-language brief no longer needs a fictional translation or gallery imprint.

The user's approved typography anchors are Red Chamber, Border Town, To the Lighthouse and White Horse. Their eight bilingual settings stay unchanged. Ordinary World now reads as one equal-scale line; Monte Cristo uses upright columns with the island below; Steel aligns its two lines to the railway's axis; the English Old Man and the Sea avoids an overemphasised connective phrase. These are targeted judgments, not a claim that a single template will solve all books.

### Learning from established designers

Coralie Bickford-Smith describes a consistent grid supporting a large Penguin English Library series. Our inference: keep stable series bones but vary the title silhouette and narrative relationship. [Designer interview, Penguin](https://www.penguin.co.uk/discover/articles/coralie-bickford-smith-penguin-english-library).

Faber's typographic poetry series gives letterforms a strong visual role. Our inference: a title should carry part of the cover's identity, rather than merely label a landscape. This does not mean copying those covers or adding decorative type indiscriminately. [Faber typographic poetry covers](https://www.faber.co.uk/product-category/poetry/typographic-poetry-covers/).

### What remains limited

The quiet-top/scene-below structure is coherent but can become predictable across many works. Fonts are expressive existing families rather than custom-drawn title lettering; longer authors still need careful small-size review. The renderer checks geometry, not meaning, contrast against a complex illustration or aesthetic excellence. New briefs need human or agent visual judgment and selective image revisions. The 1024 × 1536 front covers are screen studies, not complete print jackets.

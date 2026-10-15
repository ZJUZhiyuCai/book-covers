# Quiet Covers v1.2.0 · Complete covers by default

Book-cover requests now require a finished image with its exact title and author. A text-free illustration is an intermediate source layer; it is delivered alone only when explicitly requested. The skill plans typography before generation, reviews the combined composition and previews the actual final export. Bilingual projects receive independently composed Chinese and English covers.

The new `npm run compose -- --spec book.json --out covers` command applies the same typography system to books outside the public catalog. It produces complete Chinese and English PNGs, WebP previews and a provenance receipt. Start from `examples/complete-cover.json`. Both languages are validated before files are written; missing authors, altered title text, missing glyphs, overlapping lettering and wrong source dimensions are rejected. Existing outputs require an explicit `--force`.

The first collection's ten illustrations and twenty typeset covers remain intact. This release changes the delivery contract and makes the existing typography pipeline reusable. Websites can copy the finished images without depending on this repository at runtime.

The standalone skill package includes the updated requirements, generation template, typography guidance and invocation prompt. Node.js is only needed for this repository's optional renderer.

# Release verification

Current verification: [v1.4 review](review-v1.4.0.md). The sections below are historical evidence, not current workflow instructions.

Local checks for v1.0 performed on 2026-10-16 (Asia/Shanghai):

- `npm test`: eight passing tests, covering bilingual metadata, source hashes, rendering bounds, missing glyphs, unchanged illustration pixels and HTTP behavior.
- `npm run build`: ten studies, twenty downloadable PNG covers and twenty-three HTML files; all local links resolve. The gallery font subset is about 216 KiB.
- The official skill-creator validator accepted `skills/quiet-book-covers/`; local installation also passed validation.
- Browser review at desktop width 1280 and mobile width 390: no horizontal overflow; covers retain their 2:3 proportions; Chinese/World filters each show five entries; language switching stays on the corresponding book; artwork/typeset toggles work.
- A real English PNG download was compared with the build output by SHA-256.
- Secondary UI text was darkened to `#62665e`; contrast against the three light surfaces is 4.67:1–5.16:1.
- Four 1440 × 1920 promotional sheets and the 1800 × 900 banner were generated. The introduction sheet, layer breakdown and banner were visually inspected.

The image-generation process was reviewed visually rather than scored by an invented metric. Checks do not establish literary consensus or guarantee future model output. New images still require art-direction review.

GitHub Actions repeats the automated tests and build on the published source; its actual run status is visible in the repository. The two main licenses and the font's OFL notice travel with the corresponding release packages.

## v1.1 typography revision

- Nine automated tests pass. Layout checks now use actual glyph ink bounds, cover all twenty layouts, reject collisions and retain exact title and author text. Vertical Chinese reading order is checked separately.
- All ten illustration SHA-256 hashes remain unchanged; the image-region pixel invariant still passes.
- Twenty revised covers were inspected together at 180 px width. The Chinese and English Ordinary World, White Horse, Monte Cristo and Red Chamber covers were also compared at a larger size.
- Build output remains twenty PNG downloads and twenty-three HTML pages. The interface font subset is about 214 KiB.
- The typography skill reference includes a six-cover specimen; original font files have provenance hashes and their OFL notices. The skill validator accepts the revised package.
- A fifth promotional sheet compares the v1.0 and v1.1 text layers on the same illustrations.

## v1.2 complete-cover delivery

- Eleven tests pass, including the new external composition workflow. Both languages require exact titles and authors; tests inspect exported title and author pixels, intact source artwork, WebP dimensions and accidental-overwrite protection.
- Runtime composition now rejects overlapping lettering and incorrectly sized source images. The existing twenty layouts still pass; all ten original illustration hashes are unchanged.
- The skill validator passes. The skill now makes the combined, typeset image the default deliverable, with raw artwork explicitly an intermediate layer. The locally installed copy matches the repository.
- The new CLI was also used for nine independent website books: eighteen complete covers, including two newly generated illustrations. Chinese desktop and English mobile previews were inspected at 1280 px and 390 px, with all nine correct-language covers loaded and no horizontal overflow. The consuming website uses exported WebP files and has no runtime dependency on this project.

## v1.3 agent installation and Chinese title scale

- Twelve tests pass. New assertions cover equal size and weight across Chinese title lines, group fitting when one line is constrained, and rejection of conflicting Chinese sizes. English phrase hierarchy and all illustration hash/pixel checks remain intact.
- The open Skills CLI discovered the single `book-covers` skill and installed a complete copy for Claude Code into an isolated project directory. No global Claude Code configuration was changed.
- The gallery's copy button placed the complete GitHub skill-directory installation prompt on the browser clipboard and displayed its success state. At 390 px, the installation block fits within the viewport with no horizontal overflow.
- A complete image-generated Ordinary World cover was visually checked for the exact strings `平凡的世界`, `Ordinary World` and `路遥`, with equal-sized Chinese characters. Its prompt, source and output hashes are recorded in `process/generated-lettering/provenance.json`. This single example demonstrates the no-font route; it is not a guarantee of spelling accuracy in future generations.
- Five Chinese covers for the independent personal website were re-exported with equal title sizes; the nine English exports are byte-identical to their previous versions. The source illustrations and reading links are preserved.

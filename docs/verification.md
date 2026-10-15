# Release verification

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

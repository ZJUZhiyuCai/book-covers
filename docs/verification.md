# Release verification

Local checks performed on 2026-10-16 (Asia/Shanghai):

- `npm test`: eight passing tests, covering bilingual metadata, source hashes, rendering bounds, missing glyphs, unchanged illustration pixels and HTTP behavior.
- `npm run build`: ten studies, twenty downloadable PNG covers and twenty-three HTML files; all local links resolve. The gallery font subset is about 216 KiB.
- The official skill-creator validator accepted `skills/quiet-book-covers/`; local installation also passed validation.
- Browser review at desktop width 1280 and mobile width 390: no horizontal overflow; covers retain their 2:3 proportions; Chinese/World filters each show five entries; language switching stays on the corresponding book; artwork/typeset toggles work.
- A real English PNG download was compared with the build output by SHA-256.
- Four 1440 × 1920 promotional sheets and the 1800 × 900 banner were generated. The introduction sheet, layer breakdown and banner were visually inspected.

The image-generation process was reviewed visually rather than scored by an invented metric. Checks do not establish literary consensus or guarantee future model output. New images still require art-direction review.

GitHub Actions repeats the automated tests and build on the published source; its actual run status is visible in the repository. The two main licenses and the font's OFL notice travel with the corresponding release packages.

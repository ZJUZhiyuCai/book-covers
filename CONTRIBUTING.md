# Contributing a cover

Propose a work and a visual relationship, not just a collection of objects. Read the [skill](skills/quiet-book-covers/SKILL.md) and inspect the founding studies before generating.

1. Make a text-free 1024 × 1536 PNG. Keep the source image intact and save it under `artwork/<slug>.png`.
2. Add the full actual prompt to `prompts/<slug>.txt`. If you revise an image, preserve the relevant input and edit prompt.
3. Add one bilingual entry to `catalog.json`: title, author, deliberate title line breaks, emotional tension, composition, exclusions, alt text, two palette references and generation provenance. Record the source's SHA-256 (`shasum -a 256 artwork/<slug>.png`). Do not claim an unreported model version.
4. Run `npm test`, `npm run build`, and inspect both languages at full size and at 180 px wide. The gallery should work on a narrow phone and with keyboard navigation.
5. Open a PR with the image, a short design explanation and the generation/edit record. Contributor-supplied artworks must be eligible for the artwork license; code and prompts use MIT.

Do not add novel text, publisher cover reproductions, secrets or private local paths. Avoid automatic social posting or remote generation as part of the build. Image generation happens separately; building the gallery must remain offline after dependencies are installed.

The first collection is curated, not a contest for the largest image count. New interpretations should add a distinct literary space. A revision that improves one existing cover is welcome.

# Book Covers

An independent literary-cover skill, image collection and static gallery. Read README.md first. Do not modify unrelated projects.

- `catalog.json` is the source of bilingual metadata. `artwork/` holds selected AI-generated originals; `process/` holds revision inputs. Keep provenance and exact prompts.
- Generate illustrations using an available image tool. Use the bundled font-file renderer for the reference gallery; the installed skill shares that renderer and downloads pinned fonts on demand. Default outputs are text-free PNG, deterministically typeset PNG and a copyable prompt TXT; generated lettering is not a fallback. Do not replace requested image generation with a programmatic drawing.
- The reusable skill lives in `skills/book-covers/`; keep it usable without this repository. Copy reference assets into its own directory.
- Build output is `dist/`; do not edit it. `npm test` verifies content, rendering, asset integrity and the local server. `npm run build` creates the gallery and downloads. `npm run export` creates promotional sheets.
- Keep examples honest about AI generation and edition status. No novel text or publisher cover reproductions. Code, prompts and skill instructions use MIT; original artwork uses the separate artwork license; the bundled font retains OFL.
- Never place account credentials or private local paths in public files. Publish only within the user's requested scope.

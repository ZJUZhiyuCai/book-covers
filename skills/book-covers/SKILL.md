---
name: book-covers
description: Design restrained literary book covers with warm paper, spare printmaking imagery and expressive Chinese or English typography. Deliver text-free PNG artwork, a PNG with deterministically typeset title and author, and a copyable generation prompt. Use for literary covers, reading-journal covers or revisions in the Book Covers style.
---

# Book Covers

Turn a book's emotional tension into one inhabitable image, then compose its exact title and author. This is a particular editorial direction, not a universal rule for good covers. Respect the user's format and preserve approved artwork during type-only revisions.

## Three outputs, by default

1. **Text-free PNG:** the selected generated illustration, preserved intact.
2. **Typeset PNG:** that illustration plus the exact title and author, composed from real font files. Do not generate the letters with the image model or substitute browser text above an image.
3. **Generation prompt:** a complete, standalone prompt for the text-free illustration, provided as a UTF-8 `.txt` file **and a fenced text block for copying**. No unresolved placeholders or private paths.

Use the requested language. Do not invent an English title just to satisfy a template. If both languages are requested, supply separate Chinese and English typeset PNGs; the shared artwork and prompt remain single files. That is four files in three categories. Keep specs and audit receipts as working material unless requested; do not bury the three deliverables in a large technical bundle.

If an explicit request asks for image-generated lettering, treat it as an additional experimental variant, not a replacement for the deterministic typeset PNG. A host missing image generation or image export cannot complete the contract: retain the usable work and state exactly what remains missing.

## Find the image and title shape together

Resolve the work, author and exact wording from the request and project. Verify unfamiliar plot details instead of inventing them. Keep visual interpretation distinct from claims about the story.

Write a compact brief: **emotional tension → spatial relationship → title silhouette → what to leave out**. A small boat within a large sea says more than a list of objects. A path, doorway, bank or shadow is useful only when its relation carries meaning; do not repeat one mechanically across unrelated books.

Read [art direction](references/art-direction.md) and inspect relevant reference images. Before a type revision, read [typography direction](references/typography.md) and inspect `references/images/typography.jpg`. The approved typography anchors are **红楼梦, 边城, 到灯塔去 and 白马啸西风**. Their useful qualities are distinct: upright vertical rhythm, open short-title spacing, English roman/italic phrasing, and controlled brush strokes. Preserve an accepted treatment unless the new request calls for changing it.

For a weaker title, compare two or three small layout studies on the same artwork. Prefer a clear axis, meaningful line break or calmer spacing to random offsets or extra decoration. All characters in one Chinese main title use the same size and weight, including across lines. Translation and author may be secondary. English hierarchy follows syntax, not arbitrary word-by-word font changes.

## Generate and preserve the artwork

Use the host's image-generation tool; in Codex prefer its built-in tool. Do not silently switch to a paid API or replace requested generated artwork with a code drawing. Inspect reference images before using them as edit targets.

Adapt [the prompt template](references/prompt-template.txt) to the work and planned layout. Default: 2:3 portrait, warm ivory, roughly two ink colours, spare printed forms, light grain, quiet title space and a clear author margin. The renderer's reference canvas is **1024 × 1536 PNG**. The upper title region ends at y=610; the author's ink sits within y=1400–1500. Those are production constraints, not proof that an image has sufficient visual quiet.

Select and inspect the actual output. Preserve the selected original; do not crop, stretch or paint over artwork just to fit a template. If generation returns another size, retain the original and make a clearly identified working export through the host's image tools with the user's framing intact. Save the actual prompt and any edit input/prompt separately. When an edit was needed, the copyable final prompt should describe the intended final scene without requiring an unavailable input image; label it a reusable recipe, not the verbatim historical prompt.

## Compose without installing system fonts

The installed skill includes a portable font-file renderer. Read [runtime usage](references/runtime.md), then let the agent prepare and run it. It needs Node.js 22+, npm and network access for first-time dependencies/fonts. Font files download on demand from pinned sources, are SHA-256 verified and read directly; nothing is installed into the operating system. The gallery checkout is not required. Use existing host equivalents if needed, but do not switch to generated letters because a font needs preparing.

Create a spec from `references/example-cover.json`, using exact title/author, semantic line breaks, the selected artwork path and the complete prompt path. Both input paths resolve relative to the spec. Start from an appropriate type plan, not the same layout for every book. Omit the optional gallery series number for an independent user's cover.

The tool validates glyphs, actual ink bounds, title scale, reading order and overlaps before writing. It preserves the source artwork and refuses accidental replacement. These checks do not evaluate whether a title is artistically good or whether the generated scene matches the brief; inspect both yourself.

Inside the gallery repository, use `catalog.json` for public records, `npm run build` for pages/downloads and `npm run compose -- --spec … --out …` for an external brief. The gallery and installed skill share one renderer.

## Review the actual deliverables

Open the exported typeset PNG at full size and at about 180 px wide, and inspect the text-free PNG separately:

- Is there one emotional relationship, or just a recognisable noun? Does the new work add something beyond the series' usual landscape?
- Does the title's shape relate to the illustration? Is its quiet space genuinely clear?
- Are every title character, author name, punctuation mark and diacritic correct? Are vertical columns upright and read right to left? Is the Chinese main title equal in scale and weight?
- Is the author readable without colliding with art? Does the translated subtitle deserve its space, or should a single-language cover omit it?
- Are all three outputs real files? Does the prompt generate text-free art, match the selected concept and contain no placeholders? Have type-only edits kept the artwork intact?

Revise the specific failure and re-export. Do not claim a successful render is proof of top-tier design. Preview the typeset result first, link all three deliverables clearly, include the copyable prompt, and briefly explain the design decision and any remaining limitation. These are screen-resolution front-cover studies; do not describe them as press-ready jackets without trim, bleed, spine, colour and print checks.

Read [worked briefs](references/briefs.md) only when another conceptual example would help. Publishing, posting and repository changes follow the user's actual authorization; the skill itself does not grant it.

## Contact

Questions or feedback for the creator, Zhiyu Cai: [22519085@zju.edu.cn](mailto:22519085@zju.edu.cn).

---
name: quiet-book-covers
description: Design and generate restrained literary book covers with warm paper, spare printmaking imagery, narrative space, and separately typeset Chinese or English titles. Use for original literary cover series, reading-journal covers, or matching the Quiet Covers visual language.
---

# Quiet book covers

Turn a book's emotional tension into one inhabitable image. This is a particular editorial direction, not a universal rule for good covers. Respect a user's requested format, palette and subject.

## Find the image

Identify the work and author. If the title is ambiguous, resolve it before choosing imagery. Use the user's description or reliable knowledge of the work; verify unfamiliar plot details rather than inventing them. Do not claim a scene occurs in the book when it is your visual interpretation.

Write a compact design brief: **emotional tension → spatial scene → one visual decision → what to leave out**. An interpretation such as “smallness against resolve → a small boat within a large sea” is more useful than a list of objects from the title.

Prefer relationships that can carry meaning: a path toward a doorway, tracks into snow, a horse small within a desert, water around an island. A single object can work when its scale, placement and surroundings create a story. A floating dragon emblem, crossed weapons, or an isolated prop often loses that depth in this series. Do not simply ban all animals or objects.

Read [the visual reference](references/art-direction.md) when matching the series. Inspect the four small reference images in `references/images/` when image viewing is available. They are original generated studies, not publisher covers to imitate.

## Generate the illustration

Use the host's available image-generation capability. In Codex, prefer its built-in image-generation tool. One distinct artwork needs one generation request; a batch is not a collage. Do not silently switch to a paid API or substitute a hand-coded drawing for requested generated artwork. If no image tool is available, provide the finished prompt and report that generation remains undone.

Start from [prompt template](references/prompt-template.txt), replacing the bracketed work, emotion, scene, palette and exclusions. The defaults fit a 2:3 portrait jacket:

- Warm ivory paper, about two main ink colours, spare printmaking edges and light grain.
- A quiet upper area for titles; a scene across the lower middle; a clean author margin at the bottom. The 43% / 47–87% / 9% values are layout targets, not proof of success.
- No generated lettering. Keep the art separate from title and author typography.
- The image should read at roughly 180 px wide. Reduce competing shapes before adding detail or texture.

When a reference image is supplied, describe its role (style reference or edit target) and inspect it first. Preserve the required composition during edits. Save selected artwork in the user's project; never leave a project asset dependent on a private temporary path.

## Typeset and review

Use an actual licensed font and deterministic HTML/SVG/image composition for titles. Set Chinese and English intentionally; do not squeeze a long English title into the Chinese line breaks. Preserve spelling, diacritics and the author's name. Do not add publisher marks or pretend this is an official edition.

If working inside the Quiet Covers repository, add the artwork and brief to `catalog.json`, save the exact prompt under `prompts/`, then use `npm run build` and `npm run export -- --book <id> --lang zh`. The renderer keeps the art and outlined typography separate and fails on missing glyphs. Outside the repository, use the host's normal layout/export tools; the skill itself requires no Node runtime.

Inspect both the full cover and thumbnail:

- Does the emotional relationship survive when small, or is the image just a recognisable noun?
- Is the title space actually clear? Can the author be read without covering the illustration?
- Is there one dominant spatial idea, with enough quiet paper around it?
- Do ink, grain and contrast belong to the rest of the series?
- Do both languages fit without truncation, invented translations or missing glyphs?

Revise the specific failure. For example, repair an invaded author margin without adding a new illustration concept. A generation prompt is not proof that the output follows it.

Deliver the selected art, typeset cover when requested, exact prompt, and generation/edit provenance. State whether the result is a fresh generation or revision. Image generation is stochastic; promise a reproducible process, not identical pixels or a guaranteed interpretation.

## Useful examples

Read [worked briefs](references/briefs.md) for the four founding studies and two examples of moving beyond a literal title. They illustrate decisions; do not reuse their scenery for every book.

Publication, social posting and repository changes follow the user's actual request. Using this visual skill alone does not authorize them.

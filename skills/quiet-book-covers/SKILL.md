---
name: quiet-book-covers
description: Design restrained literary covers with warm paper, spare printmaking imagery, and expressive Chinese or English typography. Use for literary cover series, reading-journal covers, or improving title and author lettering in the Quiet Covers style.
---

# Quiet book covers

Turn a book's emotional tension into one inhabitable image. This is a particular editorial direction, not a universal rule for good covers. Respect a user's requested format, palette and subject.

## Deliver a complete cover

A request for a **book cover** means a finished image with the **exact book title and author integrated into its composition**. Make that the default, even when the user does not repeat those requirements. A text-free illustration is an intermediate layer, not a finished cover. Deliver artwork alone only when the user explicitly asks for it.

Resolve the title, author and intended language from the request and existing project. In a bilingual collection, deliver a separately composed cover for each language. Plan the title silhouette and author position before generating the picture; assess the picture and lettering together. More decorative type cannot rescue an image with nowhere for the words to live.

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
- Generate the picture without lettering, then **always complete the typography step** for a cover request. Separate source layers are a production method; the final exported cover combines both.
- The image should read at roughly 180 px wide. Reduce competing shapes before adding detail or texture.

When a reference image is supplied, describe its role (style reference or edit target) and inspect it first. Preserve the required composition during edits. Save selected artwork in the user's project; never leave a project asset dependent on a private temporary path.

## Typeset and review

Read [typography direction](references/typography.md) when designing or revising title and author lettering. Inspect its specimen image when image viewing is available. A literary cover needs a deliberate title silhouette, not just a body font placed on an illustration. Choose faces for each script, give long and short titles different rhythms, and set the author with enough presence to feel considered.

Use licensed fonts and deterministic HTML/SVG/image composition. Chinese engraved or brush forms and Latin display roman/true italic are useful directions, not mandatory choices for every work. Keep the exact title and author; do not turn decorative lettering into unreadable glyphs, fake signatures or a claimed official edition. When only typography needs improvement, preserve the selected illustration and compare the old and new text layers on the same art.

Inside the Quiet Covers repository, `catalog.json` holds the book, semantic title breaks and optional per-language `typography` plans; see [implementation notes](references/typography.md#reference-implementation) before editing those plans. Save actual generation prompts under `prompts/`, then use `npm run build` and `npm run export -- --book <id> --lang zh`. The renderer keeps art and outlined type separate and rejects missing glyphs or out-of-bounds layouts. Outside the repository, use the host's normal layout/export tools; the skill itself requires no Node runtime.

Inspect both the full cover and thumbnail:

- Does the emotional relationship survive when small, or is the image just a recognisable noun?
- Is the title space actually clear? Can the author be read without covering the illustration?
- Is there one dominant spatial idea, with enough quiet paper around it?
- Do ink, grain and contrast belong to the rest of the series?
- Do both languages fit without truncation, invented translations or missing glyphs?
- Does the title have a purposeful shape, and does the author remain legible at thumbnail size? Are vertical columns in reading order, italic overhangs clear, and the subtitle visibly secondary?

Revise the specific failure. For example, repair an invaded author margin without adding a new illustration concept. A generation prompt is not proof that the output follows it.

Deliver the **complete typeset cover first**, previewing the actual exported image with its title and author. Include the editable type plan, selected source art, exact prompt and generation/edit provenance as supporting materials. For a bilingual project, label the Chinese and English exports clearly. On a website, use these complete covers as the default images; do not add a second browser text overlay or link only to the source illustrations. If generation or typesetting is blocked, name the missing step and do not call the cover complete.

State whether the artwork is a fresh generation or a revision. Image generation is stochastic; promise a reproducible process, not identical pixels or a guaranteed interpretation.

## Useful examples

Read [worked briefs](references/briefs.md) for the four founding studies and two examples of moving beyond a literal title. They illustrate decisions; do not reuse their scenery for every book.

Publication, social posting and repository changes follow the user's actual request. Using this visual skill alone does not authorize them.

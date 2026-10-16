# Book Covers v1.4.0

A cover brief now produces three output types: intact text-free PNG, a PNG with deterministically typeset title and author, and a complete copyable prompt. A bilingual brief shares artwork and prompt and adds a second typeset PNG.

The independently installable skill now carries the same renderer as the gallery. It prepares pinned, checksum-verified font files on demand without installing system fonts. Single-language briefs and optional provenance receipts are supported. Gallery pages expose all three downloads/copy controls directly.

Four targeted title refinements preserve all ten source illustrations and the eight approved anchor covers. Historical generated-lettering experiments remain documented but no longer define the default production route.

Independent forward-testing found and helped fix two classes of defects: reversed horizontal reading order and receipt/output path collisions (including directory aliases and case-insensitive filenames). Tests cover both regressions. See [the review, evidence and remaining design limits](review-v1.4.0.md).

The primary install route remains an instruction to the user's agent pointing at `skills/book-covers/`. Release ZIPs are optional portable archives, not the main installation experience. The package excludes node_modules and font caches. Image generation still requires an image-capable host; deterministic rendering needs Node.js 22+ and first-time dependency/font preparation.

# Quiet Covers: design decisions

**Visual thesis:** warm paper and spare printed landscapes turn a literary shelf into a quiet, browsable exhibition.

**Content plan:** one cover-led opening → ten works → a short explanation of the method → an installable skill. Each cover has a permanent page, exact prompt, original image and two typeset downloads.

**Interaction thesis:** a brief staggered arrival of the opening covers, a subtle lift that identifies clickable artwork, and a cover/artwork toggle that makes the separation of illustration and typography tangible. Respect reduced-motion preferences. No autoplay, scroll trapping or canvas-only content.

The four founding studies were selected by Zhiyu Cai. Six new works test the same visual language across different narrative spaces. All illustrations are AI-generated; briefs, selection, revisions and typesetting form the design process. These are interpretations, not publisher editions.

The gallery has no client framework, analytics, API keys or image-generation backend. `catalog.json` supplies the multilingual content. Build-time glyph outlines keep downloadable titles stable across machines. The web font is subsetted for the gallery; the original OFL font is retained for exports.

Source illustrations stay intact. WebP previews are resized derivatives; PNG jackets add separately rendered title and author typography. Two new illustrations needed image-tool revisions to restore a clear author margin; their original drafts and revision prompt remain in `process/` and `prompts/`.

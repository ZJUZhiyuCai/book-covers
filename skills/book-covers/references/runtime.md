# Portable composition

The agent runs these commands; the user does not need to find or install fonts. Resolve `<skill>` to this installed skill directory and use an absolute path to the book spec. Quote paths containing spaces.

```sh
cd "<skill>/runtime"
npm ci
node compose.mjs --spec "/absolute/project/book.json" --out "/absolute/project/covers"
```

Node.js 22+ is required. Run npm from the runtime directory; this also avoids npm prefix handling differences for symlinked installation paths. Reuse prepared dependencies on subsequent runs. The first composition downloads only the fonts needed by the selected language and plan, into `runtime/.cache/fonts/`. `runtime/fonts.json` records pinned URLs, hashes, upstream sources and the bundled OFL licenses. Subsequent runs use the verified cache offline. A checksum failure stops instead of silently changing the typeface; remove only the named damaged cached font before retrying. If network or native dependencies are unavailable, report that specific missing capability, not a generic need to install system fonts.

## Spec

Start from [example-cover.json](example-cover.json). It deliberately requests one Chinese cover. Set `artwork` and `prompt` relative to the JSON file (absolute paths also work). `prompt` points to the complete UTF-8 text used for the art or a clearly labeled reusable final recipe. The artwork must be a single 1024 × 1536 PNG.

`title`, `author`, `titleLines` and optional `typography` have `zh` and/or `en` keys. By default each supplied title language is exported. Optional `languages: ["zh"]` exports only Chinese while allowing a supplied English title to appear as a secondary line. Do not supply an unverified translation. `number` is an optional two/three-digit gallery number; omit it to omit the BOOK COVERS imprint.

The three default files for the example are:

```text
border-town-artwork.png    byte-identical selected source illustration
border-town-zh.png         illustration + outlined title and author
border-town-prompt.txt     byte-identical prompt input, ready to copy
```

Providing both requested languages adds `border-town-en.png`, not a second artwork or prompt. No WebP, receipt or extra archive is created by default. Optional `--webp` adds 640 × 960 previews; `--receipt audit.json` writes hashes, type plans and font provenance separately. Existing outputs are protected unless `--force` is explicit. Even `--force` cannot overwrite input files or output symlinks. Retain source material outside the delivery directory.

The reference canvas has a quiet upper title region and a bottom author margin. Type plans are documented in [typography.md](typography.md#reference-implementation). Actual ink measurements protect margins and overlaps. Unsupported glyphs fail visibly. It is a guided composition tool, not automatic art direction or a general-purpose print-production system.

The same font files and plans reproduce glyph outlines and positions. Different native rasterizers can differ slightly in edge antialiasing; do not promise cross-platform byte-identical typeset PNGs.

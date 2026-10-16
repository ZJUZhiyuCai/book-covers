# Install Book Covers with your agent

Give your agent the skill URL. The installable unit is **`skills/book-covers/`**, including `references/` and `runtime/`, not this whole gallery.

```text
Please install the Book Covers skill from:
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
Use your native skill installer and include references and runtime.
If already installed, preserve local edits before updating.
Tell me how to invoke it when installation is complete.
```

## Codex

Codex's built-in `skill-installer` accepts that GitHub directory URL. Ask Codex to use it; there is no ZIP to unpack, gallery dependency to install, or font setup to perform. The installer follows the host's configured skills directory. The skill becomes available on a subsequent turn after discovery refreshes.

## Other agents

Use the host's native installer when it supports an Agent Skills directory. If it uses the [open skills CLI](https://github.com/vercel-labs/skills), the equivalent command is:

```sh
npx skills add ZJUZhiyuCai/book-covers --skill book-covers
```

The CLI lets you select the agent and installation scope. For an explicitly selected agent, add `--agent claude-code`, `--agent codex`, or another supported identifier. Do not select all agents or change global settings unless requested. This CLI route requires Node/npm. The bundled deterministic renderer also requires Node.js 22+, regardless of installer. A host without skill installation can read `SKILL.md` and its referenced resources for the current task, but that is session use, not a persistent installation.

## Verify the result

Check that the installed directory contains `SKILL.md` with `name: book-covers`, plus its relative references, reference images and runtime (including package-lock.json and font licenses). Preserve an existing local variant before replacing it. Report the actual install destination and the host's invocation syntax; do not report success for a link alone.

In Codex, try:

```text
Use $book-covers to design a complete cover for Ordinary World by Lu Yao.
Include the exact title and author. Use equal-sized characters for 平凡的世界.
```

The host needs image generation to create new art and local execution to compose real fonts. The skill's renderer needs Node.js 22+; the agent prepares its pinned dependencies by running `npm ci` inside the installed `runtime/` directory. The first composition fetches only needed font files into its own verified cache. No OS font installation or gallery clone is required. Subsequent composition can run offline. Installing a skill does not add an image model or credentials.

Verify the contract on a real brief: text-free PNG, deterministically typeset PNG, and complete prompt TXT plus a copyable prompt block. A single-language brief should not invent a translation. See [runtime usage](skills/book-covers/references/runtime.md). Missing execution or generation must be reported accurately, not bypassed by generating the letters.

For updates, replace the installed skill as a directory after preserving local edits. Do not merge stale instructions from previous versions. Old generated-lettering guidance was superseded by the three-output contract in v1.4.

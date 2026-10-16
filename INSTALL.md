# Install Book Covers with your agent

Give your agent the skill URL. The installable unit is **`skills/book-covers/`**, including its reference files, not this whole gallery.

```text
Please install the Book Covers skill from:
https://github.com/ZJUZhiyuCai/book-covers/tree/main/skills/book-covers
Use your native skill installer and include the referenced resources.
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

The CLI lets you select the agent and installation scope. For an explicitly selected agent, add `--agent claude-code`, `--agent codex`, or another supported identifier. Do not select all agents or change global settings unless requested. This CLI route requires Node/npm; the skill itself does not. A host without skill installation can read `SKILL.md` and its referenced resources for the current task, but that is session use, not a persistent installation.

## Verify the result

Check that the installed directory contains `SKILL.md` with `name: book-covers`, plus its relative references and reference images. Preserve an existing local variant before replacing it. Report the actual install destination and the host's invocation syntax; do not report success for a link alone.

In Codex, try:

```text
Use $book-covers to design a complete cover for Ordinary World by Lu Yao.
Include the exact title and author. Use equal-sized characters for 平凡的世界.
```

The host must provide image generation to create a new cover. The skill supports either generated lettering with no font setup, or direct font-file composition when a renderer is already available. Installing the skill does not add an image model or API credentials.

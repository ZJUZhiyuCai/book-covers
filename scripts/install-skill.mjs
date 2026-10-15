import { cp, access, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { ROOT } from './catalog.mjs';

const args = process.argv.slice(2);
if (args.some((a) => !['--force', '--help'].includes(a)))
  throw new Error('Use npm run skill:install [-- --force]');
if (args.includes('--help')) {
  console.log(
    'Copy book-covers into $CODEX_HOME/skills (default ~/.codex/skills). Existing installs are preserved unless --force is supplied.',
  );
} else {
  const base = resolve(process.env.CODEX_HOME || resolve(homedir(), '.codex'), 'skills');
  const target = resolve(base, 'book-covers');
  let exists = false;
  try {
    await access(target);
    exists = true;
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  if (exists && !args.includes('--force'))
    throw new Error('Skill already exists; review local edits before using --force.');
  await mkdir(base, { recursive: true });
  await cp(resolve(ROOT, 'skills/book-covers'), target, {
    recursive: true,
    force: args.includes('--force'),
    errorOnExist: !args.includes('--force'),
  });
  console.log(
    `Installed skill: ${target}\nRestart or reload your agent session to discover $book-covers.`,
  );
}

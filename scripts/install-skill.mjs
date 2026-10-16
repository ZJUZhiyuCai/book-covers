import { cp, lstat, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { homedir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { ROOT } from './catalog.mjs';
const args = process.argv.slice(2);
if (args.some((a) => !['--force', '--help'].includes(a)))
  throw new Error('Use npm run skill:install [-- --force]');
if (args.includes('--help')) {
  console.log(
    'Install book-covers into $CODEX_HOME/skills (default ~/.codex/skills). --force backs up an existing installation before replacing it; it never merges obsolete instructions.',
  );
} else {
  const base = resolve(process.env.CODEX_HOME || resolve(homedir(), '.codex'), 'skills');
  const target = resolve(base, 'book-covers');
  let exists = false;
  try {
    await lstat(target);
    exists = true;
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  if (exists && !args.includes('--force'))
    throw new Error('Skill already exists; review local edits before using --force.');
  await mkdir(base, { recursive: true });
  const stage = await mkdtemp(resolve(base, '.book-covers-install-'));
  const prepared = resolve(stage, 'book-covers');
  let backup;
  try {
    await cp(resolve(ROOT, 'skills/book-covers'), prepared, {
      recursive: true,
      filter: (source) =>
        !relative(resolve(ROOT, 'skills/book-covers'), source)
          .split('/')
          .some((part) => ['node_modules', '.cache', '.DS_Store'].includes(part)),
    });
    if (exists) {
      const backupRoot = resolve(dirname(base), 'skill-backups');
      await mkdir(backupRoot, { recursive: true });
      backup = resolve(
        backupRoot,
        `book-covers-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`,
      );
      await rename(target, backup);
    }
    try {
      await rename(prepared, target);
    } catch (e) {
      if (backup) await rename(backup, target);
      throw e;
    }
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
  console.log(
    `Installed skill: ${target}${backup ? `\nPrevious installation preserved: ${backup}` : ''}\nThe skill is available after your agent refreshes skill discovery.`,
  );
}

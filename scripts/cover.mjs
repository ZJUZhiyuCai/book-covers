import { readFile } from 'node:fs/promises';
import { ROOT, inside } from './catalog.mjs';
import { useFontDirectory, composeCover } from '../skills/book-covers/runtime/cover.mjs';
useFontDirectory(ROOT);
export * from '../skills/book-covers/runtime/cover.mjs';
export async function renderCover(book, lang, options = {}) {
  const visual = book.coverImprint === false ? { ...book, number: undefined } : book;
  return composeCover(visual, lang, await readFile(inside(ROOT, book.artwork)), options);
}

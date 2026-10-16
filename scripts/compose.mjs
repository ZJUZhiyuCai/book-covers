import { pathToFileURL } from 'node:url';
import { ROOT } from './catalog.mjs';
import { composeFromSpec as compose, runCLI } from '../skills/book-covers/runtime/compose.mjs';
export { validateCoverSpec } from '../skills/book-covers/runtime/compose.mjs';
export const composeFromSpec = (spec, out, options = {}) =>
  compose(spec, out, { fontRoot: ROOT, downloadFonts: false, ...options });
if (import.meta.url === pathToFileURL(process.argv[1] || '').href)
  runCLI(process.argv.slice(2), { fontRoot: ROOT, downloadFonts: false }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

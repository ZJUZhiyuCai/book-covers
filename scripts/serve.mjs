import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT } from './catalog.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
export function createStaticServer(root) {
  const base = resolve(root);
  return createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (pathname.includes('\0') || pathname.includes('\\')) {
        res.writeHead(400).end('Bad path');
        return;
      }
      let target = resolve(base, '.' + pathname);
      const rel = relative(base, target);
      if (rel.startsWith('..') || isAbsolute(rel) || rel.split('/').some((p) => p.startsWith('.'))) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      let info = await stat(target);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) {
          res
            .writeHead(302, { Location: pathname + '/' + new URL(req.url, 'http://localhost').search })
            .end();
          return;
        }
        target = resolve(target, 'index.html');
        info = await stat(target);
      }
      if (!info.isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }
      const bytes = req.method === 'HEAD' ? undefined : await readFile(target);
      res.writeHead(200, {
        'Content-Type': MIME[extname(target)] || 'application/octet-stream',
        'Content-Length': bytes?.length ?? info.size,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(bytes);
    } catch (e) {
      res
        .writeHead(e instanceof URIError ? 400 : 404, { 'Content-Type': 'text/plain; charset=utf-8' })
        .end(e instanceof URIError ? 'Bad request' : 'Not found');
    }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv.includes('--no-build')) {
    const { build } = await import('./build.mjs');
    await build();
  }
  const port = Number(process.env.PORT || 4187);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  createStaticServer(resolve(ROOT, 'dist')).listen(port, '127.0.0.1', () =>
    console.log(`Quiet Covers: http://127.0.0.1:${port}/`),
  );
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createStaticServer } from '../scripts/serve.mjs';

test('static server serves pages and downloads; rejects traversal, malformed URLs and writes', async () => {
  const dir = await mkdtemp(resolve(tmpdir(), 'quiet-covers-test-'));
  await mkdir(resolve(dir, 'en'));
  await writeFile(resolve(dir, 'index.html'), '<h1>Quiet Covers</h1>');
  await writeFile(resolve(dir, 'en/index.html'), '<h1>English</h1>');
  await writeFile(resolve(dir, 'art.png'), Buffer.from([137, 80, 78, 71]));
  const server = createStaticServer(dir);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(base + '/');
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Quiet Covers/);
    const redirect = await fetch(base + '/en', { redirect: 'manual' });
    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.get('location'), '/en/');
    const head = await fetch(base + '/art.png', { method: 'HEAD' });
    assert.equal(head.headers.get('content-type'), 'image/png');
    assert.equal((await head.text()).length, 0);
    assert.equal(head.headers.get('content-length'), '4');
    assert.equal((await fetch(base + '/%2e%2e%2fsecret')).status, 403);
    assert.equal((await fetch(base + '/.env')).status, 403);
    assert.equal((await fetch(base + '/%XX')).status, 400);
    assert.equal((await fetch(base + '/missing')).status, 404);
    assert.equal((await fetch(base + '/', { method: 'POST', body: 'x' })).status, 405);
  } finally {
    await new Promise((r) => server.close(r));
    await rm(dir, { recursive: true, force: true });
  }
});

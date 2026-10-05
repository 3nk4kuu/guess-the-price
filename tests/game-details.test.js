import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/game-details.js';
function response() {
  return {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}
test('rejects invalid requests before contacting RAWG', async () => {
  for (const [method, url, code] of [
    ['POST', '/api/game-details?title=Portal', 405],
    ['GET', '/api/game-details', 400],
    ['GET', '/api/game-details?title=%20', 400],
    ['GET', '/api/game-details?title=a&title=b', 400],
    ['GET', `/api/game-details?title=${'a'.repeat(301)}`, 400],
  ]) {
    const result = response();
    await handler({ method, url }, result);
    assert.equal(result.code, code);
    assert.equal(result.headers['Cache-Control'], 'no-store');
  }
});
test('keeps the key private and only returns game details', async t => {
  const originalKey = process.env.RAWG_KEY;
  process.env.RAWG_KEY = 'private-test-key';
  t.after(() => {
    if (originalKey === undefined) delete process.env.RAWG_KEY;
    else process.env.RAWG_KEY = originalKey;
  });
  const requests = [];
  t.mock.method(globalThis, 'fetch', async url => {
    requests.push(url);
    return { ok: true, json: async () => requests.length === 1
      ? { results: [{ id: 123, secret: 'private-test-key', short_screenshots: [{ image: 'https://example.com/shot.jpg' }] }] }
      : { description_raw: 'Game description', secret: 'private-test-key' } };
  });
  const result = response();
  await handler({ method: 'GET', url: '/api/game-details?title=Portal%20%26%20Friends' }, result);
  assert.equal(result.code, 200);
  assert.deepEqual(result.body, { description: 'Game description', screenshots: ['https://example.com/shot.jpg'] });
  assert.equal(requests[0].searchParams.get('search'), 'Portal & Friends');
  assert.equal(requests[1].pathname, '/api/games/123');
  assert.ok(requests.every(url => url.searchParams.get('key') === 'private-test-key'));
  assert.match(result.headers['Cache-Control'], /s-maxage=3600/);
});
test('does not expose failed upstream request URLs', async t => {
  const originalKey = process.env.RAWG_KEY;
  process.env.RAWG_KEY = 'private-test-key';
  t.after(() => {
    if (originalKey === undefined) delete process.env.RAWG_KEY;
    else process.env.RAWG_KEY = originalKey;
  });
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('key=private-test-key'); });
  const result = response();
  await handler({ method: 'GET', url: '/api/game-details?title=Portal' }, result);
  assert.equal(result.code, 502);
  assert.deepEqual(result.body, { error: 'Could not load game details.' });
  assert.equal(result.headers['Cache-Control'], 'no-store');
});

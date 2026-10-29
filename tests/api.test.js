const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const store = require('../models/favoriteStore');

test('CRUD og validering af favoritter', async () => {
  store.resetForTests();
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = (path, method='GET', body) => fetch(url + path, {
    method, headers: body ? {'Content-Type':'application/json'} : {},
    body: body ? JSON.stringify(body) : undefined
  });
  try {
    let r = await request('/favorites');
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), []);
    r = await request('/favorites', 'POST', { name: '' });
    assert.equal(r.status, 400);
    r = await request('/favorites', 'POST', {name:'Pikachu', note:'Elektrisk'});
    assert.equal(r.status, 201); const created = await r.json();
    assert.equal(created.id, 1);
    assert.equal(r.headers.get('location'), '/favorites/1');
    r = await request('/favorites/1');
    assert.equal((await r.json()).name, 'pikachu');
    r = await request('/favorites/1','PUT',{name:'Eevee',note:'Normal'});
    assert.equal(r.status,200); assert.equal((await r.json()).name,'eevee');
    r = await request('/favorites/1','DELETE'); assert.equal(r.status,204);
    r = await request('/favorites/1'); assert.equal(r.status,404);
    r = await request('/favorites/abc'); assert.equal(r.status,400);
    r = await request('/pokemon/pikachu!'); assert.equal(r.status,400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

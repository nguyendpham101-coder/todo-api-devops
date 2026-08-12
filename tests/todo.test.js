const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
});

test('GET /health returns 200 ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, 'ok');
  assert.ok('postgres' in body);
  assert.ok('redis' in body);
});

test('GET /api/todos returns list', async () => {
  const res = await fetch(`${baseUrl}/api/todos`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length >= 1);
});

test('GET /api/todos/:id returns a todo', async () => {
  const res = await fetch(`${baseUrl}/api/todos/1`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.id, 1);
  assert.ok(body.title);
});

test('GET /api/todos/:id returns 404 for missing todo', async () => {
  const res = await fetch(`${baseUrl}/api/todos/9999`);
  assert.strictEqual(res.status, 404);
});

test('GET /api/todos/:id returns 400 for invalid id', async () => {
  const res = await fetch(`${baseUrl}/api/todos/abc`);
  assert.strictEqual(res.status, 400);
});

test('POST /api/todos creates a todo', async () => {
  const res = await fetch(`${baseUrl}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Write tests' }),
  });
  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.ok(body.id);
  assert.strictEqual(body.title, 'Write tests');
  assert.strictEqual(body.completed, false);
});

test('POST /api/todos returns 400 without title', async () => {
  const res = await fetch(`${baseUrl}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.strictEqual(res.status, 400);
});

test('PUT /api/todos/:id updates a todo', async () => {
  const res = await fetch(`${baseUrl}/api/todos/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Learn Docker deeply', completed: true }),
  });
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.title, 'Learn Docker deeply');
  assert.strictEqual(body.completed, true);
});

test('PUT /api/todos/:id returns 404 for missing todo', async () => {
  const res = await fetch(`${baseUrl}/api/todos/9999`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: true }),
  });
  assert.strictEqual(res.status, 404);
});

test('DELETE /api/todos/:id deletes a todo', async () => {
  const created = await fetch(`${baseUrl}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Temp' }),
  });
  const { id } = await created.json();

  const res = await fetch(`${baseUrl}/api/todos/${id}`, { method: 'DELETE' });
  assert.strictEqual(res.status, 204);

  const missing = await fetch(`${baseUrl}/api/todos/${id}`);
  assert.strictEqual(missing.status, 404);
});

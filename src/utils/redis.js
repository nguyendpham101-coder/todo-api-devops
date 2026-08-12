const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let client;

function getClient() {
  if (!client) {
    client = createClient({ url: redisUrl });
    client.on('error', (err) => {
      console.error(`Redis error: ${err.message}`);
    });
  }
  return client;
}

async function connect() {
  try {
    if (process.env.USE_REDIS !== 'true') {
      return;
    }
    const c = getClient();
    if (!c.isOpen) {
      await c.connect();
    }
  } catch (err) {
    console.error(`Redis connect failed: ${err.message}`);
  }
}

async function get(key) {
  try {
    if (process.env.USE_REDIS !== 'true') {
      return null;
    }
    const c = getClient();
    if (!c.isReady) {
      return null;
    }
    const value = await c.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

async function set(key, value, seconds) {
  try {
    if (process.env.USE_REDIS !== 'true') {
      return;
    }
    const c = getClient();
    if (!c.isReady) {
      return;
    }
    await c.set(key, JSON.stringify(value), { EX: seconds });
  } catch (err) {
    // ignore cache errors
  }
}

async function del(key) {
  try {
    if (process.env.USE_REDIS !== 'true') {
      return;
    }
    const c = getClient();
    if (!c.isReady) {
      return;
    }
    await c.del(key);
  } catch (err) {
    // ignore cache errors
  }
}

async function status() {
  try {
    if (process.env.USE_REDIS !== 'true') {
      return 'disabled';
    }
    const c = getClient();
    if (c.isReady) {
      return 'up';
    }
    await connect();
    if (c.isReady) {
      return 'up';
    }
    return 'down';
  } catch (err) {
    return 'down';
  }
}

module.exports = {
  connect,
  get,
  set,
  del,
  status,
};
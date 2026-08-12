const store = require('../data/store');
const redis = require('../utils/redis');

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function getAll(req, res, next) {
  try {
    const cached = await redis.get('todos:all');
    if (cached) {
      return res.status(200).json(cached);
    }
    const todos = await store.getAllTodos();
    await redis.set('todos:all', todos, 10);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = parseId(req);
    if (id === null) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }
    const todo = await store.getTodoById(id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title } = req.body || {};
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    const todo = await store.createTodo(title.trim());
    await redis.del('todos:all');
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = parseId(req);
    if (id === null) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }
    const body = req.body || {};
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
      return res.status(400).json({ error: 'Title must be a non-empty string' });
    }
    if (body.completed !== undefined && typeof body.completed !== 'boolean') {
      return res.status(400).json({ error: 'Completed must be a boolean' });
    }
    const todo = await store.updateTodo(id, body);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await redis.del('todos:all');
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = parseId(req);
    if (id === null) {
      return res.status(400).json({ error: 'Invalid todo id' });
    }
    const deleted = await store.deleteTodo(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    await redis.del('todos:all');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
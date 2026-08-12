const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../data/todos');

function parseId(req) {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function getAll(req, res) {
  res.status(200).json(getAllTodos());
}

function getById(req, res) {
  const id = parseId(req);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid todo id' });
  }
  const todo = getTodoById(id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
}

function create(req, res) {
  const { title } = req.body || {};
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const todo = createTodo(title.trim());
  res.status(201).json(todo);
}

function update(req, res) {
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
  const todo = updateTodo(id, body);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(200).json(todo);
}

function remove(req, res) {
  const id = parseId(req);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid todo id' });
  }
  const deleted = deleteTodo(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
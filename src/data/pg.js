const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false
      )
    `);
  } finally {
    client.release();
  }
}

async function getAllTodos() {
  const { rows } = await pool.query(
    'SELECT id, title, completed FROM todos ORDER BY id'
  );
  return rows;
}

async function getTodoById(id) {
  const { rows } = await pool.query(
    'SELECT id, title, completed FROM todos WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

async function createTodo(title) {
  const { rows } = await pool.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, completed',
    [title]
  );
  return rows[0];
}

async function updateTodo(id, updates) {
  const fields = [];
  const values = [];
  if (updates.title !== undefined) {
    values.push(updates.title);
    fields.push(`title = $${values.length}`);
  }
  if (updates.completed !== undefined) {
    values.push(updates.completed);
    fields.push(`completed = $${values.length}`);
  }
  if (fields.length === 0) {
    return getTodoById(id);
  }
  values.push(id);
  const { rows } = await pool.query(
    `UPDATE todos SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING id, title, completed`,
    values
  );
  return rows[0] || null;
}

async function deleteTodo(id) {
  const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
  return result.rowCount > 0;
}

async function status() {
  try {
    await pool.query('SELECT 1');
    return 'up';
  } catch (err) {
    return 'down';
  }
}

module.exports = {
  init,
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  status,
};
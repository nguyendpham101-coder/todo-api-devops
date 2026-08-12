const todos = [
  {
    id: 1,
    title: 'Learn Docker',
    completed: false,
  },
  {
    id: 2,
    title: 'Setup Swagger',
    completed: false,
  },
  {
    id: 3,
    title: 'Practice Git branching',
    completed: true,
  },
];

let nextId = 4;

function getAllTodos() {
  return todos;
}

function getTodoById(id) {
  return todos.find((todo) => todo.id === id) || null;
}

function createTodo(title) {
  const todo = {
    id: nextId,
    title,
    completed: false,
  };
  nextId += 1;
  todos.push(todo);
  return todo;
}

function updateTodo(id, updates) {
  const todo = getTodoById(id);
  if (!todo) {
    return null;
  }
  if (updates.title !== undefined) {
    todo.title = updates.title;
  }
  if (updates.completed !== undefined) {
    todo.completed = updates.completed;
  }
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
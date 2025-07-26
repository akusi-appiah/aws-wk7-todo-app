// const express=require('express');
// const todoController = require('../controllers/todos.js');


// const router = express.Router();

// router.get('/', todoController.getAllTodos);
// router.get('/:id', todoController.getTodoById);
// router.post('/', todoController.createTodo);
// router.put('/:id', todoController.updateTodo);
// router.delete('/:id', todoController.deleteTodo);
// router.patch('/:id/status', todoController.toggleTodoStatus);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo, toggleTodoStatus } = require('../services/dynamodb.js');

// Get all todos: GET /api/todos
router.get('/', async (req, res) => {
  try {
    const todos = await getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error: error.message });
  }
});

// Get todo by ID: GET /api/todos/:id
router.get('/:id', async (req, res) => {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo', error: error.message });
  }
});

// Create todo: POST /api/todos
router.post('/', async (req, res) => {
  try {
    const todo = await createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error: error.message });
  }
});

// Update todo: PUT /api/todos/:id
router.put('/:id', async (req, res) => {
  try {
    const todo = await updateTodo(req.params.id, req.body);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error: error.message });
  }
});

// Delete todo: DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  try {
    const todo = await deleteTodo(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error: error.message });
  }
});

// Toggle todo status: PATCH /api/todos/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Completed must be a boolean' });
    }
    const todo = await toggleTodoStatus(req.params.id, completed);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: 'Error toggling todo status', error: error.message });
  }
});

module.exports = router;
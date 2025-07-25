const  todoService = require('../services/dynamodb.js');

const getAllTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const newTodo = await todoService.createTodo(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await todoService.updateTodo(req.params.id, req.body);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await todoService.deleteTodo(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleTodoStatus = async (req, res, next) => {
  try {
    const { completed } = req.body;
    const updatedTodo = await todoService.toggleTodoStatus(req.params.id, completed);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus
};
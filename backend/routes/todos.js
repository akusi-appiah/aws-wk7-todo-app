const express=require('express');
const todoController = require('../controllers/todos.js');


const router = express.Router();

// router.get('/', todoController.getAllTodos);
// router.get('/:id', todoController.getTodoById);
// router.post('/', todoController.createTodo);
// router.put('/:id', todoController.updateTodo);
// router.delete('/:id', todoController.deleteTodo);
// router.patch('/:id/status', todoController.toggleTodoStatus);

router.get('/', (req, res) => res.json({ message: 'Todos' }));

module.exports = router;
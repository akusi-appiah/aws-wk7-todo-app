const express=require('express');
const todoController = require('../controllers/todos');


const router = express.Router();

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/status', todoController.toggleTodoStatus);

module.exports = router;
// backend/routes/todoRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getTodos, createTodo, updateTodo, deleteTodo, getTodoById } = require('../controller/todoController');

const router = express.Router();

router.route('/').get(protect, getTodos).post(protect, createTodo); // Get all todos or create new
router.route('/:id').put(protect, updateTodo).delete(protect, deleteTodo); // Update or delete by ID
router.route('/:id').get(protect, getTodoById);
module.exports = router;
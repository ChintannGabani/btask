// backend/controllers/todoController.js
const asyncHandler = require('express-async-handler');
const Todo = require('../models/Todo');

// Get all todos for logged-in user
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.json(todos);
});


const getTodoById = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(todo);
});

// Create new todo
const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const todo = await Todo.create({
    title,
    description,
    user: req.user._id,
  });
  res.status(201).json(todo);
});

// Update todo
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  todo.title = req.body.title || todo.title;
  todo.description = req.body.description || todo.description;
  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

  const updatedTodo = await todo.save();
  res.json(updatedTodo);
});

// Delete todo
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await todo.deleteOne();
  res.json({ message: 'Todo removed' });
});

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, getTodoById };
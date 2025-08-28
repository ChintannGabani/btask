// backend/routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controller/userController');

const router = express.Router();

router.post('/register', registerUser); // Route for user signup
router.post('/login', loginUser); // Route for user login

module.exports = router;
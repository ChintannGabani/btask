// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // Generate JWT
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login user
// Login user
const loginUser = asyncHandler(async (req, res) => {
  console.log("📥 Incoming Login Body:", req.body);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log("🔍 Found User:", user);

  if (!user) {
    res.status(401);
    throw new Error("User not found with this email");
  }

  // Check if matchPassword exists
  if (!user.matchPassword) {
    console.log("⚠️ matchPassword function missing!");
    res.status(500);
    throw new Error("matchPassword not implemented in User model");
  }

  const isMatch = await user.matchPassword(password);
  console.log("🔑 Password Match:", isMatch);

  if (isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { registerUser, loginUser };
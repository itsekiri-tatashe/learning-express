const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// Middle
const auth = require("../middleware/auth");
// Import DB Schema
const User = require("../models/User");

// Import Joi schemas
const {
  registerUserSchema,
  loginUserSchema,
} = require("../validators/authSchema");

// Register User
router.post("/register", async (req, res) => {
  try {
    // Validation
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = req.body;

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User and save
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB error for duplicate key
      return res.status(409).json({ message: "User already exists." });
    }
    res.status(500).json({ message: "Internal server error." });
  }
});

// Log In
router.post("/login", async (req, res) => {
  try {
    // Validation
    const { error } = loginUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Send Token to Header
    res
      .status(200)
      .header("x-auth-token", token)
      .json({ message: "User logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
});

// Me
router.get("/me", auth, async (req, res) => {
  // Get current user from the current token
  const user = await User.findById(req.user.id).select("-password");
  res.send(user);
});
module.exports = router;

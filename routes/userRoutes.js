// Import required modules and models
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { signToken } = require("../utils/auth");

//Handles user registration: @route POST /api/users/register

router.post("/register", async (req, res) => {
  try {
    //extract user data from request body
    const { username, email, password } = req.body;

    //validate required fields
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "username, email, password required" });

    //check for existing user with same email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "User already exists" });

    //create new user
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    //generate JWT token for user
    const token = signToken(user);

    //return success response with token and user data,excluding password
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    //log full error and return server error response with error message
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//handles user login: @route POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    //extract email and password from request body
    const { email, password } = req.body;

    //validate required fields
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    //find user by email and select password field (which is normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    //check if user exists and password is correct
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await user.isCorrectPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    //generate JWT token for user
    const token = signToken(user);

    //return success response with token and user data
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    //log full error and return server error response with error message
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

//export router
module.exports = router;

const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

router.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

// Password Hasing with bcrypt
const getHashedPassword = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Password Checking
const checkPassword = async (hashedPassword, password) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate Token

const getToken = (user) => {
  delete user.password;
  const token = jwt.sign(user, process.env.JWT_PRIVATE_KEY);
  return `Bearer ${token}`;
};

// Register Route Start

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    console.log(existingUser);
    if (!existingUser) {
      const newUser = new User(req.body);
      newUser.password = await getHashedPassword(req.body.password);
      await newUser.save();
      console.log("Registration Successful!");
      res.json({ message: "Registration Successful!", status: 201 });
    } else {
      console.log(
        `Aborting user registration as user already registered with this email: ${req.body.email}`
      );
      res.status(400).json({ message: "Email already in use!", status: 400 });
    }
  } catch (e) {
    console.log("Registration Failed!");
    console.log("Error details: ", e);
    res.status(500).json({ message: "Registration failed!", status: 500 });
  }
});

// Register Route End

// Login Route Start

router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    const matchedPassword = await checkPassword(
      existingUser.password,
      req.body.password
    );
    if (matchedPassword) {
      const token = getToken({ ...existingUser });
      return res.status(200).json({ token: token, status: 200 });
    } else {
      res.status(400).json({ message: "Password did not match.", status: 400 });
    }
  } else {
    res.status(400).json({ message: "User doesn't exist", status: 400 });
  }
});

// Login Route End

module.exports = router;

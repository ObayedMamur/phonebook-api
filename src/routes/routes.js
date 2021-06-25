const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

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

module.exports = router;

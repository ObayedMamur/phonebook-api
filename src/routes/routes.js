const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

router.post("/register", async (req, res) => {
  try {
    const existingUser = User.findOne({ email: req.body.email });
    if (!existingUser) {
      const newUser = new User(req.body);
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

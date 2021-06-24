const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "App is running" });
});

router.post("/register", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    console.log("Registration Successful!");
    res.json({ message: "Registration Successful!", status: 201 });
  } catch (e) {
    console.log("Registration Failed!");
    console.log("Error details: ", e);
    res.json({ message: "Registration failed!", status: 500 });
  }
});

module.exports = router;
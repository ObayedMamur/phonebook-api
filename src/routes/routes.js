const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("../middlewares/authenticateJWT");
const createContactModel = require("../models/contact");
const { findOne } = require("../models/user");
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
      const token = getToken({
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      });
      return res.status(200).json({ token: token, status: 200 });
    } else {
      res.status(400).json({ message: "Password did not match.", status: 400 });
    }
  } else {
    res.status(400).json({ message: "User doesn't exist", status: 400 });
  }
});

// Login Route End

// Contact Route Start

router.post("/contacts", authenticateJWT, async (req, res) => {
  console.log("=================================");
  console.log("Logged In User: ");
  console.log(req.user);

  console.log("=================================");

  console.log("New Contact to add: ");
  console.log(req.body);

  console.log("=================================");

  try {
    const Contact = createContactModel(req.user.id);

    const addContact = new Contact(req.body);
    await addContact.save();

    res.status(201).json({
      message: "Contact added successfully!",
      savedContact: req.addContact,
      status: 201,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!", status: 500 });
  }
});

// Contact Route End

// Contact Update Route Start
router.put("/contacts/:id", authenticateJWT, async (req, res) => {
  const Contact = createContactModel(req.user.id);
  try {
    const contactToUpdate = await Contact.findById(req.params.id);
    if (contactToUpdate) {
      for (let key in req.body) {
        contactToUpdate[key] = req.body[key];
      }
      await contactToUpdate.save();
      res
        .status(200)
        .json({ message: "Contact Updated Successfully!", status: 200 });
    } else {
      res
        .status(400)
        .json({ message: "Error on update, contact not found", status: 400 });
    }
  } catch (err) {
    console.log("Error while updating contact!", err);
  }
});
// Contact Update Route End

// Get all Contacts Route Start

router.get("/contacts", authenticateJWT, async (req, res) => {
  const Contact = createContactModel(req.user.id);
  const allContacts = await Contact.find({});
  res.status(200).json({ status: 200, contacts: allContacts });
});

// Get all Contacts Route End

// Delete Existing Contact Start

router.delete("/contacts/:id", authenticateJWT, async (req, res) => {
  const Contact = createContactModel(req.user.id);
  await Contact.findByIdAndDelete(req.params.id);
  console.log("Deleted contact id: ", req.params.id);
  res.status(200).json({
    message: "Contact Deleted Successfully!",
    status: 200,
    deletedContactId: req.params.id,
  });
});

// Delete Existing Contact End

module.exports = router;

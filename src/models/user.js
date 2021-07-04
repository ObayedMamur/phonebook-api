const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { required: true, type: String, min: 1 },
  lastName: { required: true, type: String, min: 1 },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String, min: 6 },
});

module.exports = mongoose.model("Users", userSchema);

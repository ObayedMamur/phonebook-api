const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, min: 1 },
  lastName: { type: String, min: 1 },
  email: { type: String, min: 1 },
  phone: { type: String, min: 1 },
  homePhone: { type: String, min: 1 },
  workPhone: { type: String, min: 1 },
});

const createContactModel = (userId) => {
  return mongoose.model(`${userId}-contacts`, contactSchema);
};

module.exports = createContactModel;

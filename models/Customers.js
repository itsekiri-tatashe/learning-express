const mongoose = require("mongoose");

// Customer Schema
const customerSchema = new mongoose.Schema(
  {
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, minLength: 3, maxLength: 255 },
    phone: { type: String, minLength: 9, unique: true },
  },
  {
    toJSON: {
      // This removes the __v field from the output
      versionKey: false,
    },
    toObject: { versionKey: false },
  }
);

// Create and Export Model
const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;

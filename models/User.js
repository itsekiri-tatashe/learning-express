const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Users schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
  },
  { toObject: { versionKey: false } }
);

userSchema.methods.generateAuthToken = function () {
  // Create a JWT payload
  const payload = {
    id: this._id,
    email: this.email,
    isAdmin: this.isAdmin,
  };

  // // Sign the token with the payload and secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

// Create & Export model
const User = mongoose.model("User", userSchema);
module.exports = User;

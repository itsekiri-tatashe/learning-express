const mongoose = require("mongoose");

// Genre Schema
const genreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 4, maxLength: 50 },
    description: { type: String, minLength: 10 },
  },
  {
    toJSON: {
      // This removes the __v field from the output
      versionKey: false,
    },
    toObject: { versionKey: false },
  }
);

// Create and Export model
const Genre = mongoose.model("Genre", genreSchema);
module.exports = Genre;

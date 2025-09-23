const mongoose = require("mongoose");

// Movies Schema
const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 4 },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    numberInStock: { type: Number, min: 0 },
    dailyRentalRate: Number,
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
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;

const mongoose = require("mongoose");

// Rentals Schema
const rentalSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0, required: true },
  },
  {
    timestamps: true, // This is the key option
  }
);

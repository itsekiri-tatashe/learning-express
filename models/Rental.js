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
    dateRented: { type: Date, required: true },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0, required: true },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: {
      // This removes the __v field from the output
      versionKey: false,
    },
    toObject: { versionKey: false },
  }
);

// // Create and Export model
const Rental = mongoose.model("Rental", rentalSchema);
module.exports = Rental;

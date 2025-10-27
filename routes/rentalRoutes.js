const express = require("express");
const router = express.Router();

// Middleware
const auth = require("../middleware/auth");

// 3PL
const { differenceInDays } = require("date-fns");

// Import DB Schema
const Rental = require("../models/Rental");
const Movie = require("../models/Movies");
const Customer = require("../models/Customers");

// Import Joi schemas
const {
  createRentalSchema,
  updateRentalSchema,
  returnRentalSchema,
} = require("../validators/rentalSchema");

// Get Rentals
router.get("/", auth, async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Customer
// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res
//         .status(404)
//         .json({ message: "The customer with provided ID does not exist" });
//     }
//     res.status(200).json(customer);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

/* 
Add New Rental (POST)
Check if movie is in stock, if in stiok throw error
If in stock subtract -1

*/
// Create a new Rental
router.post("/", auth, async (req, res) => {
  // Joi Validation
  const { error } = createRentalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Step 1: Verify the customer and movie exist
    const customer = await Customer.findById(req.body.customer);
    if (!customer) {
      return res.status(400).json({ message: "Invalid customer." });
    }

    // Step 2: Atomically check and update the movie's stock
    const updatedMovie = await Movie.findOneAndUpdate(
      {
        _id: req.body.movie,
        numberInStock: { $gt: 0 }, // Condition: only update if stock is greater than 0
      },
      {
        $inc: { numberInStock: -1 }, // Action: atomically decrement the stock by 1
      },
      { new: true } // Return the updated document
    );

    // If updatedMovie is null, the query failed (either out of stock or ID not found)
    if (!updatedMovie) {
      return res
        .status(409)
        .json({ message: "Movie is out of stock or does not exist." });
    }

    // Step 3: Create and save the new rental
    const rental = new Rental({
      customer: customer._id,
      movie: updatedMovie._id,
      dateRented: req.body.dateRented,
      rentalFee: req.body.rentalFee,
    });

    const newRental = await rental.save();

    // Populate the response with the movie and customer data for the client
    const populatedRental = await Rental.findById(newRental._id)
      .populate("customer", "name phone")
      .populate("movie", "title");

    res.status(201).json(populatedRental);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error creating rental:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update Rental (PUT)
router.put("/:id", auth, async (req, res) => {
  // Validation
  const { error } = updateRentalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const rental = await Rental.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!rental) {
      return res
        .status(404)
        .json({ message: "The Rental with provided ID does not exist" });
    }
    res.status(200).json(rental);
  } catch (err) {
    const errorMessages = Object.values(ex.errors).map(
      (error) => error.message
    );
    res.status(400).json({ errors: errorMessages });
  }
});

// Return a Rental
router.put("/return/:id", auth, async (req, res) => {
  // Get Rental ID
  const { id } = req.params;

  // Get Movie ID
  const movieId = req.body.movie;

  // Request Validation
  const { error } = returnRentalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Find the rental document
    const rental = await Rental.findById(id);

    // Check if the rental exists
    if (!rental) {
      return res.status(404).json({ message: "Rental not found." });
    }
    // Check if the rental has already been returned
    if (rental.isReturned) {
      return res
        .status(400)
        .json({ message: "Rental has already been returned." });
    }

    // Get Movie ID
    const movieId = rental.movie;

    // Check if the movie still exists then update it
    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: movieId },
      { $inc: { numberInStock: 1 } },
      { new: true }
    );

    // Handle case where movie might have been deleted from the database
    if (!updatedMovie) {
      return res
        .status(404)
        .json({ message: "Movie associated with this rental not found." });
    }

    // Update Date Returned and Mark as Returned
    rental.isReturned = true;
    rental.dateReturned = req.body.dateReturned;

    // Calculate the rental fee based on the dateReturned and dailyRentalRate
    const daysRented = differenceInDays(rental.dateReturned, rental.dateRented);
    rental.rentalFee = daysRented * updatedMovie.dailyRentalRate;

    const savedRental = await rental.save();
    // Step 4: Respond with success
    res.status(200).json({
      message: "Return of rental was successful",
      rental: savedRental,
    });
  } catch (err) {
    console.error("Error returning rental:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Delete Customer (DELETE)
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return res
//         .status(404)
//         .json({ message: "The customer with provided ID does not exist" });
//     }
//     const deletedCustomer = await Customer.deleteOne({ _id: id });
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });

module.exports = router;

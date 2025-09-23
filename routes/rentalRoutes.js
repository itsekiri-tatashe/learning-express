const express = require("express");
const router = express.Router();

// Import DB Schema
const Rental = require("../models/Rental");

// Import Joi schemas
const { createRentalSchema } = require("../validators/rentalSchema");

// Get Rentals
router.get("/", async (req, res) => {
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

// Add New customer (POST)
router.post("/", async (req, res) => {
  // Validation
  const { error } = createRentalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const rental = new Rental(req.body);
    const newRental = await rental.save();
    res.status(201).json(newRental);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update Customer (PUT)
// router.put("/:id", async (req, res) => {
//   // Validation
//   const { error } = updateCustomerSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   const { id } = req.params;

//   try {
//     const customer = await Customer.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!customer) {
//       return res
//         .status(404)
//         .json({ message: "The customer with provided ID does not exist" });
//     }
//     res.status(200).json(customer);
//   } catch (err) {
//     const errorMessages = Object.values(ex.errors).map(
//       (error) => error.message
//     );
//     res.status(400).json({ errors: errorMessages });
//   }
// });

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

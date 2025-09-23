const express = require("express");
const router = express.Router();

// Import DB Schema
const Customer = require("../models/Customers");

// Import Joi schemas
const {
  createCustomerSchema,
  updateCustomerSchema,
} = require("../validators/customerSchema");

// Get Customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Customer
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "The customer with provided ID does not exist" });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New customer (POST)
router.post("/", async (req, res) => {
  // Validation
  const { error } = createCustomerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, phone, isGold } = req.body;

  const customer = new Customer({
    isGold: isGold,
    name: name,
    phone: phone,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (ex) {
    // Error Handling if Phone Number is a duplicate
    if (ex.code === 11000) {
      return res
        .status(409)
        .json({ message: "A customer with this phone number already exists." });
    }

    const errorMessages = Object.values(ex.errors).map(
      (error) => error.message
    );
    res.status(400).json({ errors: errorMessages });
  }
});

// Update Customer (PUT)
router.put("/:id", async (req, res) => {
  // Validation
  const { error } = updateCustomerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { id } = req.params;

  try {
    const customer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "The customer with provided ID does not exist" });
    }
    res.status(200).json(customer);
  } catch (err) {
    const errorMessages = Object.values(ex.errors).map(
      (error) => error.message
    );
    res.status(400).json({ errors: errorMessages });
  }
});

// Delete Customer (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "The customer with provided ID does not exist" });
    }
    const deletedCustomer = await Customer.deleteOne({ _id: id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;

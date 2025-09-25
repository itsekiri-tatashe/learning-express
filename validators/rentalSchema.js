const Joi = require("joi");

// Schema for /POST Rental
const createRentalSchema = Joi.object({
  customer: Joi.string().required(),
  movie: Joi.string().required(),
  dateRented: Joi.date().required(),
});

// Schema for /PUT Rental
const updateRentalSchema = Joi.object({
  customer: Joi.string().optional(),
  movie: Joi.string().optional(),
  dateRented: Joi.date().optional(),
  dateReturned: Joi.date().optional(),
  rentalFee: Joi.number().optional(),
  isReturned: Joi.boolean().optional(),
});

const returnRentalSchema = Joi.object({
  dateReturned: Joi.date().required(),
});

// Export
module.exports = {
  createRentalSchema,
  updateRentalSchema,
  returnRentalSchema,
};

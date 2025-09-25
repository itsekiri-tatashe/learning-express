const Joi = require("joi");

// Schema for /POST Rental
const createRentalSchema = Joi.object({
  customer: Joi.objectId().required(),
  movie: Joi.objectId().required(),
  dateRented: Joi.date().required(),
});

// Schema for /PUT Rental
const updateRentalSchema = Joi.object({
  customer: Joi.objectId().optional(),
  movie: Joi.objectId().optional(),
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

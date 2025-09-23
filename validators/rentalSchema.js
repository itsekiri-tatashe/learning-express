const Joi = require("joi");

// Schema for /POST Customer
const createRentalSchema = Joi.object({
  customer: Joi.string().required(),
  movie: Joi.string().required(),
  dateRented: Joi.date().required(),
  rentalFee: Joi.number().required(),
});

// Export
module.exports = {
  createRentalSchema,
};

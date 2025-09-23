const Joi = require("joi");

// Schema for /POST Customer
const createMovieSchema = Joi.object({
  title: Joi.string().required(),
  numberInStock: Joi.number().optional(),
  dailyRentalRate: Joi.number().optional(),

  // The genres field must be an array of strings
  genres: Joi.array().items(Joi.string().required()),
});

// Export
module.exports = {
  createMovieSchema,
};

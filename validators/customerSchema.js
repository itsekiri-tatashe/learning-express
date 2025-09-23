const Joi = require("joi");

// Schema for /POST Customer
const createCustomerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().min(9).required(),
  isGold: Joi.boolean().optional(),
});

// Schema for /PUT Customer
// Making all fields optuonal since you dont need to update all
const updateCustomerSchema = Joi.object({
  name: Joi.string().optional(),
  phone: Joi.string().min(9).optional(),
  isGold: Joi.boolean().optional(),
});

// Export
module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};

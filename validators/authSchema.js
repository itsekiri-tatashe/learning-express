const Joi = require("joi");

// Schema for Register User
const registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(5).required().email(),
  password: Joi.string().min(8).required(),
});

// Schema for Sign In User
const loginUserSchema = Joi.object({
  email: Joi.string().min(5).required().email(),
  password: Joi.string().min(8).required(),
});

// Export
module.exports = {
  registerUserSchema,
  loginUserSchema,
};

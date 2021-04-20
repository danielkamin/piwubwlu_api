const Joi = require('joi');

exports.registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .email().max(50),
      firstName:Joi.string().min(3).max(15),
      lastName:Joi.string().min(2).max(50),
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .required()
      .strict().max(20),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
    acceptRegulations:Joi.boolean().invalid(false)
  });
  return schema.validate(data);
};
exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .email(),
    password: Joi.string().required()
  });
  return schema.validate(data);
};
exports.adminLoginValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
exports.emailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .email().max(50),
  });
  return schema.validate(data);
};
exports.newPasswordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string()
      .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      .required()
      .strict().max(20),
    repeatPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
  });
  return schema.validate(data);
};
exports.guestProfileValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(15).required(),
    email: Joi.string()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .email().max(50),
    telephone:Joi.string().min(7).max(15),
    room:Joi.string().min(1).max(15)
  });
  return schema.validate(data);
};
exports.profileValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required().max(15),
    lastName: Joi.string().min(3).required().max(50),
    information: Joi.any(),
    email: Joi.string()
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
      .required()
      .email().max(50),
  });
  return schema.validate(data);
};

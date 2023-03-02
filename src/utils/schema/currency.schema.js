import Joi from 'joi';

const currencySchema = Joi.object({
  currencyName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Currency Name is required',
    'string.empty': 'Currency Name is not allowed to be empty',
    'string.min':
      'Currency Name length must be at least 2 characters long',
  }),
  currencyCode: Joi.string().trim().min(2).required().messages({
    'any.required': 'Currency Code is required',
    'string.empty': 'Currency Code is not allowed to be empty',
    'string.min':
      'Currency Code length must be at least 2 characters long',
  }),
  icon: Joi.string().trim().required().messages({
    'any.required': 'icon is required',
    'string.empty': 'icon is not allowed to be empty',
  }),
  companyName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Company Name is required',
    'string.empty': 'Company Name is not allowed to be empty',
    'string.min':
      'Company Name length must be at least 2 characters long',
  }),
  companyUrl: Joi.string().trim().min(2).required().messages({
    'any.required': 'Company URL is required',
    'string.empty': 'Company URL is not allowed to be empty',
    'string.min':
      'Company URL length must be at least 2 characters long',
  }),
  taxName: Joi.string().trim().min(2).required().messages({
    'any.required': 'Tax Name is required',
    'string.empty': 'Tax Name is not allowed to be empty',
    'string.min':
      'Tax Name length must be at least 2 characters long',
  }),
  taxPercentage: Joi.number().min(0).max(100).required().messages({
    'any.required': 'Tax Percentage is required',
    'number.empty': 'Tax Percentage is not allowed to be empty',
    'number.min': 'Tax Percentage must not be less than 0',
    'number.max':
      'Tax Percentage must not be equal or greater than 100',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email is not allowed to be empty',
    'string.email': 'Email must be a valid email',
  }),
  phone: Joi.string().trim().min(2).required().messages({
    'any.required': 'Phone is required',
    'string.empty': 'Phone is not allowed to be empty',
    'string.min': 'Phone length must be at least 2 characters long',
  }),
  address1: Joi.string().trim().min(2).required().messages({
    'any.required': 'Address1 is required',
    'string.empty': 'Address1 is not allowed to be empty',
    'string.min':
      'Address1 length must be at least 2 characters long',
  }),
  address2: Joi.string().allow(''),
  country: Joi.string().required().messages({
    'any.required': 'Country is required',
    'string.empty': 'Country is not allowed to be empty',
  }),
  city: Joi.string().required().messages({
    'any.required': 'City is required',
    'string.empty': 'City is not allowed to be empty',
  }),
  state: Joi.string().allow('').optional(),
  postalCode: Joi.string().allow('').optional(),
}).options({ abortEarly: false });

export default currencySchema;

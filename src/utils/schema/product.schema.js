import Joi from 'joi';

// eslint-disable-next-line import/prefer-default-export
export const productSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name is required',
    'string.empty': 'Name is not allowed to be empty',
  }),
  bgColor: Joi.string().required().messages({
    'any.required': 'Background color is required',
    'string.empty': 'Background color is not allowed to be empty',
  }),
  customer: Joi.string().required().messages({
    'any.required': 'Customer is required',
    'string.empty': 'Customer is not allowed to be empty',
  }),
  project: Joi.string().required().messages({
    'any.required': 'Project is required',
    'string.empty': 'Project is not allowed to be empty',
  }),
  price: Joi.number().optional().allow('', null),
  sku: Joi.string().optional().allow('', null),
  status: Joi.string().optional().allow(''),
  description: Joi.string().optional().allow(''),
  website: Joi.string().optional().allow(''),
  image: Joi.object().optional(),
  imageIcon: Joi.string().optional(),
  itemNumber: Joi.number().optional(),
  parentId: Joi.string().optional().allow('', null),
  duplicate: Joi.number().optional().default(false),
}).options({ abortEarly: false });

/* eslint-disable import/prefer-default-export */
import Joi from 'joi';

export const subscriptionPlanSchema = Joi.object({
  TypeSubscriptionPlan: Joi.string().required().messages({
    'any.required': 'TypeSubscriptionPlan is required',
    'string.empty': 'TypeSubscriptionPlan is not allowed to be empty',
  }),
  user: Joi.string().messages(),
  SubscriptionPlanName: Joi.string().required().messages({
    'any.required': 'Subscription Plan Name is required',
    'string.empty':
      'Subscription Plan Name is not allowed to be empty',
  }),
  subheader: Joi.string().required().messages({
    'any.required': 'Subscription header is required',
    'string.empty': 'Subscription header is not allowed to be empty',
  }),
  Visibility: Joi.string().required().messages({
    'any.required': 'Visibility is required',
    'string.empty': 'Visibility is not allowed to be empty',
  }),
  plandetailchecklist: Joi.array().required().messages({
    'any.required': 'plandetailchecklist is required',
    'string.empty': 'plandetailchecklist is not allowed to be empty',
  }),
  billingCycle: Joi.array().required().messages({
    'any.required': 'billing is required',
    'string.empty': 'billing is not allowed to be empty',
  }),
  discountValue: Joi.number().optional().messages({
    'any.required': 'discount value is required',
    'string.empty': 'discount value is not allowed to be empty',
  }),
  NumberofAssets: Joi.optional().messages(),

  NumberofClicks: Joi.optional().messages(),
  Validity: Joi.string().required().messages({
    'any.required': 'Validity is required',
    'string.empty': 'Validity is not allowed to be empty',
  }),
  PayPerclick: Joi.string().required().messages({
    'any.required': 'PayPerclick is required',
    'string.empty': 'PayPerclick is not allowed to be empty',
  }),
  PayPerClickCharge:Joi.number().precision(4).optional().messages({
    'any.required': 'PayPerClickCharge  is required',
    'string.empty': 'PayPerClickCharge  is not allowed to be empty',
  }),
  DiscountApplicable: Joi.string().required().messages({
    'any.required': 'DiscountApplicable is required',
    'string.empty': 'DiscountApplicable is not allowed to be empty',
  }),
  DiscountType: Joi.string().allow(null).messages(),
  CouponApplicable: Joi.string().required().messages({
    'any.required': 'CouponApplicable is required',
    'string.empty': 'CouponApplicable is not allowed to be empty',
  }),
  RedemptionofPoints: Joi.string().required().messages({
    'any.required': 'RedemptionofPoints is required',
    'string.empty': 'RedemptionofPoints is not allowed to be empty',
  }),
});

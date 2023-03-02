/* eslint-disable import/prefer-default-export */
import handleErrorsUtil from '../../utils/handle-errors.util';
import { subscriptionPlanSchema } from '../../utils/schema/subscriptionPlan.schema';

/**
 * *Handle create account validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
export const validateSubscriptionBody = (req, res, next) => {
  return handleErrorsUtil(
    subscriptionPlanSchema,
    req.body,
    res,
    next,
  );
};

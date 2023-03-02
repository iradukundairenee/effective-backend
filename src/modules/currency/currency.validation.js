import handleErrorsUtil from '../../utils/handle-errors.util';
import currencySchema from '../../utils/schema/currency.schema';

/**
 * *Handle login validation.
 * @param {object} req request
 * @param {object} res response
 * @param {object} next function
 * @returns {object} Object
 */
const CurrencyValidation = (req, res, next) => {
  return handleErrorsUtil(currencySchema, req.body, res, next);
};

export default CurrencyValidation;

import { CONFLICT, INTERNAL_SERVER_ERROR } from 'http-status';
import Currency from '../../database/model/currency.model';
import ResponseUtil from '../../utils/response.util';

export const checkExistCurrency = async (req, res, next) => {
  try {
    const { currencyName } = req.body;
    // let conditions = { currencyName };
    const currency = await Currency.findOne({ currencyName });
    if (currency) {
      ResponseUtil.setError(
        CONFLICT,
        'Currency with this name already exists',
      );
      return ResponseUtil.send(res);
    }
    next();
  } catch (error) {
    return ResponseUtil.handleErrorResponse(
      INTERNAL_SERVER_ERROR,
      error.toString(),
      res,
    );
  }
};

export const checkIfCurrencyExistById = async (req, res, next) => {
  try {
    const { currencyId } = req.params;
    const currency = await Currency.findById(currencyId);
    if (!currency) {
      ResponseUtil.setError(CONFLICT, 'Currency not found');
      return ResponseUtil.send(res);
    }
    next();
  } catch (error) {
    return ResponseUtil.handleErrorResponse(
      INTERNAL_SERVER_ERROR,
      error.toString(),
      res,
    );
  }
};

import { Router } from 'express';
import currency from './currency.controller';
import CurrencyValidation from './currency.validation';
import { isAdminOrManager } from '../middleware/auth.middleware';
import {
  checkExistCurrency,
  checkIfCurrencyExistById,
} from './currency.middleware';

const currencyRouter = Router();

currencyRouter.post(
  '/',
  isAdminOrManager,
  CurrencyValidation,
  checkExistCurrency,
  currency.createCurrency,
);

currencyRouter.get('/', isAdminOrManager, currency.getCurrency);

currencyRouter.get('/userCurrency', currency.getCurrencyByUser);

currencyRouter.post(
  '/client/:userId/:currencyId',
  isAdminOrManager,
  checkIfCurrencyExistById,
  currency.addCurrencyToProfile,
);

currencyRouter.get(
  '/client/:currencyId',
  isAdminOrManager,
  currency.getProfileCurrencies,
);

currencyRouter.patch(
  '/:id',
  isAdminOrManager,
  CurrencyValidation,
  currency.updateCurrency,
);

currencyRouter.get('/:id', currency.getSingleCurrency);

export default currencyRouter;

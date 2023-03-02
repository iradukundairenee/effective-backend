import { Router } from 'express';
import {
  mail,
  notifyInvoicePayment,
  notifySubscriptionPayment,
} from './mail.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const mailRouter = Router();

mailRouter.post('/', mail);
mailRouter.post(
  '/notify',
  isAuthenticated,
  notifySubscriptionPayment,
);
mailRouter.post(
  '/notifyPaidInvoice',
  isAuthenticated,
  notifyInvoicePayment,
);

export default mailRouter;

import { Router } from 'express';
import { isAdminOrManager } from '../middleware/auth.middleware';
import invoice from './invoice.controller';
import {
  validateInvoiceUpdate,
  validateInvoiceBody,
} from './invoice.validation';

const {
  getAllInvoices,
  paymentOfInvoice,
  createInvoicePdf,
  downloadInvoice,
  getInvoice,
  updateInvoiceStatusAfterPayment,
  applyCouponOnInvoice,
  applyPointsOnInvoice,
} = invoice;
const invoiceRouter = Router();

invoiceRouter.post('/', validateInvoiceBody, invoice.generateInvoice);
invoiceRouter.patch(
  '/:id',
  validateInvoiceUpdate,
  isAdminOrManager,
  paymentOfInvoice,
);
invoiceRouter.get('/', getAllInvoices);
invoiceRouter.get('/:invoiceId', getInvoice);
invoiceRouter.patch('/:invoiceId/applyCoupon', applyCouponOnInvoice);
invoiceRouter.patch('/:invoiceId/applyPoints', applyPointsOnInvoice);
invoiceRouter.post('/:invoiceId/create-invoice', createInvoicePdf);
invoiceRouter.get('/:invoiceId/download-invoice', downloadInvoice);
invoiceRouter.patch(
  '/status/:invoiceId',
  updateInvoiceStatusAfterPayment,
);

export default invoiceRouter;

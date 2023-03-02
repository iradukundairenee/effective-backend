import { Router } from 'express';
import quote from './quote.controller';
import {
  isAdminOrManager,
  isNotVisitor,
} from '../middleware/auth.middleware';
import { validateQuoteBody } from './quote.validation';
import { doesQuoteExist } from './quote.middleware';

const quoteRouter = Router();
const {
  createQuote,
  getAllQuotes,
  updateQuote,
  getQuoteDetails,
  getLicenseAgreement,
  addTax,
  updateItems,
  deleteItem,
  updateProposalText,
  updateLicenseAgreement,
  updateTax,
  removeTax,
  sendQuote,
  acceptQuote,
  rejectQuote,
  updateDiscount,
  createPdf,
  downloadPdf,
} = quote;

quoteRouter.post(
  '/',
  isAdminOrManager,
  validateQuoteBody,
  createQuote,
);
quoteRouter.get('/license-agreement/', getLicenseAgreement);

quoteRouter.patch('/:id', isNotVisitor, doesQuoteExist, updateQuote);
quoteRouter.get('/', getAllQuotes);
quoteRouter.get('/:quoteId', getQuoteDetails);

// add tax
quoteRouter.post('/tax/:quoteId', isAdminOrManager, addTax);

// update license agreement
quoteRouter.post(
  '/updateLicenseAgreement/',
  isAdminOrManager,
  updateLicenseAgreement,
);

quoteRouter.patch(
  '/:quoteId/items/:itemId',
  isAdminOrManager,
  updateItems,
);
quoteRouter.delete(
  '/:quoteId/item/:itemId',
  isAdminOrManager,
  deleteItem,
);

//  update tax
quoteRouter.patch(
  '/tax/:quoteId/:taxId',
  isAdminOrManager,
  updateTax,
);

// update proposal text
quoteRouter.patch(
  '/updateProposalText/:quoteId',
  isAdminOrManager,
  updateProposalText,
);

// remove tax
quoteRouter.delete(
  '/tax/:quoteId/:taxId',
  isAdminOrManager,
  removeTax,
);

quoteRouter.patch('/send/:quoteId/', isAdminOrManager, sendQuote);

quoteRouter.patch('/accept/:quoteId', acceptQuote);
quoteRouter.patch('/reject/:quoteId', rejectQuote);
quoteRouter.post('/:quoteId/create-pdf', createPdf);
quoteRouter.get('/:quoteId/download-pdf', downloadPdf);

// update discount
quoteRouter.patch(
  '/discount/:quoteId',
  isAdminOrManager,
  updateDiscount,
);

export default quoteRouter;

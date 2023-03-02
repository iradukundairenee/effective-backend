import { Router } from 'express';
import ItemController from './items.controller';
import { isAdminOrManager } from '../middleware/auth.middleware';

const itemRouter = Router();

const {
  createItem,
  getItems,
  updateItem,
  addProposalItem,
  getProposalItems,
  removeProposalItem,
  updateProposalItem,
  getUnUsedItems,
  getUnAddedItems,
} = ItemController;

itemRouter.get('/', isAdminOrManager, getItems);
itemRouter.post('/', isAdminOrManager, createItem);

itemRouter.patch('/:itemId', isAdminOrManager, updateItem);

itemRouter.get('/all/:proposalId', getProposalItems);
itemRouter.post(
  '/add/:proposalId/',
  isAdminOrManager,
  addProposalItem,
);

itemRouter.delete(
  '/delete/:itemId/:proposalId',
  isAdminOrManager,
  removeProposalItem,
);

itemRouter.patch(
  '/update/:itemId/:proposalId',
  isAdminOrManager,
  updateProposalItem,
);

itemRouter.get(
  '/unAdded/:proposalId',
  isAdminOrManager,
  getUnAddedItems,
);

itemRouter.get('/unUsed', isAdminOrManager, getUnUsedItems);

export default itemRouter;

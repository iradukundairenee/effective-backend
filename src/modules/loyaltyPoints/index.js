import { Router } from 'express';
import LoyaltyPointsController from './loyaltyPoints.controller';

const {
  getLoyaltyPoints,
  createLoyalyPoints,
  getSingleLoyaltyPoints,
  updateLoyalyPoints,
} = LoyaltyPointsController;

const loyaltyPointsRouter = Router();

loyaltyPointsRouter.get('/', getLoyaltyPoints);

loyaltyPointsRouter.get('/:pointsId', getSingleLoyaltyPoints);

loyaltyPointsRouter.post('/', createLoyalyPoints);

loyaltyPointsRouter.patch('/:pointsId', updateLoyalyPoints);

export default loyaltyPointsRouter;

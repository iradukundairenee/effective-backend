import { Router } from 'express';
import subscription from './subscription.controller';
import { isAdminOrManager } from '../middleware/auth.middleware';

const subscriberRouter = Router();

subscriberRouter.post(
  '/:subscriptionPlanId',
  subscription.subscribing,
);

subscriberRouter.post(
  '/add/:subscriptionPlanId',
  subscription.subscribeOrChangeSubcriptionPlan,
);

subscriberRouter.get(
  '/',
  isAdminOrManager,
  subscription.getSubscribers,
);
subscriberRouter.get(
  '/currentSubscription',
  subscription.getCurrentSubscription,
);

export default subscriberRouter;

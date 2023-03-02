import { Router } from 'express';
import { validateSubscriptionBody } from './subscriptionPlan.validation';
import { checkSubscription } from './subscriptionPlan.middleware';
import { isAdminOrManager } from '../middleware/auth.middleware';
import SubscriptionController from './subscriptionPlan.controller';

const router = Router();

router.get('/', SubscriptionController.getAllSubscription);

router.get(
  '/:subscribeId',
  SubscriptionController.getSubscriptionDetails,
);

router.post(
  '/create',
  isAdminOrManager,
  validateSubscriptionBody,
  checkSubscription,
  SubscriptionController.UserSubscription,
);

router.post(
  '/:subscriptionPlanId/create/:userId',
  isAdminOrManager,
  SubscriptionController.addUserToPrivateSubscription,
);

router.get(
  '/:subscriptionPlanId/customers/',
  SubscriptionController.getPrivateSubscriptionCustomers,
);

router.patch(
  '/edit/:id',
  checkSubscription,
  validateSubscriptionBody,
  SubscriptionController.updateSubscription,
);

router.patch(
  '/delete/:id',
  checkSubscription,
  SubscriptionController.deleteSubscription,
);

router.get(
  '/userPlans/all',
  SubscriptionController.getAllUserSubscriptionPlans,
);

export default router;

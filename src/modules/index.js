import express, { Router } from 'express';
import homeRouter from './home';
import mailRouter from './mail';
import userRouter from './auth/user.route';
import invoiceRouter from './invoice';
import serviceRouter from './services/service.route';
import {
  isAuthenticated,
  isAdminOrManager,
  isClient,
  isAdmin,
} from './middleware/auth.middleware';
import orderRouter from './order';
import subscriptionPlanRouter from './subscriptionPlan';
import projectRouter from './project';
import quoteRouter from './quote';
import commentRouter from './comments';
import conversationRouter from './conversation';
import subscriptionRouter from './subscription';
import productRouter from './product';
import { serverResponse } from '../utils/response';
import logsRouter from './logs';
import currencyRouter from './currency';
import couponRouter from './coupons';
import crmRouter from './crm/index';
import loyaltyPointsRouter from './loyaltyPoints';
import dashboardRouter from './dashboard';
import paymentRouter from './payment/index';
import itemRouter from './proposalItems';
import imageRouter from './images';
import sessionRouter from './session';

const router = Router();
router.use('/home', homeRouter);
router.use('/auth', userRouter);
router.use('/mail', mailRouter);
router.use('/user', userRouter);
router.use('/invoice', isAuthenticated, invoiceRouter);
router.use('/services', serviceRouter);
router.use('/edit-profile', userRouter);
router.use('/order', isAuthenticated, orderRouter);
router.use(
  '/subscriptionPlan',
  isAuthenticated,
  subscriptionPlanRouter,
);
router.use('/project', isAuthenticated, projectRouter);
router.use('/quote', isAuthenticated, quoteRouter);
router.use('/products', productRouter);
router.use('/comment', isAuthenticated, commentRouter);
router.use('/conversation', isAuthenticated, conversationRouter);
router.use('/subscription', isAuthenticated, subscriptionRouter);
router.use('/currency', isAuthenticated, currencyRouter);
router.use('/coupons', isAuthenticated, couponRouter);
router.use('/crm', isAuthenticated, isAdminOrManager, crmRouter);
router.use(
  '/loyaltypoints',
  isAuthenticated,
  isAdmin,
  loyaltyPointsRouter,
);
router.use('/dashboard', dashboardRouter);
router.use('/logs', isAuthenticated, logsRouter);
router.use('/payment', isAuthenticated, isClient, paymentRouter);
router.use('/charges', paymentRouter);
router.use('/item', isAuthenticated, itemRouter);
router.use('/session', sessionRouter);

router.use('upload/images', isAuthenticated, imageRouter);
router.use('/images', express.static(process.env.IMAGES_ZONE));
router.use('/files', express.static(process.env.IMAGES_3D_ZONE));
router.use('/profiles', express.static(process.env.PROFILES_ZONE));
router.use('/icon', express.static(process.env.ASSET_ICON));
router.all('/*', (_req, res) => {
  return serverResponse(res, 404, "Oops, you're lost");
});

export default router;

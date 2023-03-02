import { Router } from 'express';
import { isAdmin } from '../middleware/auth.middleware';
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  removeUserOnCoupon,
  getCouponCustomers,
  addCouponOnCustomer,
  getClientCoupon,
} from './coupon.controller';

const couponRouter = Router();

couponRouter.post('/create', isAdmin, createCoupon);

couponRouter.get('/', isAdmin, getAllCoupons);

couponRouter.get('/clientCoupon', getClientCoupon);

couponRouter.get('/:couponId', isAdmin, getCoupon);

couponRouter.get('/:couponId/customers', isAdmin, getCouponCustomers);

couponRouter.post('/:couponId/:userId', isAdmin, addCouponOnCustomer);

couponRouter.delete(
  '/:couponId/:userId',
  isAdmin,
  removeUserOnCoupon,
);

couponRouter.patch('/:couponId', isAdmin, updateCoupon);

export default couponRouter;

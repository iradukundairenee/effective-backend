import { Router } from 'express';
import PaymentController from './paymentController';

const router = Router();

router.post('/pay', PaymentController.createPaymentSession);
router.get('/success', PaymentController.getSessionOnSuccess);
router.post('/generatePoints', PaymentController.generatePoints);

export default router;

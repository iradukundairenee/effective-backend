import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import LoyaltyPoints from '../../database/model/loyaltyPoints.model';
import User from '../../database/model/user.model';
import { serverResponse } from '../../utils/response';
import ResponseUtil from '../../utils/response.util';
import stripe from '../../utils/stripe.util';

class PaymentController {
  static async createPaymentSession(req, res) {
    try {
      const {
        paymentMode,
        name,
        interval,
        intervalCount,
        planId,
        cancelUrl,
        currency,
        invoiceId,
      } = req.body;
      let { amount } = req.body;
      const BASE_URL = process.env.FRONTEND_URL;
      let session;
      if (paymentMode.length === 0) {
        return serverResponse(
          res,
          BAD_REQUEST,
          'Payment mode not specified',
        );
      }
      amount *= 100;
      if (paymentMode === 'invoice') {
        session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: 'Invoice Payment',
                },
                unit_amount: parseInt(amount, 10),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${BASE_URL}/dashboard/payment?status=success&invoiceId=${invoiceId}&sessionId={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
        });
      }
      if (paymentMode === 'subscription') {
        session = await stripe.checkout.sessions.create({
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name,
                },
                unit_amount: amount,
                recurring: {
                  interval,
                  interval_count: intervalCount,
                },
              },
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${BASE_URL}/dashboard/payment?status=success&planId=${planId}&sessionId={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
        });
      }

      return serverResponse(res, 200, 'Success', session);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async getSessionOnSuccess(req, res) {
    try {
      const { sessionId } = req.query;
      const session = await stripe.checkout.sessions.retrieve(
        sessionId,
      );
      return serverResponse(res, 200, 'Success', session);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async generatePoints(req, res) {
    try {
      const { amount } = req.body;
      const { _id: userId } = req.userData;
      const loyaltyPoints = await LoyaltyPoints.find();
      const userPoints = await User.findById(userId, 'loyaltyPoints');
      let addedPoints;
      if (loyaltyPoints[0].purchasedAmount <= amount) {
        addedPoints = await User.findByIdAndUpdate(
          userId,
          {
            loyaltyPoints: {
              ...userPoints.loyaltyPoints,
              accruedPoints:
                (userPoints.loyaltyPoints.accruedPoints +=
                  loyaltyPoints[0].generatedPoints),
            },
          },
          { new: true },
        );
      }

      return ResponseUtil.handleSuccessResponse(
        OK,
        'Successfully added',
        addedPoints,
        res,
      );
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        error,
      });
    }
  }
}

export default PaymentController;

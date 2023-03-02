import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import Subscriber from '../../database/model/subscription.model';
import SubscriptionPlan from '../../database/model/subscriptionPlan.model';
import { serverResponse } from '../../utils/response';
import Product from '../../database/model/product.model';

const subscribing = async (req, res) => {
  try {
    const { subscriptionPlanId } = req.params;
    const checkSubscriptionplan = await SubscriptionPlan.findById(
      subscriptionPlanId,
    );
    if (!checkSubscriptionplan) {
      return res.status(404).json({
        message: 'Subscription plan not found',
      });
    }
    const { _id: userId } = req.userData;
    const subscription = await Subscriber.find({
      userId,
      status: 'Active',
    });
    if (subscription.length)
      return serverResponse(
        res,
        404,
        'already have a subscription plan',
      );
    const subscribe = {
      status: 'Active',
      startDate: Date.now(),
      userId,
      subscriptionPlanId,
      ...req.body,
    };
    const subscriber = await Subscriber.create(subscribe);
    return res.status(OK).json({
      status: OK,
      message: 'Subscribed successfully',
      data: subscriber,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const subscribeOrChangeSubcriptionPlan = async (req, res) => {
  try {
    const { _id: userId } = req.userData;
    const { subscriptionPlanId } = req.params;
    const { billingCycle } = req.body;
    let endDate;
    const subscription = await Subscriber.find({
      userId,
      status: 'Active',
    });
    if (billingCycle === 'Monthly') {
      endDate = 30 * 24 * 60 * 60 * 1000;
    } else if (billingCycle === 'Yearly') {
      endDate = 360 * 24 * 60 * 60 * 1000;
    }
    const subscribe = {
      status: 'Active',
      startDate: Date.now(),
      endDate: Date.now() + endDate,
      userId,
      subscriptionPlanId,
      ...req.body,
    };
    if (!subscription.length) {
      const subscriber = await Subscriber.create(subscribe);
      return serverResponse(res, 200, 'successfully subscribed ', {
        message: subscriber,
      });
    }
    if (subscription[0].subscriptionPlanId === subscriptionPlanId)
      return serverResponse(
        res,
        404,
        "you can't subscribe to the same subscription plan",
      );
    await Subscriber.updateMany(
      { userId, status: 'Active' },
      { status: 'Ended', endDate: Date.now() },
    );

    const subscriber = await Subscriber.create(subscribe);
    const sub = await SubscriptionPlan.findById(
      subscriber.subscriptionPlanId,
    );
    await Product.updateMany(
      { customer: subscriber.userId },
      { status: 'Private' },
    );
    return serverResponse(
      res,
      200,
      'successfully changed subscribtion plan',
      {
        data: subscriber,
      },
    );
  } catch (error) {
    return serverResponse(res, 500, error.toString());
  }
};

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});

    return res.status(OK).json({
      status: OK,
      message: 'Subscribers retrieved successfully',
      subscribers,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const getCurrentSubscription = async (req, res) => {
  try {
    const { _id: userId } = req.userData;
    const current = await Subscriber.find({
      userId,
      status: 'Active',
    }).populate({
      path: 'subscriptionPlanId',
      select:
        '_id billingCycle subheader Visibility TypeSubscriptionPlan SubscriptionPlanName Validity plandetailchecklist',
    });
    return res.status(OK).json({
      status: OK,
      message: 'this is id',
      current,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

export default {
  subscribing,
  getSubscribers,
  getCurrentSubscription,
  subscribeOrChangeSubcriptionPlan,
};

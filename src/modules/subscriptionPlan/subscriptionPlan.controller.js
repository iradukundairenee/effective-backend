import Subscription from '../../database/model/subscriptionPlan.model';
import { serverResponse } from '../../utils/response';
import User from '../../database/model/user.model';
import SubscriptionCustomer from '../../database/model/subscriptionCustomer.model';
import SubscriptionPlan from '../../database/model/subscriptionPlan.model';

class SubscriptionController {
  static async UserSubscription(req, res) {
    try {
      const { _id: userId } = req.userData;
      const result = new Subscription({
        user: userId,
        ...req.body,
      });
      await result.save();
      res.status(201).json({
        response: `Subscription has been created successfully`,
        result,
      });
    } catch (error) {
      res.status(400).json({
        response: `Error occured while trying to create a subscription! ${error}`,
      });
    }
  }

  static async getAllSubscription(req, res) {
    try {
      const allActiveSubscription = await Subscription.find({
        Status: 'active',
      });
      res.status(200).json({ data: allActiveSubscription });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getSubscriptionDetails(req, res) {
    try {
      const { subscribeId } = req.params;

      const subscribe = await Subscription.findById(subscribeId);
      return serverResponse(res, 200, 'Success', subscribe);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async updateSubscription(req, res) {
    const id = await req.params.id;
    if (id.length !== 24)
      return res
        .status(400)
        .json({ status: 400, message: 'Invalid id detected' });
    try {
      const result = await Subscription.findById(id);
      if (!result)
        return res
          .status(404)
          .json({ status: 404, message: 'Subscription not found' });
      const updatedSubscription =
        await Subscription.findByIdAndUpdate(id, req.body, {
          new: true,
        });

      return res.json(updatedSubscription);
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'Internal server error' });
    }
  }

  static async deleteSubscription(req, res) {
    try {
      const sub = await req.params.id;
      const subscription = await Subscription.findById(sub);
      if (!subscription) {
        return serverResponse(res, 404, 'subscription not found');
      }
      const id = { _id: sub };
      const Status = { Status: 'archived' };
      await Subscription.updateOne(id, Status);
      return serverResponse(res, 200, 'delete success ');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async addUserToPrivateSubscription(req, res) {
    try {
      const { subscriptionPlanId, userId } = await req.params;

      const user = await User.findById(userId);

      const subscription = await SubscriptionCustomer.create({
        subscriptionPlanId,
        user: user._id,
      });
      return serverResponse(res, 200, 'Success', subscription);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async getPrivateSubscriptionCustomers(req, res) {
    try {
      const { subscriptionPlanId } = await req.params;

      const customers = await SubscriptionCustomer.find({
        subscriptionPlanId,
      }).populate({
        path: 'user',
        select: 'profileImage fullName email phoneNumber companyName',
        model: User,
      });
      return serverResponse(res, 200, 'Success', customers);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async getAllUserSubscriptionPlans(req, res) {
    try {
      const { _id: userId } = await req.userData;
      const allUserAssignedPlans = await SubscriptionCustomer.find({
        user: userId,
      }).populate({
        path: 'subscriptionPlanId',
        model: SubscriptionPlan,
        match: { Status: 'active', Visibility: 'Private' },
      });
      const allPrivatePlansUnfiltered = [];
      allUserAssignedPlans.forEach((plan) =>
        allPrivatePlansUnfiltered.push(plan.subscriptionPlanId),
      );
      const finalPrivatePlans = allPrivatePlansUnfiltered.filter(
        (item) => item !== null,
      );
      const allPublicSubscription = await Subscription.find({
        Status: 'active',
        Visibility: 'Public',
      });
      return serverResponse(res, 200, 'Success', [
        ...finalPrivatePlans,
        ...allPublicSubscription,
      ]);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}
export default SubscriptionController;

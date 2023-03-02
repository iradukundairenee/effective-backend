import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import Subscriber from '../../../database/model/subscription.model';

class SubscriptionController {
  /**
   * This function to handle all getting users with their projects.
   * @param {object} req The http request.
   * @param {object} res The response.
   */
  static async getCurrentSubscription(req, res) {
    const { id } = req.params;
    try {
      const current = await Subscriber.find({
        userId: id,
        status: 'Active',
      }).populate({
        path: 'subscriptionPlanId',
        select:
          '_id billingCycle Visibility TypeSubscriptionPlan SubscriptionPlanName Validity plandetailchecklist PayPerClickCharge',
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
  }
}
export default SubscriptionController;

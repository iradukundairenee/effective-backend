import Subscriber from '../../database/model/subscription.model';

class SubscriptionHelper {
  static async updateRemainingDays(body) {
    const { userId, remainingDays } = body;
    const update = await Subscriber.findOneAndUpdate(
      { userId },
      { remainingDays },
      { new: true },
    );
    return update;
  }
}

export default SubscriptionHelper;

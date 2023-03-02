import { Schema, model } from 'mongoose';

const subscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  subscriptionPlanId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'SubscriptionPlan',
  },
  billingCycle: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  remainingDays: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Ended'],
    default: 'Pending',
  },
});

const Subscriber = model('Subscriber', subscriptionSchema);
export default Subscriber;

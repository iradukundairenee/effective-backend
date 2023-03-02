import { Schema, model } from 'mongoose';

const subscriptionCustomerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subscriptionPlanId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SubscriptionPlan',
    },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const SubscriptionCustomer = model(
  'SubscriptionCustomer',
  subscriptionCustomerSchema,
);
export default SubscriptionCustomer;

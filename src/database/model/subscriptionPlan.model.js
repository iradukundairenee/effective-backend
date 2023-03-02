import { Schema, model } from 'mongoose';
/**
 * SubscriptionPlan schema
 */
function arrayLimit(val) {
  return val.length <= 8;
}
const subscriptionPlanSchema = new Schema({
  TypeSubscriptionPlan: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  SubscriptionPlanName: { type: String, required: true },
  subheader: { type: String, required: true },
  Visibility: { type: String, required: true },
  billingCycle: [
    {
      yearly: { type: Number, required: false },
      monthly: { type: Number, required: true },
    },
  ],
  plandetailchecklist: {
    type: Array,
    validate: [arrayLimit, '{PATH} exceeds the limit of 8'],
  },
  NumberofAssets: { type: Number, required: false },
  Status: {
    type: String,
    enum: ['active', 'archived', 'expired'],
    default: 'active',
  },
  discountValue: { type: Number },
  NumberofClicks: { type: Number, required: false },
  Validity: { type: String, required: true },
  PayPerclick: { type: String, required: true },
  PayPerClickCharge: { type: Number },
  DiscountApplicable: { type: String, required: true },
  DiscountType: { type: String, default: null },
  CouponApplicable: { type: String, required: true },
  RedemptionofPoints: { type: String, required: true },
});
const SubscriptionPlan = model(
  'SubscriptionPlan',
  subscriptionPlanSchema,
);
export default SubscriptionPlan;

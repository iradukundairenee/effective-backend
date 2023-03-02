import { Schema, model } from 'mongoose';
/**
 * Coupon schema
 */
const couponSchema = new Schema({
  couponName: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  couponType: {
    type: String,
    required: true,
    enum: ['Percentage', 'Flat'],
  },
  discountAmount: { type: String, default: null },
  currencyType: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Currency',
  },
  percentageValue: { type: String, default: null },
  maxCap: { type: String, default: null },
  startDate: { type: Date, required: true },
  validity: { type: Date, required: true },
  applicability: { type: String, required: true },
  enable: { type: Boolean, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Redeemed', 'Active', 'Expired', 'Inactive'],
    default: 'Active',
  },
});
const Coupon = model('Coupon', couponSchema);
export default Coupon;

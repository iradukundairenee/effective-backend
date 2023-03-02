import { Schema, model } from 'mongoose';

const customerCouponSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    coupon: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Coupon',
    },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const CustomerCoupon = model('CustomerCoupon', customerCouponSchema);
export default CustomerCoupon;

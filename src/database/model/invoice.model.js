import { Schema, model } from 'mongoose';

/**
 * Invoice Schema
 */
const invoiceSchema = new Schema(
  {
    amount: { type: String, required: true },
    due_date: { type: Date, required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    quote: { type: Schema.Types.ObjectId, ref: 'Quote' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    type: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    manager: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    coupon: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Coupon',
    },
    loyaltyPoints: { type: Number, default: 0 },
    status: { type: String, default: 'Unpaid' },
    idNumber: { type: Number, default: 4 },
  },
  {
    timestamps: true,
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000,
    },
  },
);
invoiceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.constructor.find({}).then((records) => {
      this.idNumber = records.length + 1;
      next();
    });
  }
});
const Invoice = model('Invoice', invoiceSchema);
export default Invoice;

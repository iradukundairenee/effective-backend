import { Schema, model } from 'mongoose';

const customerCurrencySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    currency: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Currency',
    },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const CurrencyCustomer = model(
  'CurrencyCustomer',
  customerCurrencySchema,
);
export default CurrencyCustomer;

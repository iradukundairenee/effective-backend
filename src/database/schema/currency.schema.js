import { Schema } from 'mongoose';

const CurrencySchema = new Schema({
  currencyName: {
    type: String,
    required: true,
  },
  currencyCode: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  taxName: {
    type: String,
    required: true,
  },
  taxPercentage: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default CurrencySchema;

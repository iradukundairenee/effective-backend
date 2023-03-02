import { model, Schema } from 'mongoose';

const currencySchema = new Schema({
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
  companyName: {
    type: String,
    required: true,
  },
  companyUrl: {
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
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: null,
  },
  postalCode: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    required: true,
  },
});

const Currency = model('Currency', currencySchema);
export default Currency;

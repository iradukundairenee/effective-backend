import { Schema, model } from 'mongoose';
import CurrencySchema from '../schema/currency.schema';

export const ItemSchema = new Schema({
  item: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: CurrencySchema },
  createdAt: { type: Date, default: Date.now },
});

export default model('Item', ItemSchema);

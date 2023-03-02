import { Schema } from 'mongoose';
import { ItemSchema } from '../model/Items';

const ProposalItemSchema = new Schema({
  item: { type: ItemSchema },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default ProposalItemSchema;

import { Schema, model } from 'mongoose';

const proposalItemSchema = new Schema({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  proposalId: {
    type: Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true,
  },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
export default model('ProposalItem', proposalItemSchema);

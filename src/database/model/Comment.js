import mongoose, { Schema } from 'mongoose';

const commentschema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: String, required: true },
  proposalId: { type: String, required: true },
  comment: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Comment', commentschema);

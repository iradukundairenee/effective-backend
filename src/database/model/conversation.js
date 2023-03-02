import mongoose, { Schema } from 'mongoose';

const ConversationSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: String, required: true },
  projectId: { type: String, required: true },
  title: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model('Conversation', ConversationSchema);

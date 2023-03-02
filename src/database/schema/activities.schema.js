import { Schema } from 'mongoose';

const ActivitiesSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  quoteId: {
    type: Schema.Types.ObjectId,
    ref: 'Quote',
    required: false,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: false,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: false,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: false,
  },
  duplicateId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
});

export default ActivitiesSchema;

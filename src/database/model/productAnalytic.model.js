import { Schema, model } from 'mongoose';
import { productSchema } from './product.model';

const analyticsSchema = new Schema({
  product: { type: productSchema },
  analytics: [
    {
      city: { type: String },
      device: { type: String },
      country: { type: String },
      actionType: {
        type: String,
        enum: ['visit', 'click'],
        default: 'visit',
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default model('Analytics', analyticsSchema);

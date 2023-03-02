import { Schema, model } from 'mongoose';
import ActivitiesSchema from '../schema/activities.schema';

/**
 * logs schema
 */
const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'ended'],
  },
  activities: {
    type: [ActivitiesSchema],
    default: [],
  },
  startedAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
});

const Session = model('Session', sessionSchema);
export default Session;

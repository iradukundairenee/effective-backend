import { Schema, model } from 'mongoose';

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    nOfItems: { type: Number, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    budget: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    description: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    manager: { type: Schema.Types.ObjectId, ref: 'User' },
    image: { type: String },
    imageId: { type: String },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const Project = model('Project', projectSchema);

export default Project;

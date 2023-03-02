import { Schema } from 'mongoose';

// manage image schema
const ImageSchema = new Schema({
  imageName: { type: String },
  imageType: { type: String },
  imageUrl: { type: String },
  canBeDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default ImageSchema;

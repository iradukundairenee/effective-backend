import { Schema, model } from 'mongoose';
import ImageSchema from '../schema/image.schema';
import CurrencySchema from '../schema/currency.schema';
import defaultImages from '../../utils/constants/manageImages';

/**
 * User Schema
 */
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    companyName: { type: String, required: true },
    companyUrl: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    password: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    resetKey: { type: String },
    role: { type: String, required: true, default: 'Client' },
    website: { type: String },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    loyaltyPoints: {
      accruedPoints: { type: Number },
      redeemedPoints: { type: Number },
    },
    domainNames: [],
    imageFiles: { type: [ImageSchema], default: defaultImages },
    currency: { type: CurrencySchema },
  },
  {
    timestamps: true,
  },
);
// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  // Save fullName if it has been modified (or is new)
  if (!user.isModified('firstName') || !user.isModified('lastName')) {
    return next();
  }

  user.fullName = `${user.firstName} ${user.lastName}`;
  next();
});
// eslint-disable-next-line func-names
userSchema.methods.generateFullName = function (fName, lName, cb) {
  const fullName = `${fName} ${lName}`;
  cb(null, fullName);
};
const User = model('User', userSchema);

export default User;

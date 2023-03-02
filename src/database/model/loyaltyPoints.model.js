import { Schema, model } from 'mongoose';

const loyaltyPointSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    currencyType: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Currency',
    },
    purchasedAmount: { type: Number, required: true },
    generatedPoints: { type: Number, required: true },
    rule: {
      points: { type: String, required: true },
      value: { type: Number, required: true },
    },
    slabPoints: { type: Number },
    slab: { type: String, default: 'Disabled' },
    slabAmount: { type: Number },
    startDate: { type: Date },
    validity: { type: Date },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);

const LoyaltyPoints = model('LoyaltyPoints', loyaltyPointSchema);

export default LoyaltyPoints;

import mongoose, { Schema, model } from 'mongoose';
import MongoSequence from 'mongoose-sequence';

const AutoIncreament = MongoSequence(mongoose);
const orbits = {
  side: { type: Number, default: 0 },
  ud: { type: Number, default: 75 },
  io: { type: Number, default: 105 },
};
const minOrbits = {
  side: { type: Number, default: 0 },
  ud: { type: Number, default: 75 },
  io: { type: Number, default: 105 },
};

const maxOrbits = {
  side: { type: Number, default: 0 },
  ud: { type: Number, default: 75 },
  io: { type: Number, default: 105 },
};

export const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number },
    sku: { type: String },
    imageIcon: {
      type: String,
      default: '',
    },
    image: {
      imageUrls: {
        glb: { type: String },
        usdz: { type: String },
      },
      disableZoom: { type: Boolean, default: false },
      autoRotate: { type: Boolean, default: true },
      autoRotateDelay: { type: Number, default: 3000 },
      backgroundColor: { type: String, default: '#ffffff' },
      cameraOrbit: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: '0deg 75deg 105%' },
      },
      minCameraOrbit: {
        custom: minOrbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: 'Infinity 22.5deg auto' },
      },
      maxCameraOrbit: {
        custom: maxOrbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: 'Infinity 157.5deg auto' },
      },
      cameraTarget: {
        custom: orbits,
        useDefault: { type: Boolean, default: true },
        default: { type: String, default: 'auto auto auto' },
      },
      fieldOfView: { type: Number, default: 10 },
      exposure: { type: Number, default: 1 },
      shadowIntensity: { type: Number, default: 0 },
      shadowSoftness: { type: Number, default: 0 },
      alt: { type: String, default: 'Product name' },
      scale: {
        type: String,
        enum: ['auto', 'fixed'],
        default: 'auto',
      },
      placement: {
        type: String,
        enum: ['floor', 'wall'],
        default: 'floor',
      },
      arButtonPosition: {
        type: String,
        enum: [
          'top-left',
          'top-center',
          'top-right',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ],
        default: 'bottom-center',
      },
      metalness: { type: Number, default: 0 },
      roughness: { type: Number, default: 0 },
      arButtonImage: { type: String },
      skyboxImage: {
        active: { type: Boolean, default: false },
        image: { type: String },
      },
      environmentImage: {
        active: { type: Boolean, default: false },
        image: { type: String },
      },
      hotspots: [
        {
          dataPosition: { type: String },
          dataNormal: { type: String },
          dataText: { type: String },
          hotspotNum: { type: Number },
          bgColor: { type: String },
        },
      ],
    },
    status: {
      type: String,
      enum: ['', 'Public', 'Private'],
    },
    bgColor: { type: String, required: true },
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
    },
    description: { type: String },
    duplicate: {
      type: Number,
      default: 1,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Product',
      default: null,
    },
    qrCodeRef: {
      code: {
        type: String,
        default: '',
      },
      usageNo: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    writeConcern: { w: 'majority', j: true, wtimeout: 1000 },
  },
);
productSchema.plugin(AutoIncreament, { inc_field: 'itemNumber' });
// eslint-disable-next-line func-names
productSchema.pre('save', function (next) {
  const product = this;
  product.image.alt = product.image.alt || product.name;
  return next();
});
const Product = model('Product', productSchema);

export default Product;

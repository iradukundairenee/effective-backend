import { Schema, model } from 'mongoose';
import { license } from '../../utils/constants/licenseAgreement';

export const LicenseAgreementSchema = new Schema({
  agreement: { type: String, required: true, default: license },
});

export const LicenseAgreement = model(
  'LicenseAgreement',
  LicenseAgreementSchema,
);

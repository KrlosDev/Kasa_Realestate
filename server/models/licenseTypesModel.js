import mongoose from "mongoose";

const licenseTypesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    maxUsers: { type: Number, required: true },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true },
    isForBrokers: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const LicenseType = mongoose.model("licenseTypes", licenseTypesSchema);

import mongoose from "mongoose";

const licensesSchema = new mongoose.Schema(
  {
    emissionDate: { type: Date, required: true},
    expirationDate: { type: Date, required: true },
    idLicenseType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "licenseTypes"}
    }
  , { timestamps: true }
);

export const License = mongoose.model("licenses", licensesSchema);
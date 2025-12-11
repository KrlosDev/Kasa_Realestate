import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: false },
    name: { type: String, required: true },
    lastName: { type: String, required: false },
    idRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
      index: true,
    },
    idLicense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "licenses",
      index: true,
    },
    idsConstructoras: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", index: true },
    ],
    lastLogin: { type: Date, required: false, default: Date.now },
    active: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpire: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("users", userSchema);

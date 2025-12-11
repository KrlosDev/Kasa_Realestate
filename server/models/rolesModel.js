import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      enum: [
        "administrador",
        "constructora",
        "broker",
        "ejecutivo_ventas",
        "ejecutivo_banco"
      ]
    }
  },
  { timestamps: true }
);

export const Role = mongoose.model("roles", roleSchema);

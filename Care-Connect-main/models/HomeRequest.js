import mongoose from "mongoose";

const HomeRequestSchema = new mongoose.Schema({
  homeName: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  homePhoto: {
    type: String,
  },
  documentUrl: {
    type: String,
  },
  upi: {
    vpa: { type: String },
    qrImageUrl: { type: String }
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.models.HomeRequest || mongoose.model("HomeRequest", HomeRequestSchema);


import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["orphanage", "oldage"], required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  upi: {
    vpa: { type: String },
    qrImageUrl: { type: String }
  },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
}, { timestamps: true });

export default mongoose.models.Home || mongoose.model("Home", HomeSchema);

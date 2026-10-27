import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    category: {
      type: String,
      enum: ["Food", "Clothes", "Books", "Furniture", "Stationery", "Others"],
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed"],
      default: "Pending",
    },
    donorName: {
      type: String,
    },
    donorEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);


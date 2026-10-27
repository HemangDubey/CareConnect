import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    // Linked authenticated user. Kept non-required for backward compatibility
    // with older records that were created without a user context.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Optional link to a specific donation record (if applicable)
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: false,
    },

    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },

    // Keep legacy statuses for backward compatibility (e.g. "captured")
    status: {
      type: String,
      enum: ["created", "paid", "failed", "authorized", "captured", "refunded"],
      default: "created",
    },

    razorpay_order_id: {
      type: String,
      required: true,
      index: true,
    },
    razorpay_payment_id: {
      type: String,
      index: true,
    },

    // Store signature in both a Razorpay-specific field and the legacy
    // "signature" field so existing code keeps working.
    razorpay_signature: {
      type: String,
    },
    signature: {
      type: String,
    },

    // Optional metadata to store donation-related information (home, donor, etc.)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Do not add updatedAt automatically; createdAt is enough for payments
    timestamps: false,
  }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);


import mongoose from "mongoose";

const NoticeDismissalSchema = new mongoose.Schema({
  noticeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HomeNotice",
    required: true,
    index: true,
  },
  userId: {
    type: String, // Can be ObjectId if user is logged in, or sessionId/cookie token for anonymous
    default: null, // nullable for anonymous users
    index: true,
  },
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
    index: true,
  },
  dismissedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Compound index for efficient dismissal lookups
NoticeDismissalSchema.index({ noticeId: 1, userId: 1 }, { unique: true });

export default mongoose.models.NoticeDismissal || mongoose.model("NoticeDismissal", NoticeDismissalSchema);


import mongoose from "mongoose";

const HomeNoticeSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Home",
    required: true,
    index: true, // Index for faster queries
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    // HTML/markdown allowed - validate inputs on API side
  },
  startAt: {
    type: Date,
    default: null, // null => show immediately
  },
  endAt: {
    type: Date,
    default: null, // null => no expiry
  },
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
  showOnce: {
    type: Boolean,
    default: false, // true => show once per user
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Admin" depending on your auth system
    required: true,
  },
}, { timestamps: true });

// Compound index for efficient active notice queries
HomeNoticeSchema.index({ homeId: 1, enabled: 1, startAt: 1, endAt: 1 });

export default mongoose.models.HomeNotice || mongoose.model("HomeNotice", HomeNoticeSchema);


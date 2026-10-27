import mongoose from "mongoose";

const { Schema } = mongoose;

const NoticeSeenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    noticeId: { type: Schema.Types.ObjectId, ref: "Notice", required: true },
    seenAt: { type: Date, default: Date.now },
  },
  {
    indexes: [{ fields: { userId: 1, noticeId: 1 }, options: { unique: true } }],
  }
);

// Ensure compound uniqueness for (userId, noticeId)
NoticeSeenSchema.index({ userId: 1, noticeId: 1 }, { unique: true });

export default mongoose.models.NoticeSeen ||
  mongoose.model("NoticeSeen", NoticeSeenSchema);



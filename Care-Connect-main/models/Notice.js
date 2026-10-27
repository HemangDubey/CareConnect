import mongoose from "mongoose";

const { Schema } = mongoose;

const NoticeSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true }, // HTML or plain text
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    enabled: { type: Boolean, default: true },

    // "every_visit" = show each time; "one_time" = once per user
    displayType: {
      type: String,
      enum: ["every_visit", "one_time"],
      default: "every_visit",
    },

    dismissible: { type: Boolean, default: true },

    // Ordering/priority: lower numbers can be treated as higher priority
    priority: { type: Number, default: 0 },

    // Audit fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // Optional future targeting (roles, specific users, etc.)
    target: {
      roles: [{ type: String }],
      userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  {
    // Do not use timestamps option since we keep explicit createdAt/updatedAt
  }
);

// Keep updatedAt in sync
NoticeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);



import mongoose from "mongoose";

const VolunteerParticipationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteerRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VolunteerRequest",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate volunteer signups for the same request
VolunteerParticipationSchema.index({ userId: 1, volunteerRequestId: 1 }, { unique: true });

export default mongoose.models.VolunteerParticipation || mongoose.model("VolunteerParticipation", VolunteerParticipationSchema);


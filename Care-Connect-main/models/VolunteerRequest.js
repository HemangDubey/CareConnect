import mongoose from "mongoose";

const VolunteerRequestSchema = new mongoose.Schema(
  {
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numberOfVolunteersRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed", "disabled"],
      default: "open",
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.VolunteerRequest || mongoose.model("VolunteerRequest", VolunteerRequestSchema);


import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },

    imageUrl: { type: String },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Rejected"],
      default: "Pending",
    },
    anonymous: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !this.anonymous;
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);

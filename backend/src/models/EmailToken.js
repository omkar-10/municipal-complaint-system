import mongoose from "mongoose";

const emailTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // 1 hour expiration
  },
});

const EmailToken = mongoose.model("EmailToken", emailTokenSchema);
export default EmailToken;

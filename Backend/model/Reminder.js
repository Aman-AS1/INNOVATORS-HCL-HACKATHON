import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    reminderDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);

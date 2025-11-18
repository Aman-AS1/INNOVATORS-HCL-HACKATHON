import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    steps: {
      current: { type: Number, default: 0 },
      goal: { type: Number, default: 6000 },
    },
    sleep: {
      hours: { type: Number, default: 0 },
    },
    activeTime: {
      minutes: { type: Number, default: 0 },
    },
    waterIntake: {
      ml: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("PatientGoal", goalSchema);

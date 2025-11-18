import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    age: Number,
    gender: String,
    phone: String,

    allergies: [String],
    medications: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

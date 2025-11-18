import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minLength: [3, "Password should be minimum 3 characters long"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);

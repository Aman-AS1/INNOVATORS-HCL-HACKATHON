import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
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
    refreshToken: {
      type: String,
    },

    age:Number,
    allergies:[String],
    medications:[String],
    gender:["Male","Female","Other"],
    height:Number,
    weight:Number,
    age:Number

  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;

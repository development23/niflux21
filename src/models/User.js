import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this user."],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number for this user."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a name for this user."],
      unique: true,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Please provide a name for this user."],
      maxlength: [200, "Name cannot be more than 60 characters"],
    },
    dob: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    profile_image: {
      type: String,
      default: null,
    },
    userId: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

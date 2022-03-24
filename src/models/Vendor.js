import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this vendor."],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number for this vendor."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a name for this vendor."],
      unique: true,
    },
    state: {
      type: String,
      required: [true, "Please provide a state of this vendor."],
    },
    city: {
      type: String,
      required: [true, "Please provide a city of this vendor."],
    },
    address: {
      type: String,
      required: [true, "Please provide a address of this vendor."],
    },
    password: {
      type: String,
      required: [true, "Please provide a name for this vendor."],
      maxlength: [200, "Name cannot be more than 60 characters"],
    },
    profile_image: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: [true, "Please provide a name for this vendor."],
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

import mongoose, { Schema } from "mongoose";

const distributerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this Distributer."],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number for this Distributer."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a name for this Distributer."],
      unique: true,
    },
    state: {
      type: String,
      required: [true, "Please provide a state of this Distributer."],
    },
    city: {
      type: String,
      required: [true, "Please provide a city of this Distributer."],
    },
    pincode: {
      type: String,
      required: [true, "Please provide a pincode of this Distributer."],
    },
    gst: {
      type: String,
      required: [true, "Please provide a gst of this Distributer."],
    },
    pan: {
      type: String,
      required: [true, "Please provide a pan of this Distributer."],
    },
    category: {
      type: String,
      required: [true, "Please provide a city of this Distributer."],
    },
    address: {
      type: String,
      required: [true, "Please provide a address of this Distributer."],
    },
    password: {
      type: String,
      required: [true, "Please provide a name for this Distributer."],
      maxlength: [200, "Name cannot be more than 60 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a name for this Distributer."],
      unique: true,
    },
    profile_image: {
      type: String,
      default: null,
    },
    coordinates: {
      longitude: {
        type: String,
        required: [true, "Please provide a longitude for this Distributer."],
      },
      latitude: {
        type: String,
        required: [true, "Please provide a latitude for this Distributer."],
      },
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Distributer ||
  mongoose.model("Distributer", distributerSchema);

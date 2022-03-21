import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this supervisor."],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number for this supervisor."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a name for this supervisor."],
      unique: true,
    },
    state: {
      type: String,
      required: [true, "Please provide a state of this supervisor."],
    },
    city: {
      type: String,
      required: [true, "Please provide a city of this supervisor."],
    },
    address: {
      type: String,
      required: [true, "Please provide a address of this supervisor."],
    },
    password: {
      type: String,
      required: [true, "Please provide a name for this supervisor."],
      maxlength: [200, "Name cannot be more than 60 characters"],
    },
    department: {
      type: String,
      required: [true, "Please provide a address of this supervisor."],
    },
    dob: {
      type: String,
      required: [true, "Please provide a address of this dob."],
    },
    employees: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: [true, "Please provide a name for this supervisor."],
      unique: true,
    },
    workingCity: {
      type: String,
      required: [true, "Please provide a working city of this supervisor."],
    },
    workingState: {
      type: String,
      required: [true, "Please provide a working state of this supervisor."],
    },
    workingPincode: {
      type: String,
      required: [true, "Please provide a working pincode of this supervisor."],
    },
    pincode: {
      type: String,
      required: [true, "Please provide a working pincode of this supervisor."],
    },
    profile_image: {
      type: String,
      default: null,
    },
    designation: {
      type: String,
      default: null,
    },
    supervisorCode: {
      type: String,
      required: [true, "Please provide a name for this Supervisor."],
      unique: true,
    },
    aadharNo: {
      type: String,
      required: [true, "Please provide supervisor's Aadhar Number."],
    },
    leaves: [
      {
        leave: {
          from: {
            type: String,
            default: null,
          },
          to: {
            type: String,
            default: null,
          },
        },
      },
    ],
    attendance: [
      {
        date: {
          signIn: { type: String, default: null },
          signOut: { type: String, default: null },
          date: { type: String, default: null },
        },
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Supervisor ||
  mongoose.model("Supervisor", supervisorSchema);

import mongoose, { Schema } from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      default: null,
      maxlength: [50, "Email cannot be more than 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone"],
      maxlength: [13, "Phone cannot be more than 13 characters"],
    },
    message: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    vid: {
      type: Schema.Types.ObjectId,
      required: [true, "Please provide a Vendor ID"],
    },
    pid: {
      type: Schema.Types.ObjectId,
      required: [true, "Please provide a Property ID"],
    },
    vName: {
      type: String,
      required: [true, "Please provide a vendor name"],
    },
    pName: {
      type: String,
      required: [true, "Please provide a property name"],
    },
    status: {
      type: String,
      default: "Pending",
    },
    isTouched: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "Portal",
    },
    followUp: [
      {
        text: {
          type: String,
          default: null,
        },
        conclusion: {
          type: String,
          default: null,
        },
        type: {
          type: String,
          default: null,
        },
        timestamps: [
          {
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
          {
            updatedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models?.Lead || mongoose.model("Lead", LeadSchema);

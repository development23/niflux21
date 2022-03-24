import mongoose, { Schema } from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name ."],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    address: {
      type: String,
      required: [true, "Please provide a address "],
    },
    colony: {
      type: String,
      required: [true, "Please provide a colony "],
    },
    furnishing: {
      type: String,
      required: [true, "Please provide a colony "],
    },
    state: {
      type: String,
      required: [true, "Please provide a state for this"],
    },
    city: {
      type: String,
      required: [true, "Please provide a city "],
    },
    vid: {
      type: Schema.Types.ObjectId,
      required: [true, "Please provide a Vendor ID "],
    },
    rera: {
      type: String,
      required: [true, "Please provide a rara "],
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Please provide a slug "],
    },
    banner: {
      type: String,
      required: [true, "Please provide a banner "],
    },
    thumbnail: {
      type: String,
      required: [true, "Please provide a thumbnail "],
    },
    overview: {
      type: String,
      required: [true, "Please provide a overview for this"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description "],
    },
    amenities: {
      type: String,
      required: [true, "Please provide a amenities "],
    },
    location: {
      type: String,
      required: [true, "Please provide a location "],
    },

    floorPlan: [
      {
        planName: {
          type: String,
          default: null,
        },
        description: {
          type: String,
          default: null,
        },
        price: {
          type: String,
          default: null,
        },
        area: {
          type: String,
          default: null,
        },
        image: {
          type: String,
          default: null,
        },
      },
      { timestamps: true },
    ],
    images: { type: [String], default: [] },
    locationAdvantages: [
      {
        distance: { type: String, default: null },
        location: { type: String, default: null },
      },
    ],
    price: {
      type: String,
      default: null,
    },
    constructionStatus: { type: String, default: null },
    type: {
      type: String,
      required: [true, "Please provide a type for this property"],
    },
    area: {
      type: String,
      required: [true, "Please provide a area for this property"],
    },
    bhk: {
      type: String,
      required: [true, "Please provide a bhk for this property"],
    },
    ratings: [
      {
        rating: {
          type: String,
          default: null,
        },
        uid: {
          type: String,
          trim: true,
          index: true,
          unique: true,
          sparse: true,
        },
        comment: {
          type: String,
          default: null,
        },
      },
    ],
    constructionQuality: {
      type: String,
      required: [
        true,
        "Please provide a construction quality for this property",
      ],
    },
    status: {
      type: String,
      required: [true, "Please provide a status for this property"],
    },
    tags: { type: [String], default: [] },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models?.Property ||
  mongoose.model("Property", PropertySchema);

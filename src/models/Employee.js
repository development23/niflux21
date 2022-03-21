import mongoose, { Schema } from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for this employee."],
    },
    expToken: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number for this employee."],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a name for this employee."],
      unique: true,
    },
    state: {
      type: String,
      required: [true, "Please provide a state of this employee."],
    },
    city: {
      type: String,
      required: [true, "Please provide a city of this employee."],
    },
    address: {
      type: String,
      required: [true, "Please provide a address of this employee."],
    },
    password: {
      type: String,
      required: [true, "Please provide a name for this employee."],
      maxlength: [200, "Name cannot be more than 60 characters"],
    },
    department: {
      type: String,
      required: [true, "Please provide a address of this employee."],
    },
    dob: {
      type: String,
      required: [true, "Please provide a address of this dob."],
    },

    slug: {
      type: String,
      required: [true, "Please provide a name for this employee."],
      unique: true,
    },
    profile_image: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    locations: [
      {
        type: new mongoose.Schema(
          {
            longitude: {
              type: String,
              default: null,
            },
            latitude: {
              type: String,
              default: null,
            },
          },
          { timestamps: true }
        ),
      },
    ],
    currentLocation: {
      type: new mongoose.Schema(
        {
          longitude: {
            type: String,
            default: null,
          },
          latitude: {
            type: String,
            default: null,
          },
        },
        { timestamps: true }
      ),
    },
    beats: [
      {
        type: new mongoose.Schema(
          {
            beat: {
              type: String,
              default: null,
            },
            beatType: {
              type: String,
              default: "Local",
            },
            activity: {
              type: String,
              default: null,
            },
            distance: {
              type: String,
              default: 0,
            },
            distributer: {
              type: String,
              required: [true, "Please provide a distributer of this beat."],
            },
            sitePhoto: {
              type: String,
              default: null,
            },
            siteStatus: {
              type: String,
              default: null,
            },
            others: {
              type: String,
              default: null,
            },
            remarks: [
              {
                type: new mongoose.Schema(
                  {
                    remark: {
                      type: String,
                      default: null,
                    },
                  },
                  { timestamps: true }
                ),
              },
            ],
            travelTime: {
              startTime: {
                type: String,
                default: null,
              },
              endTime: {
                type: String,
                default: null,
              },
              startCoordinates: {
                longitude: {
                  type: String,
                  default: null,
                },
                latitude: {
                  type: String,
                  default: null,
                },
              },
              endCoordinates: {
                longitude: {
                  type: String,
                  default: null,
                },
                latitude: {
                  type: String,
                  default: null,
                },
              },
            },
            orderStatus: {
              status: {
                type: String,
                default: "pending",
              },
            },
            status: {
              type: String,
              default: "Pending",
            },
          },
          { timestamps: true }
        ),
        default: [],
      },
    ],
    supervisor: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    designation: {
      type: String,
      default: null,
    },
    employeeCode: {
      type: String,
      required: [true, "Please provide a name for this employee."],
      unique: true,
    },
    aadharNo: {
      type: String,
      required: [true, "Please provide supervisor's Aadhar Number."],
    },
    leaves: [
      {
        type: new mongoose.Schema(
          {
            from: {
              type: String,
              default: null,
            },
            to: {
              type: String,
              default: null,
            },
            status: {
              type: String,
              default: "pending",
            },
            reason: {
              type: String,
              default: null,
            },
            remarks: {
              type: [String],
              default: null,
            },
          },
          { timestamps: true }
        ),
      },
    ],
    attendance: [
      {
        type: new mongoose.Schema(
          {
            signIn: { type: String, default: null },
            signOut: { type: String, default: null },
            lateSignInReason: { type: String, default: null },
            lateSignInStatus: { type: String, default: "pending" },
            signInCoordinates: {
              longitude: {
                type: String,
                default: null,
              },
              latitude: {
                type: String,
                default: null,
              },
            },
            signOutCoordinates: {
              longitude: {
                type: String,
                default: null,
              },
              latitude: {
                type: String,
                default: null,
              },
            },
            date: { type: String, default: null },
          },
          { timestamps: true }
        ),
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },

    emergencyNo1: {
      type: String,
      default: null,
    },
    emergencyNo2: {
      type: String,
      default: null,
    },
    bloodGroup: {
      type: String,
      default: null,
    },
    aadharImages: {
      front: {
        type: String,
        default: null,
      },
      back: {
        type: String,
        default: null,
      },
    },
    modelName: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", employeeSchema);

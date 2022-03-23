import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide a name for this pet."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a name for this pet."],
    maxlength: [20, "Name cannot be more than 60 characters"],
  },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

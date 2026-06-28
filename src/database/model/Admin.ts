import mongoose, { Schema } from "mongoose";
import { REGEX_PATTERNS } from "@/shared/lib/regex";
import { Department } from "@/shared/constant/enum/Department";

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [REGEX_PATTERNS.ADMIN_EMAIL, "Invalid admin email format"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      match: [REGEX_PATTERNS.NAME, "Invalid name format"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: Object.values(Department),
        message: "Invalid department",
      },
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      enum: ["head", "dean"],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.admins || mongoose.model("admins", adminSchema);

export default Admin;

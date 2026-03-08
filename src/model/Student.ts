import mongoose, { Schema } from "mongoose";
import { REGEX_PATTERNS } from "@/lib/regex";
import { Department } from "@/constant/enum/Department";

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      match: [
        REGEX_PATTERNS.STUDENT_ID,
        "Student ID must be exactly 16 digits",
      ],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [REGEX_PATTERNS.STUDENT_EMAIL, "Invalid student email format"],
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
    batch: {
      type: Number,
      required: [true, "Batch is required"],
      min: [1, "Batch number must be at least 1"],
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

const Student =
  mongoose.models.students || mongoose.model("students", studentSchema);

export default Student;

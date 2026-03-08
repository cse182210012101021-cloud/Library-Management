import mongoose, { Schema, Document } from "mongoose";
import { ApplicationStatus } from "@/constant/enum/ApplicationStatus";

export interface IApplication extends Document {
  bookIds: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  appliedDate: Date;
  fromDate: Date;
  toDate: Date;
  quantity: number;
  returnDate?: Date;
  fineAmount?: number;
  updatedBy?: mongoose.Types.ObjectId;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    bookIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "books",
        required: [true, "Book IDs are required"],
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "members",
      required: [true, "User ID is required"],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ApplicationStatus),
        message: "Invalid application status",
      },
      default: ApplicationStatus.PENDING,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    fromDate: {
      type: Date,
      required: [true, "From date is required"],
    },
    toDate: {
      type: Date,
      required: [true, "To date is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    returnDate: {
      type: Date,
      default: null,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "members",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Clear the model in development to pick up schema changes
if (mongoose.models.applications) {
  delete mongoose.models.applications;
}

const Application = mongoose.model<IApplication>(
  "applications",
  ApplicationSchema,
);

export default Application;

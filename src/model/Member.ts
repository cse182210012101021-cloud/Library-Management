import { UserType } from "@/constant/enum/UserType";
import { REGEX_PATTERNS } from "@/lib/regex";
import mongoose, { Schema, Document } from "mongoose";

interface IMember extends Document {
  email: string;
  password: string;
  userType: UserType;
  referenceId?: mongoose.Types.ObjectId | null;
  image?: string | null;
}

const MemberSchema = new Schema<IMember>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [REGEX_PATTERNS.EMAIL, "Invalid email"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: {
        values: Object.values(UserType),
        message: "Invalid user",
      },
      default: UserType.STUDENT,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      ref: "students",
      required(this: IMember): boolean {
        return this.userType === UserType.STUDENT;
      },
      default: null,
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

const Member =
  mongoose.models.members || mongoose.model<IMember>("members", MemberSchema);

export default Member;

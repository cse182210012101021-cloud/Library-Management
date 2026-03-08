import mongoose, { Schema, Document } from "mongoose";

export interface IFineRule extends Document {
  chargesPerDay: number;
  gracePeriod: number;
  replacementFee: number;
  updatedBy?: mongoose.Types.ObjectId;
}

const FineRuleSchema = new Schema<IFineRule>(
  {
    chargesPerDay: {
      type: Number,
      required: [true, "Charges per day is required"],
      min: [0, "Charges cannot be negative"],
      default: 0,
    },
    gracePeriod: {
      type: Number,
      required: [true, "Grace period is required"],
      min: [0, "Grace period cannot be negative"],
      default: 0,
    },
    replacementFee: {
      type: Number,
      required: [true, "Replacement fee is required"],
      min: [0, "Replacement fee cannot be negative"],
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

const FineRule =
  mongoose.models.fineRules ||
  mongoose.model<IFineRule>("fineRules", FineRuleSchema);

export default FineRule;

import mongoose, { Schema, Model } from "mongoose";
import type { ClassName } from "@/lib/types/class-name.types";

// ClassName Schema
const classNameSchema: Schema<ClassName> = new Schema({
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    funnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Funnel",
      required: [true, "Funnel Id is required"],
    },
    customData: {
      type: String,
      default: null,
    }
  }, 
  {
    timestamps: true,
});
  
classNameSchema.index({funnelId: 1});

const ClassName: Model<ClassName> = mongoose.model<ClassName>("ClassName", classNameSchema);
export default ClassName;
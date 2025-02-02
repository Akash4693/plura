import mongoose, { Schema, Model } from "mongoose";
import type { AddOn } from "@/lib/types/add-on.types";

// Add-ons schema
const addOnsSchema: Schema<AddOn> = new Schema({
    name: {
      type: String,
      required: [true, "addOns name is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    priceId: {
      type: String,
      unique: true,
      required: [true, "priceId is required"],
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
  }, 
  {
    timestamps: true,
});
  
addOnsSchema.index({ agencyId: 1 });

const AddOns: Model<AddOn> = mongoose.model<AddOn>("AddOns", addOnsSchema);
export default AddOns;
  
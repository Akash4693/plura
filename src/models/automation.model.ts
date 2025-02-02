import mongoose, { Schema, Model } from "mongoose";
import type { Automation } from "@/lib/types/automation.types";

// Automation Schema
const automationSchema: Schema<Automation> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Automation name is required"],
    },
    published: {
      type: Boolean,
      default: false,
    },
    triggerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trigger",
      default: null,
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"],
    },
    action: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
    automationInstance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AutomationInstance", // Reference to the AutomationInstance model
      },
    ],
  },
  {
    timestamps: true,
});

automationSchema.index({ triggerId: 1 });
automationSchema.index({ subAccountId: 1 });

const Automation: Model<Automation> = mongoose.model<Automation>("Automation", automationSchema);
export default Automation;

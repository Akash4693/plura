import mongoose, { Schema, Model } from "mongoose";
import type { AutomationInstance } from "@/lib/types/automation-instance.types";

// AutomationInstance Schema
const automationInstanceSchema: Schema<AutomationInstance> = new Schema({
    automationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    }
  }, 
  {
    timestamps: true,
});
  
automationInstanceSchema.index({ automationId: 1 });

const AutomationInstance: Model<AutomationInstance> = mongoose.model<AutomationInstance>("AutomationInstance", automationInstanceSchema);
export default AutomationInstance;
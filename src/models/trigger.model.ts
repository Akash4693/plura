import mongoose, { Schema, Model } from "mongoose";
import { TriggerTypes } from "@/constants/enums/trigger-types.enum";
import type { Trigger } from "@/lib/types/trigger.types";


const triggerSchema: Schema<Trigger> = new Schema ({
  name: {
    type: String,
    required: [true, "Trigger name is required"],
  },
  type: {
    type: String,
    enum: Object.values(TriggerTypes),
    required: [true, "Trigger Type is required"],
  },
  subAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubAccount",
    required: [true, "SubAccount Id is required"],
  },
  automations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Automation', // Reference to the Automation model
    },
  ],
},
{
  timestamps: true,
});
  
triggerSchema.index({ subAccountId: 1 });

const Trigger: Model<Trigger> = mongoose.model<Trigger>("Trigger", triggerSchema);
export default Trigger;
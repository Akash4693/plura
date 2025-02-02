import mongoose, { Schema, Model } from "mongoose";
import { ActionType } from "@/constants/enums/action-type.enum";
import type { Action } from "@/lib/types/action.types";

// Action Schema
const actionSchema: Schema<Action> = new Schema({
  name: {
    type: String,
    required: true,
  }, 
  type: {
    type: String,
    enum: Object.values(ActionType),
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  laneId: {
    type: String,
    default: "0",
  },
  automationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Automation",
    required: true,
  },
}, 
  {
    timestamps: true,
});
  
actionSchema.index({ automationId: 1 });

const Action: Model<Action> = mongoose.model<Action>("Action", actionSchema);
export default Action;
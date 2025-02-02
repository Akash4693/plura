import mongoose, { Document } from "mongoose";

// Interface for the AutomationInstance document
export interface AutomationInstance extends Document {
  automationId: mongoose.Types.ObjectId;
  active: boolean;
}
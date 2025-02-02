import mongoose, { Document } from "mongoose";

// Interface for the Automation document
export interface Automation extends Document {
  name: string;
  published: boolean;
  triggerId: mongoose.Types.ObjectId | null;
  subAccountId: mongoose.Types.ObjectId;
  action: mongoose.Types.ObjectId[];
  automationInstance: mongoose.Types.ObjectId[];
}
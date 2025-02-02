import mongoose, { Document } from "mongoose";

// Interface for the ClassName document
export interface ClassName extends Document {
  name: string;
  color: string;
  funnelId: mongoose.Types.ObjectId;
  customData: string | null;
}
import mongoose, { Document } from "mongoose";

// Interface for the Lane document
export interface Lane extends Document {
  name: string;
  pipelineId: mongoose.Types.ObjectId; 
  tickets: mongoose.Types.ObjectId[]; 
  order: number;
}

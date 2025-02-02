import mongoose, { Document } from "mongoose";

// Interface for the Pipeline document
export interface Pipeline extends Document {
  name: string;
  subAccountId: mongoose.Types.ObjectId;
  lane: mongoose.Types.ObjectId[];
}
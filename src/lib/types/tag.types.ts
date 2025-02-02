import mongoose, { Document } from "mongoose";

// Interface for the Tag document
export interface Tag extends Document {
  name: string;
  color: string;
  subAccountId: mongoose.Types.ObjectId; 
  ticket: mongoose.Types.ObjectId; 
}
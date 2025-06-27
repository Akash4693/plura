import mongoose, { Document } from "mongoose";

// Interface for the Tag document
export interface Tag extends Document {
  _id: mongoose.Types.ObjectId | string; 
  name: string;
  color: string;
  subAccountId: mongoose.Types.ObjectId | string; 
  ticket?: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}
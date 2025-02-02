import mongoose, { Document } from "mongoose";

// Interface for the Media document
export interface Media extends Document {
  type: string | null;
  name: string;
  link: string;
  subAccountId: mongoose.Types.ObjectId; 
}

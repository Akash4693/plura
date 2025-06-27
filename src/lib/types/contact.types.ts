import mongoose, { Document } from "mongoose";

// Interface for the Contact document
export interface Contact extends Document {
  name: string;
  email: string;
  subAccountId: mongoose.Types.ObjectId;
  ticket: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt?: Date;
}
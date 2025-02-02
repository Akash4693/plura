import mongoose, { Document } from "mongoose";

// Interface for the AddOn document
export interface AddOn extends Document {
  name: string;
  active: boolean;
  priceId: string;
  agencyId: mongoose.Types.ObjectId | null;
}

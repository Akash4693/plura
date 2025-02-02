import mongoose, { Document } from "mongoose";

// Interface for the Funnel document
export interface Funnel extends Document {
  name: string;
  description: string | null;
  published: boolean;
  subDomainName: string | null;
  favicon: string | null;
  subAccountId: mongoose.Types.ObjectId; 
  funnelPages: mongoose.Types.ObjectId[];
  liveProducts: string[];
  className: mongoose.Types.ObjectId[];
}
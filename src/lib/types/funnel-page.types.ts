import mongoose, { Document } from "mongoose";

// Interface for the FunnelPage document
export interface FunnelPage extends Document {
  name: string;
  pathName: string;
  content: string | null;
  visits: number;
  order: number;
  previewImage: string | null;
  funnelId: mongoose.Types.ObjectId; 
}

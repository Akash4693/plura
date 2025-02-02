import mongoose, { Document } from "mongoose";

// Interface for the Ticket document
export interface Ticket extends Document {
    name: string;
    laneId: mongoose.Types.ObjectId;
    order: number;
    value: mongoose.Types.Decimal128 | null;
    description: string | null;
    customerId: mongoose.Types.ObjectId | null; 
    assignedUserId: mongoose.Types.ObjectId | null; 
    tags: mongoose.Types.ObjectId[]; 
  }
  
import mongoose, { Document } from "mongoose";
import { TriggerTypes } from "@/constants/enums/trigger-types.enum";

// Interface for the Trigger document
export interface Trigger extends Document {
    name: string;
    type: TriggerTypes;
    subAccountId: mongoose.Types.ObjectId; 
    automations: mongoose.Types.ObjectId[]; 
  }
  
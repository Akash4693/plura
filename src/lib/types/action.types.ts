import mongoose, { Document } from "mongoose";
import { ActionType } from "@/constants/enums/action-type.enum";

// Interface for the Action document
export interface Action extends Document {
  name: string;
  type: ActionType;
  order: number;
  laneId: string;
  automationId: mongoose.Types.ObjectId;
}

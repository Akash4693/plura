import mongoose, { Document, Types } from "mongoose";
import { SubAccount } from "./sub-account.types";

// Interface for the Permission document
export interface Permission extends Document {
  _id: Types.ObjectId | string;
  email: string;
  user: mongoose.Types.ObjectId; 
  subAccountId: mongoose.Types.ObjectId; 
  access: boolean; 
  SubAccount?: SubAccount;
}

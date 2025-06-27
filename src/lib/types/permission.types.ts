import mongoose, { Document, Types } from "mongoose";
import { SubAccount } from "./sub-account.types";

// Interface for the Permission document
export interface Permission extends Document {
  _id: Types.ObjectId | string;
  email: string;
  user: mongoose.Types.ObjectId; 
  subAccountId: mongoose.Types.ObjectId | SubAccount; 
  access: boolean; 
  SubAccount: SubAccount;
}

export interface PopulatedPermission extends Omit<Permission, 'subAccountId'> {
    subAccountId: SubAccount;
}
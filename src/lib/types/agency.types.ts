import mongoose, { Document, Types } from "mongoose";
import { AgencySidebarOption } from "./agency-sidebar-option.types";
import { SubAccount } from "./sub-account.types";

// Interface for the Agency document
export interface Agency extends Document {
  _id: Types.ObjectId | string;
  name: string;
  connectAccountId: string;
  // customerId: string;
  agencyLogo: string;
  companyEmail: string;
  companyPhone: string;
  whiteLabel: boolean;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  users?: Types.ObjectId[];
  subAccounts?: SubAccount[];
  sidebarOption?: AgencySidebarOption[];
  invitation?: Types.ObjectId[];
  notification?: Types.ObjectId[];
  subscription?: Types.ObjectId;
  addOns?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

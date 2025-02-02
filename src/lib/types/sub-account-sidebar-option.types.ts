import mongoose, { Document, Types } from "mongoose";
import { Icon } from "@/constants/enums/icon.enum";

// Interface for SubAccount Sidebar Option for document

export interface SubAccountSidebarOption extends Document {
  name: string;
  link: string;
  icon: string;
  subAccountId: Types.ObjectId;
}
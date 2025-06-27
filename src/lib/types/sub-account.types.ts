import mongoose, { Document, Types } from "mongoose";
import { SubAccountSidebarOption } from "./sub-account-sidebar-option.types";
import { Agency } from "./agency.types";
import { Permission } from "./permission.types";
import { Tag } from "./tag.types";

// Interface for the SubAccount document
export interface SubAccount extends Document {
  _id: Types.ObjectId | string; 
  connectAccountId: string;
  name: string;
  subAccountLogo?: string;
  companyEmail: string;
  companyPhone: string;
  goal: number;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  agencyId: Types.ObjectId; 
  sidebarOption?: SubAccountSidebarOption[];
  permissions: Types.ObjectId[];
  funnels: Types.ObjectId[];
  media: Types.ObjectId[];
  contact: Types.ObjectId[];
  trigger: Types.ObjectId[];
  automation: Types.ObjectId[];
  pipeline: Types.ObjectId[] | string;
  tags: Types.ObjectId[] | Tag[];
  notification: Types.ObjectId[];
}

export interface SubAccountDetailsProps {
  //To add the sub account to the agency
  agencyDetails:Agency
  details?: Partial<SubAccount>
  userId: string
  userName: string
}

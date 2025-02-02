import mongoose, { Document, Types } from "mongoose";
import { Role } from "@/constants/enums/role.enum";
import { Agency } from "./agency.types";
import { Permission } from "./permission.types";
import { SubAccount } from "./sub-account.types";

// Interface for the User document
export interface User extends Document {
  _id: Types.ObjectId;
  name:string;
  avatarUrl: string;
  email: string;
  role: Role;
  agencyId?: Types.ObjectId;
  permissions?: mongoose.Types.ObjectId[];
  tickets?: mongoose.Types.ObjectId[];
  notifications?: mongoose.Types.ObjectId[];
  subAccounts?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedUser extends User { 
  Agency?: Agency;
  Permissions?: Permission[];
  SubAccounts?: SubAccount[];
}

export type UserWithPermissionsAndSubAccounts = PopulatedUser | null;

export type AuthUserWithAgencySidebarOptionsSubAccounts = PopulatedUser | null;
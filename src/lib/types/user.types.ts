import mongoose, { Document, Types } from "mongoose";
import { Role } from "@/constants/enums/role.enum";
import { Agency } from "./agency.types";
import { Permission } from "./permission.types";
import { SubAccount } from "./sub-account.types";
import { _getUsersWithAgencySubAccountPermissionsSidebarOptions } from "@/services/user.service";

// Interface for the User document
export interface User extends Document {
  _id: Types.ObjectId;
  name:string;
  avatarUrl: string;
  email: string;
  role: Role;
  agencyId?: Types.ObjectId;
  permissions?: Permission[];
  tickets?: mongoose.Types.ObjectId[];
  notifications?: mongoose.Types.ObjectId[];
  subAccounts?: SubAccount[];
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

export type UsersWithAgencySubAccountPermissionsSidebarOptions = Awaited<
  ReturnType<typeof _getUsersWithAgencySubAccountPermissionsSidebarOptions>
>;


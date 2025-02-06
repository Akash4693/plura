import mongoose, { Document, Types } from "mongoose";
import { Role } from "@/constants/enums/role.enum";
import { Agency } from "./agency.types";
import { Permission } from "./permission.types";
import { SubAccount } from "./sub-account.types";
import { getUsersWithSubAccountPermissionsSidebarOptions } from "@/services/user.service";

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
  ReturnType<typeof getUsersWithSubAccountPermissionsSidebarOptions>
>;



/* const _getUsersWithSubAccountPermissionsSidebarOptions = async (agencyId: string) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccounts: true } },
      Permissions: { include: { SubAccounts: true } },
    },
  })  
}


export type UsersWithSubAccountPermissionsSidebarOptions = Prisma.PromiseReturnType<
  typeof _getUsersWithSubAccountPermissionsSidebarOptions
> */
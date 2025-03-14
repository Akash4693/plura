import mongoose, { Document, Types } from "mongoose";
import { PopulatedUser, User } from "./user.types";
import { Role } from "@/constants/enums/role.enum";

// Interface for the Notification document
export interface Notification extends Document {
  notification: string;
  agencyId: mongoose.Types.ObjectId | string; 
  subAccountId: mongoose.Types.ObjectId | null; 
  userId: mongoose.Types.ObjectId | PopulatedUser;
  User: PopulatedUser
  createdAt: Date;
  updatedAt: Date; 
}

// Interface for Notification Function Parameters
export interface SaveActivityLogsNotificationParams {
  agencyId?: mongoose.Types.ObjectId | string;
  description: string;
  subAccountId?: string;
}

export interface NotificationWithUser extends Omit<Notification, "userId"> {
  user: {
    _id: Types.ObjectId;
    name: string;
    avatarUrl: string;
    email: string;
    role: Role;
  } | null;
}

// Define an array type to match Prisma's & Notification)[]
export type NotificationsWithUsers = NotificationWithUser[];

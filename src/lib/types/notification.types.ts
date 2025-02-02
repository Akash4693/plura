import mongoose, { Document, Types } from "mongoose";
import { PopulatedUser, User } from "./user.types";

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
  userId: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  } | null;
}

// Define an array type to match Prisma's & Notification)[]
export type NotificationsWithUsers = NotificationWithUser[];

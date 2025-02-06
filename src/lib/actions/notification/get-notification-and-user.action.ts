"use server";

import { connectDB } from "@/lib/db";
import { NotificationWithUser } from "@/lib/types/notification.types";
import Notification from "@/models/notification.model";
import mongoose from "mongoose";

/**
 * Fetch notifications along with associated users.
 * @param agencyId - ID of the agency whose notifications are to be fetched.
 * @returns Array of notifications with associated user details.
 */
export const getNotificationAndUser = async (
  agencyId: string
): Promise<NotificationWithUser[]> => {
  try {
    await connectDB();
    

    const notifications = await Notification.find({ agencyId })
      .populate({
        path: "userId", // Populates the user details based on the `userId` field
        select: "role name email avatarUrl _id", // Specifies the fields to include from the user document
        options: { lean: true }, // Ensure the populated userId is also a plain object
      })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .lean() // Ensure the main notification object is a plain object
      .exec(); // Executes the query
      

      return notifications.map(({ userId, ...notification }) => ({
        ...notification,
        user: userId, // Rename userId to user
      })) as NotificationWithUser[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Failed to fetch notifications");
  }
};

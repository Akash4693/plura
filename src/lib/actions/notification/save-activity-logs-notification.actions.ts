"use server";
import { connectDB } from "@/lib/db";
import { SaveActivityLogsNotificationParams } from "@/lib/types/notification.types";
import Agency from "@/models/agency.model";
import Notification from "@/models/notification.model";
import SubAccount from "@/models/sub-account.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs";
import mongoose from "mongoose";

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: SaveActivityLogsNotificationParams): Promise<void> => {
  try {
    await connectDB()
    console.log("no Buffer in saveActivityLogsNotification")
    const authUser = await currentUser();
    let userData;

    // Fetch user data based on authentication
    if (!authUser) {
      const agency = await Agency.findOne({
        subAccountId: subAccountId,
      }).lean(); // Use .lean() to return plain JavaScript objects.

      console.log("saveActivityLogsNotification agency:", agency);

      if (agency) {
        userData = await Agency.findOne({ agencyId: agency._id }).lean(); // Convert to plain object.
      }
      console.log("saveActivityLogsNotification userData:", userData);
    } else {
      userData = await User.findOne({
        email: authUser?.emailAddresses[0]?.emailAddress,
      }).lean(); // Use .lean() to avoid Mongoose document issues.
    }

    userData = userData ? JSON.parse(JSON.stringify(userData)) : null;

    if (!userData) {
      console.log("Could not find a user");
      return;
    }

    let foundAgencyId = agencyId
      ? new mongoose.Types.ObjectId(agencyId)
      : null;
    console.log("saveActivityLogsNotification foundAgencyId:", foundAgencyId);

    // Validate agencyId or resolve from subaccountId
    if (!foundAgencyId) {
      if (!subAccountId) {
        throw new Error(
          "You need to provide at least an agency Id or subaccount Id"
        );
      }
      const subAccount = await SubAccount.findById(subAccountId).lean();
      if (subAccount) {
        foundAgencyId = subAccount.agencyId;
      }
    }

    // Create Notification
    const notificationData = {
      notification: `${userData.name} | ${description}`,
      userId: userData._id.toString(),
      agencyId: foundAgencyId ? foundAgencyId.toString() : null,
      ...(subAccountId && { SubAccount: subAccountId }),
    };

    
    await Notification.create(notificationData);
  } catch (error) {
    console.error("Error during saveActivityLogsNotification:", error);
  }
};




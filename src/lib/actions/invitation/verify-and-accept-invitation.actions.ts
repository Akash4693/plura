/* "use server";
import { saveActivityLogsNotification } from "./../notification/save-activity-logs-notification.actions";
import Invitation from "@/models/invitation.model";
import { currentUser, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createTeamUser } from "../agency/create-team-user.actions";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Agency from "@/models/agency.model";


export const verifyAndAcceptInvitation =
  async (): Promise<mongoose.Types.ObjectId | null> => {
    
    await connectDB();
    const user = await currentUser();
   // console.log("user:", user);
    if (!user) return redirect("/sign-in");

    

    const invitationExists = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
      status: "PENDING",
    }).lean();

    console.log("invitationExists:", invitationExists);

    if (invitationExists?.agencyId) {
      const userDetails = await createTeamUser(invitationExists.agencyId, {
        email: invitationExists.email,
        agencyId: invitationExists.agencyId, //
        avatarUrl: user.imageUrl,
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: invitationExists.role,
      });
      console.log("userDetails:", userDetails);

      await saveActivityLogsNotification({
        agencyId: invitationExists?.agencyId,
        description: `Joined`,
        subAccountId: undefined,
      });

      if (userDetails) {
        await clerkClient.users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });

        await Invitation.deleteOne({ email: userDetails.email });

        return userDetails.agencyId || null;
      } else {
        return null;
      }
    } else {
      const agency = await Agency.findOne({
        companyEmail: user.emailAddresses[0].emailAddress,
      }).lean();
      console.log("Agency found:", agency)
      return agency ? new mongoose.Types.ObjectId(agency._id) : null;
    }
  }; */

"use server";
import { saveActivityLogsNotification } from "./../notification/save-activity-logs-notification.actions";
import Invitation from "@/models/invitation.model";
import { currentUser, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { createTeamUser } from "../agency/create-team-user.actions";
import User from "@/models/user.model";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Agency from "@/models/agency.model";
import { Role } from "@/constants/enums/role.enum";

export const verifyAndAcceptInvitation = async (): Promise<string | null> => {
  await connectDB();
  console.log("MongoDb connected in verifyAndAcceptInvitation")
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  

  const email = user?.emailAddresses?.[0]?.emailAddress.toString();
  if (!email) {
    console.error("User email address not found.");
    return null;
  }

  console.log("email:", email )

  const invitations = await Invitation.find({ email }).lean();
console.log("All Invitations for Email:", invitations);


  const invitationExists = await Invitation.findOne({
    email,
    status: "PENDING",
  }).lean();

  console.log("invitationExists:", invitationExists);

 

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId?.toString(), {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
    });
    console.log("Invitation userDetails:", userDetails);

    await saveActivityLogsNotification({
      agencyId: invitationExists?.agencyId.toString(),
      description: `Joined`,
      subAccountId: undefined,
    });

    if (userDetails) {
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || Role.SUBACCOUNT_USER,
        },
      });

      await Invitation.deleteOne({ email: userDetails.email });

      // Convert agencyId to string before returning it to client component
      return userDetails.agencyId ? userDetails.agencyId.toString() : null;
    } else {
      return null;
    }
  } else {
    const agency = await User.findOne({
      email: user.emailAddresses[0].emailAddress,
    }).lean();

   console.log("Agency found:", agency);

    // Convert _id to string and remove any non-serializable fields (like methods)
    return agency?.agencyId ? agency.agencyId.toString() : null;
  }
};

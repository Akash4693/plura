"use server";
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import Agency from "@/models/agency.model";
import Invitation from "@/models/invitation.model"; // Import Mongoose model
import { clerkClient } from "@clerk/nextjs";

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  try {
    await connectDB();

    const invitation = await Invitation.create({ email, agencyId, role });

    const invitations = await clerkClient.invitations.getInvitationList();

    console.log("Invitation existing", invitations);

    await Agency.findByIdAndUpdate(
      agencyId,
      { $addToSet: { invitation: invitation._id } } // addToSet avoids duplicates
    );

    const response = await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    });
    console.log("response", response);
    return invitation; // Convert Mongoose Document to Plain Object
  } catch (error) {
    console.error("Error sending invitation:", error);

    throw Error("Failed to send invitation. Please try again later.");
  }
};

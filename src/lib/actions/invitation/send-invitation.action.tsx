"use server"
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import Invitation from "@/models/invitation.model"; // Import Mongoose model
import { clerkClient } from "@clerk/nextjs";

export const sendInvitation = async (
    role: Role,
    email: string,
    agencyId: string
) => {
    try {
        await connectDB()

        const invitation = await Invitation.create({ email, agencyId, role });

        // Send invitation via Clerk
        await clerkClient.invitations.createInvitation({
            emailAddress: email,
            redirectUrl: process.env.NEXT_PUBLIC_URL,
            publicMetadata: {
                throughInvitation: true,
                role,
            },
        });

        return invitation.toObject(); // Convert Mongoose Document to Plain Object
    } catch (error) {
        console.error("Error sending invitation:", error instanceof Error ? error.message : error);
    
        throw new Error("Failed to send invitation. Please try again later.");
    }
    
};

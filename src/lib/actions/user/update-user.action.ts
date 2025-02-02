"user server"
import { clerkClient } from "@clerk/nextjs";
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";


export const updateUser = async (user: Partial<UserType>) => {
    try {
        await connectDB()

        const response = await User.findOneAndUpdate(
            { email: user.email },
            { $set: {...user} },
            { new: true }
        ).exec();
    
        if (!response) {
            throw new Error("User not found or update failed")
        }
    
        await clerkClient.users.updateUserMetadata(response._id.toString(), {
            privateMetadata: {
                role: user.role || Role.SUBACCOUNT_USER,
            },
        });    

        return response;
    } catch (error) {
        console.error("Error updating user:", error);
    throw new Error("Failed to update user");
    }

    

    
}
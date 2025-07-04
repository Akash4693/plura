"use server";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";

export const updateUser = async (user: Partial<UserType>) => {
  try {
    await connectDB();
    console.log("monogodb connected in updateUser")
    const clerkCurrentUser = await currentUser();

    if (!clerkCurrentUser) {
        console.error("No authenticated user found in clerk")
        return;
    }
   
    
    const response = await User.findOneAndUpdate(
      
      { email: user.email },
      { $set: { ...user } },
      { new: true }
    ).lean();

    console.log("user", user.email)
    console.log("UpdateUser response:", response);

    if (!response) {
      throw new Error("User not found or update failed");
    }


    await clerkClient.users.updateUserMetadata(clerkCurrentUser.id, {
      privateMetadata: {
        role: user.role || Role.SUBACCOUNT_USER,
      },
    });

    return response;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

"use server"
 import { UserWithPermissionsAndSubAccounts } from "@/lib/types/user.types"; 
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export const getUserPermissions = async (userId: string): Promise<UserWithPermissionsAndSubAccounts | null> => {
  try {
    await connectDB()
    console.log("monogodb connected in getUserPermissions")
    const response = await User.findOne({ _id: userId })
    .populate("permissions")
    .populate("subAccounts")
    .lean(); 

    return response as UserWithPermissionsAndSubAccounts; 
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null; 
  }
};

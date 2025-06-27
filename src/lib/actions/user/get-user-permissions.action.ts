"use server"
 import { UserWithPermissionsAndSubAccounts } from "@/lib/types/user.types"; 
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export const getUserPermissions = async (userId: string): Promise<UserWithPermissionsAndSubAccounts | null> => {
  try {
    await connectDB()
    console.log("mongoDB connected in getUserPermissions")
    const response = await User.findOne({ _id: userId })
   .populate({
      path: "permissions",
      populate: {
        path: "subAccountId",
        model: "SubAccount",
      },
    })
    .populate("subAccounts")
    .lean(); 

      if (!response) return null;

      const permissionsWithAlias = response.permissions?.map((permission: any) => ({
      ...permission,
      SubAccount: permission.subAccountId, // alias
    }));
    console.log("get user permissions response:", response);
    console.log("response permissions with alias:", permissionsWithAlias);

    return {
      ...response,
      permissions: permissionsWithAlias,
    } as UserWithPermissionsAndSubAccounts; 
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null; 
  }
};

 "use server"

import { connectDB } from "@/lib/db"
import { Permission as PermissionType } from "@/lib/types/permission.types"
import Permission from "@/models/permission.model"
import SubAccount from "@/models/sub-account.model"
import User from "@/models/user.model"
import { Types } from "mongoose"

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
): Promise<PermissionType | null> => {
    try {
        await connectDB()
        console.log("✅ MongoDB connected in changeUserPermissions");
   
        if (permissionId) {
      // Update existing permission by ID
      const response = await Permission.findByIdAndUpdate(
        permissionId,
        { access: permission },
        { 
          new: true,
          runValidators: true
        }
      );

      console.log("change user permission response:", response)
      
      if (!response) {
        throw new Error(`Permission with ID ${permissionId} not found`);
      }

      return response;
    } else {
      // Find user first to get user ID
      const user = await User.findOne({ email: userEmail });
      
      if (!user) {
        throw new Error(`User with email ${userEmail} not found`);
      }

      // Use upsert to create or update
      const response = await Permission.findOneAndUpdate(
        {
          email: userEmail,
          subAccountId: new Types.ObjectId(subAccountId)
        },
        {
          access: permission,
          email: userEmail,
          user: user._id,
          subAccountId: new Types.ObjectId(subAccountId)
        },
        {
          new: true,
          upsert: true, // Create if doesn't exist
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      console.log("Upsert result:", response);

      // If this is a new permission, add it to user's permissions array
      if (response) {

        console.log("Adding permission to user and subAccount arrays");

        await Promise.all([
          User.findByIdAndUpdate(
            user._id,
            { $addToSet: { permissions: response._id } },
            { new: true }
          ),
          SubAccount.findByIdAndUpdate(
            subAccountId,
            { $addToSet: { permissions: response._id } },
            { new: true }
          )
        ]);

          console.log("Permission arrays updated successfully");
      }

      return response;
    }
  } catch (error) {
    console.error("Error changing user permission:", error);
    throw error;
  }
};

/*export const changeUserPermissions = async (
    permissionId: string | undefined,
    userEmail: string,
    subAccountId: string,
    permission: boolean
): Promise<PermissionType | null> => {
    try {
        await connectDB()
        console.log("✅ MongoDB connected in changeUserPermissions");
        const response = await Permission.findOneAndUpdate(
            { _id: permissionId },
            { access: permission },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        console.log("change user permission response:", response)
        if (!response) {
            console.log("🔴 No existing permission found. Creating a new one.");
            const newPermission = new Permission({
                access: permission,
                email: userEmail,
                subAccountId: new Types.ObjectId(subAccountId),
            });
            console.log("new permission created:", newPermission);
            await newPermission.save();
            return newPermission;
        }

       
        return response;

    } catch (error) {
        console.log('🔴 Could not change permission', error);
        return null;      
    }
}*/
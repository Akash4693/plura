"use server"

import { connectDB } from "@/lib/db"
import { Permission as PermissionType } from "@/lib/types/permission.types"
import Permission from "@/models/permission.model"
import { Types } from "mongoose"

export const changeUserPermissions = async (
    permissionId: string | undefined,
    userEmail: string,
    subAccountId: string,
    permission: boolean
): Promise<PermissionType | null> => {
    try {
        await connectDB()

        const response = await Permission.findOneAndUpdate(
            { _id: permissionId },
            { access: permission },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!response) {
            const newPermission = new Permission({
                access: permission,
                email: userEmail,
                subAccountId: new Types.ObjectId(subAccountId),
            });
            await newPermission.save();
            return newPermission;
        }

        return response

    } catch (error) {
        console.log('🔴 Could not change permission', error);
        return null;      
    }
} 
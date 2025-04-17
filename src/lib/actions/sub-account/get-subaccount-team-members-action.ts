/* import { Role } from "@/constants/enums/role.enum"

export const getSubAccountTeamMembers = async (subaccountId: string) => {
    const subaccountUsersWithAccess = await db.user.findMany({
        where: {
            Agency: {
                SubAccount: {
                    some: {
                        id: subaccountId,
                    },
                },
            },
            role: Role.SUBACCOUNT_USER,
            Permissions: {
                some: {
                    subAccountId: subaccountId,
                    access: true
                },
            },
        },
    })
    return subaccountUsersWithAccess
} */

"use server";

import User from "@/models/user.model";
import { Role } from "@/constants/enums/role.enum";
import { Types } from "mongoose";
import Agency from "@/models/agency.model";
import { connectDB } from "@/lib/db";

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  try {
    await connectDB();
    
    const subaccountUsersWithAccess = await User.find({
      role: Role.SUBACCOUNT_USER,
      agencyId: {
        $in: await Agency.find({
          subAccounts: { $in: [new Types.ObjectId(subaccountId)] }, // Ensure the agency has the given subaccountId
        }).distinct("_id"), // Get only agency IDs that contain the subaccount
      },
    })
      .populate({
        path: "permissions",
        match: {
          subAccountId: subaccountId,
          access: true, // Ensure the user has access to the sub-account
        },
        select: "subAccountId access",
      })
      .exec();

    // Filter the users who actually have permissions for the specific subaccount
    const usersWithPermissions = subaccountUsersWithAccess.filter(
      (user) => Array.isArray(user.permissions) && user.permissions.length > 0
    );

    return usersWithPermissions;
  } catch (error) {
    console.error("Error fetching subaccount team members:", error);
    throw new Error("Unable to fetch subaccount team members");
  }
};

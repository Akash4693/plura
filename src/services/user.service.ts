"use server";

import { connectDB } from "@/lib/db";
import { PopulatedUser } from "@/lib/types/user.types";
import User from "@/models/user.model";
import { Types } from "mongoose";

export const _getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
): Promise<PopulatedUser | null> => {
  try {
    await connectDB();
    console.log("User service connected");

    if (!Types.ObjectId.isValid(agencyId)) return null;

   
    const user = await User.findOne({ agencyId: new Types.ObjectId(agencyId) })
      .populate({
        path: "agencyId",
        model: "Agency",
        populate: {
          path: "subAccounts",
          model: "SubAccount",
        },
      })
      .populate({
        path: "permissions",
        model: "Permission",
        populate: {
          path: "subAccountId",
          model: "SubAccount",
        },
      })
      .lean()
      .exec();

    console.log("Fetched User:", user);

    if (!user) return null;

    return {
      ...user,
      Agency: user.agencyId, // Rename `agencyId` to `agency`
    } as PopulatedUser;
  } catch (error) {
    console.error("Error fetching user with sub-account permissions:", error);
    return null;
  }
};



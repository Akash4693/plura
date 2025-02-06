import { PopulatedUser } from "@/lib/types/user.types";
import User from "@/models/user.model";
import { Types } from "mongoose";

export const getUsersWithSubAccountPermissionsSidebarOptions = async (
    agencyId: string
): Promise<PopulatedUser | null> => {
    return await User.findOne({ agencyId: new Types.ObjectId(agencyId) })
        .populate({
            path: "agencyId",
            model: "Agency",
            populate: { path: "subAccounts", model: "SubAccount" },
            options: { lean: true }
          })
        .populate({
            path: "permissions",
            model: "Permission",
            populate: { path: "subAccountId", model: "SubAccount" },
            options: { lean: true }
        })
        .lean() as PopulatedUser | null; // Ensuring the return type is correctly inferred
};
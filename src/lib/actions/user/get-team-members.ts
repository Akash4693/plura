"use server";

import { connectDB } from "@/lib/db";
import { Agency as AgencyType } from "@/lib/types/agency.types";
import { PopulatedUser } from "@/lib/types/user.types";
import Agency from "@/models/agency.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs";
import { Types } from "mongoose";

interface PopulatedAgency extends AgencyType {
  subAccounts: any[]; // Replace with proper SubAccount type
}

const getTeamMembers = async (agencyId: string) => {
  try {
    await connectDB();
    // Get the current authenticated user
    const authUser = await currentUser();

    if (!authUser) {
      return null;
    }

    // Validate agencyId format
    if (!Types.ObjectId.isValid(agencyId)) {
      throw new Error("Invalid agency ID format");
    }

    const agencyObjectId = new Types.ObjectId(agencyId);

    // Find all team members belonging to the agency
    const rawMembers = await User.find({
      agencyId: agencyObjectId,
    })
      .populate({
        path: "agencyId",
        populate: {
          path: "subAccounts",
          model: "SubAccount",
        },
      })
      .populate({
        path: "permissions",
        populate: {
          path: "subAccountId",
          model: "SubAccount",
        },
      })
      .lean<PopulatedUser[]>();

    const teamMembers = rawMembers.map(({ agencyId, ...rest }) => ({
      ...rest,
      agencyId,
      Agency: agencyId,
    }));

    // Find agency details with populated sub-accounts
    const agencyDetails = await Agency.findById(agencyObjectId)
      .populate({
        path: "subAccounts",
        model: "SubAccount", // Ensure this matches your SubAccount model name
      })
      .lean<PopulatedAgency>();

    if (!agencyDetails) {
      return null;
    }

    return {
      teamMembers: teamMembers as PopulatedUser[],
      agencyDetails: agencyDetails as PopulatedAgency,
    };
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
};

export default getTeamMembers;

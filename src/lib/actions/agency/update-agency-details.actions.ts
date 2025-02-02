"use server";

import { connectDB } from "@/lib/db";
import { Agency as AgencyType } from "@/lib/types/agency.types";
import Agency from "@/models/agency.model";

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<AgencyType>
): Promise<AgencyType | null> => {
  
    await connectDB();
    try {
    if (!agencyId) {
      throw new Error("Agency ID is required.");
    }

    const response = await Agency.findByIdAndUpdate(
      agencyId,
      { $set: agencyDetails },
      { new: true, runValidators: true }
    ).lean();

    if (!response) {
      throw new Error("Agency not found or failed to update.");
    }

    return response as AgencyType;
  } catch (error) {
    throw new Error(
      `Failed to update agency details: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`
    );
  }
};

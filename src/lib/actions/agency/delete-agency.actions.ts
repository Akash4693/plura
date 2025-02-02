"use server";

import { connectDB } from "@/lib/db";
import Agency from "@/models/agency.model";

export const deleteAgency = async (agencyId: string) => {
  
  await connectDB();
  try {
    const response = await Agency.findByIdAndDelete(agencyId);
    if (!response) {
      throw new Error("Agency not found");
    }

    return response;
  } catch (error) {
    throw new Error(
      `Failed to delete agency: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`
    );
  }
};

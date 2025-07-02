"use server";

import { connectDB } from "@/lib/db";
import Pipeline from "@/models/pipeline.model";
import mongoose from "mongoose";

export const getPipelineDetails = async (pipelineId: string) => {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(pipelineId)) {
      throw new Error("Invalid pipeline ID");
    }

    const response = await Pipeline.findById(pipelineId);

    if (!response) {
      throw new Error("Pipeline not found");
    }

    return response;
  } catch (error) {
    console.error("Error fetching Pipelines:", error);
    throw new Error("Failed to fetch Pipelines.");
  }
};

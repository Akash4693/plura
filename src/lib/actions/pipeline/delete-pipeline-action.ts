"use server";

import { connectDB } from "@/lib/db";
import Lane from "@/models/lane.model";
import Pipeline from "@/models/pipeline.model";

/**
 * Deletes a pipeline by its ID.
 * @param pipelineId - The ID of the pipeline to delete
 * @returns The deleted pipeline document or null
 */

export const deletePipeline = async (pipelineId: string) => {
  try {
    await connectDB();

    // First, find the pipeline
    const pipeline = await Pipeline.findById(pipelineId);
    if (!pipeline) return null;

    // Delete related lanes
    await Lane.deleteMany({ _id: { $in: pipeline.lane } });

    // Delete the pipeline
    const deletedPipeline = await Pipeline.findByIdAndDelete(pipelineId);

    return deletedPipeline;
  } catch (error) {
    console.error("Error deleting pipeline:", error);
    throw new Error("Failed to delete pipeline and related data.");
  }
};

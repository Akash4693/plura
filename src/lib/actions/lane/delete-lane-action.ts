"use server";

import { connectDB } from "@/lib/db";
import Lane from "@/models/lane.model";
import Pipeline from "@/models/pipeline.model";

export const deleteLane = async (laneId: string) => {
    try {
        await connectDB();

        const deletedLane = await Lane.findByIdAndDelete(laneId).lean();

        if (!deletedLane) {
            throw new Error("Lane not found");
          }

        await Pipeline.updateOne(
            { _id: deletedLane.pipelineId },
            { $pull: { lane: laneId } }
        )

        return deletedLane
    } catch (error) {
        console.error("Error deleting lane:", error);
        throw new Error("Failed");
        
    }
}



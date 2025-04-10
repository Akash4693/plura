"use server";

import { connectDB } from "@/lib/db";
import type { Lane as LaneType } from "@/lib/types/lane.types";
import Lane from "@/models/lane.model";

export const updateLanesOrder = async (lanes: LaneType[]): Promise<void> => {
    try {
        await connectDB();
        
        const laneUpdateOperations = lanes.map((lane) => ({
            updateOne: {
                filter: { _id: lane._id },
                update: { $set: { order: lane.order } },
            },
        }));

        await Lane.bulkWrite(laneUpdateOperations);

        console.log("✅ Lanes reordered successfully.");
    } catch (error) {
        console.error("Error updating lanes order:", error);
        throw new Error("Failed to update lanes order.");
        
    }
}
"use server"

import { connectDB } from "@/lib/db"
import { LaneDetail } from "@/lib/types/lane.types"
import Contact from "@/models/contact.model"
import Lane from "@/models/lane.model"
import Tag from "@/models/tag.model"
import User from "@/models/user.model"

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    try{
        await connectDB()
        const lanes = await Lane.find({ pipelineId })
            .sort({ order: 1 })
            .populate({
                path: "tickets",
                options: {
                    sort: { order: 1 },
                },
                populate: [
                    { path: "tags", model: Tag },
                    { path: "assignedUserId", model: User },
                    { path: "customerId", model: Contact },
                ]
            })
            .lean();
            console.log("Lanes : ", lanes);
            
            return lanes as LaneDetail[];
    } catch (error) {
        console.error("Error fetching lanes with tickets and tags:", error);
        throw new Error("Failed to fetch lanes with tickets and tags.");
    }
};
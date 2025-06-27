"use server";

import { connectDB } from "@/lib/db";
import { TicketsAndTags } from "@/lib/types/ticket.types";

import Lane from "@/models/lane.model";
import Ticket from "@/models/ticket.model";

export const getTicketsWithTags = async (pipelineId: string): Promise<TicketsAndTags[]> => {
    try {
        await connectDB();

        const lanes = await Lane.find({ pipelineId }).select("_id")
        const laneIds = lanes.map((lane) => lane._id);

        const tickets = await Ticket.find({ laneId: { $in: laneIds } })
            .populate("tags")
            .populate("assignedUserId")
            .populate("customerId") 
            .lean();

        return tickets as TicketsAndTags[];
    } catch (error) {
        console.error(`Error fetching tickets with tags: ${error}`);
        throw new Error(`Failed to fetch tickets with tags`);
        
    }
}


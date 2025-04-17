"use server";

import { connectDB } from "@/lib/db";
import { Ticket as TicketType } from "@/lib/types/ticket.types";
import Ticket from "@/models/ticket.model";

export const _getTicketsWithAllRelations = async(laneId: string): Promise<TicketType[]> => {
    try {
        await connectDB();

        const tickets = await Ticket.find({ laneId })
        .populate("assignedUserId")
        .populate("customerId")
        .populate("laneId")
        .populate("tags")
        .lean();

        return tickets as TicketType[]
    } catch (error) {
        console.error("Error getting tickets with all relations", error);
        throw new Error("Unable to fetch tickets")
        
    }
}


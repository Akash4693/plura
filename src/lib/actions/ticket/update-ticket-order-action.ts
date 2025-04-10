"use server";

import { connectDB } from "@/lib/db";
import type { Ticket as TicketType } from "@/lib/types/ticket.types";
import Lane from "@/models/lane.model";
import Ticket from "@/models/ticket.model";

export const updateTicketsOrder = async (tickets: TicketType[]): Promise<void> => {
    try {
        await connectDB();

        const ticketUpdateOperations = tickets.map((ticket) => ({
            updateOne: {
                filter: { _id: ticket._id },
                update: { 
                    $set: { 
                        order: ticket.order, 
                        laneId: ticket.laneId 
                    }, 
                },
            },

        }))

        await Ticket.bulkWrite(ticketUpdateOperations);

        console.log("✅ Tickets reordered successfully.");
    } catch (error) {
        console.error("Error updating ticket order: ", error);
        throw new Error("Failed to update ticket order.");
        
    }
}


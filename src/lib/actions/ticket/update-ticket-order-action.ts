"use server";

import { connectDB } from "@/lib/db";
import type { Ticket as TicketType } from "@/lib/types/ticket.types";
import Lane from "@/models/lane.model";
import Ticket from "@/models/ticket.model";


export const updateTicketsOrder = async (tickets: TicketType[]): Promise<void> => {
  try {
    await connectDB();
    console.log("🛠 Connected to MongoDB - updateTicketsOrder");

    const validTickets = tickets.filter(ticket => ticket._id && ticket.laneId);
    if (validTickets.length === 0) {
      console.log("⚠ No valid tickets to update");
      return;
    }

    for (const ticket of validTickets) {
      const { _id, laneId, order } = ticket;

      // 1. Get the current laneId (origin) from DB
      const existingTicket = await Ticket.findById(_id).select("laneId").lean();
      if (!existingTicket) continue;

      const originLaneId = existingTicket.laneId?.toString();
      const destinationLaneId = laneId.toString();

      // 2. Update ticket's laneId and order
      await Ticket.updateOne(
        { _id },
        { $set: { laneId: destinationLaneId, order } }
      );

      // 3. If laneId changed, update the lanes
      if (originLaneId && originLaneId !== destinationLaneId) {
        await Lane.updateOne(
          { _id: originLaneId },
          { $pull: { tickets: _id } }
        );

        await Lane.updateOne(
          { _id: destinationLaneId },
          { $addToSet: { tickets: _id } } // use $addToSet to avoid duplicates
        );
      }
    }

    console.log("✅ Tickets updated with correct lane assignments and orders");

  } catch (error) {
    console.error("❌ Error in updateTicketsOrder:", error);
    throw new Error("Failed to update ticket positions and lane mapping");
  }
};


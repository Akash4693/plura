"use server";
import Ticket from "@/models/ticket.model"; // Mongoose Ticket model
import { Types } from "mongoose"; // For MongoDB ObjectId handling
import { Tag } from "@/lib/types/tag.types"; // Tag type
import { TicketCreateInput } from "@/lib/types/ticket.types";
import { connectDB } from "@/lib/db";
import { TicketsAndTags } from "@/lib/types/lane.types"; // Import TicketsAndTags type

export const upsertTicket = async (
  ticket: TicketCreateInput, 
  tags: Tag[]
): Promise<TicketsAndTags> => {  // Specify the return type explicitly
  try {
    await connectDB();
    
    let order: number;
    if (ticket.order === undefined) {
      const tickets = await Ticket.find({ laneId: ticket.laneId });
      order = tickets.length; 
    } else {
      order = ticket.order;
    }

    const ticketId = ticket._id || new Types.ObjectId();

    // Update or insert the ticket document
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        $set: {
          ...ticket,
          tags: tags.map((tag) => tag._id), 
          order, 
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true, // Create a new document if not found
        new: true, // Return the updated document (or newly created document)
        runValidators: true, // Ensure the document is validated before saving
      }
    )
    .populate("assignedUserId customerId tags laneId") // Populate related fields
    .lean(); // Use `.lean()` to make it a plain JavaScript object

    // Type cast the returned object as `TicketsAndTags` for type safety
    return updatedTicket as TicketsAndTags; // Ensure it matches TicketsAndTags type
  } catch (error) {
    console.error("Error upserting ticket:", error);
    throw new Error("Failed to upsert ticket");
  }
};

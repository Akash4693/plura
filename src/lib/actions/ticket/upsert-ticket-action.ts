"use server";
import Ticket from "@/models/ticket.model"; // Mongoose Ticket model
import { Types } from "mongoose"; // For MongoDB ObjectId handling
import { Tag as TagType } from "@/lib/types/tag.types"; // Tag type
import { TicketCreateInput, TicketsAndTags } from "@/lib/types/ticket.types";
import { connectDB } from "@/lib/db";
import Tag from "@/models/tag.model";
import Lane from "@/models/lane.model";
import User from "@/models/user.model";

export const upsertTicket = async (
  ticket: TicketCreateInput, 
  tags: TagType[]
): Promise<TicketsAndTags> => {  // Specify the return type explicitly
  try {
    await connectDB();
    
    let order: number;
    if (!ticket.order) {
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

    const finalTicketId = new Types.ObjectId(updatedTicket._id);

    console.log("Final Ticket ID:", finalTicketId);
    console.log("Tags to be added to ticket", tags);
    // Add ticket ref to each tag's `ticket` field (assuming 1 ticket per tag)
    await Promise.all(
      tags.map((tag) =>
        Tag.findByIdAndUpdate(tag._id, {
          $set: { ticket: finalTicketId },
        })
      )
    );

    // Push ticket ID into the Lane’s tickets[] if not already present
    await Lane.updateOne(
      { _id: ticket.laneId, tickets: { $ne: finalTicketId } },
      { $push: { tickets: finalTicketId } }
    );
    
    console.log("userId assigned for ticket", ticket.assignedUserId);
   
   if (ticket.assignedUserId){
    await User.updateOne(
      { _id: ticket.assignedUserId, tickets: { $ne: finalTicketId } },
      { $push: { tickets: finalTicketId } }
    )
    }

    return updatedTicket as TicketsAndTags; // Ensure it matches TicketsAndTags type
  } catch (error) {
    console.error("Error upserting ticket:", error);
    throw new Error("Failed to upsert ticket");
  }
};

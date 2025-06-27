"use server";

import { connectDB } from "@/lib/db";
import Lane from "@/models/lane.model";
import Tag from "@/models/tag.model";
import Ticket from "@/models/ticket.model";
import User from "@/models/user.model";


export const deleteTicket = async (ticketId: string) => {
  try {
    await connectDB();
    
    const response = await Ticket.findByIdAndDelete(ticketId);
    if (!response) {
      throw new Error(`Ticket with id ${ticketId} not found`);
    }
    
     const operations = [
      
      User.updateMany(
        { tickets: ticketId },
        { $pull: { tickets: ticketId } }
      ),
      
      Lane.updateMany(
        { tickets: ticketId },
        { $pull: { tickets: ticketId } }
      ),
      
      Tag.updateMany(
        { ticket: ticketId },
        { $unset: { ticket: "" } }
      )
    ];

    await Promise.all(operations);

    
    return response;
  } catch (error) {
    console.error(`Error deleting ticket: ${error}`);
    throw new Error('Failed to delete the ticket');
  }
};

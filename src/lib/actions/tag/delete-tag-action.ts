"use server";

import { connectDB } from "@/lib/db";
import SubAccount from "@/models/sub-account.model";
import Tag from "@/models/tag.model";
import Ticket from "@/models/ticket.model";
import mongoose from "mongoose";

export const deleteTag = async (tagId: string) => {
    try {
        await connectDB();
        console.log("MongoDB connection established for deleteTag");

        const tagIdAsObjectId = new mongoose.Types.ObjectId(tagId); 
        const deletedTag = await Tag.findByIdAndDelete(tagIdAsObjectId);

        if (!deletedTag) {
      throw new Error(`Tag with ID ${tagId} not found`);
    }

     const ticketUpdate = Ticket.updateMany(
      { tags: tagIdAsObjectId },
      { $pull: { tags: tagIdAsObjectId } }
    );

    // 3. Remove tag from all subaccounts that reference it
    const subAccountUpdate = SubAccount.updateMany(
      { tags: tagIdAsObjectId },
      { $pull: { tags: tagIdAsObjectId } }
    );

    // Run both operations in parallel
    await Promise.all([ticketUpdate, subAccountUpdate]);


        return deletedTag;
    } catch (error) {
        console.error("Error deleting tag:", error);
        throw new Error("Failed to delete tag");
    }
}




/* export const deleteTag = async (tagId: string) => {
    const response = await db.tag.delete({ where: { id: tagId } })
    return response
} */
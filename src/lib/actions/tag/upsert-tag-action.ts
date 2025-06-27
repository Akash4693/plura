"use server"

import { connectDB } from "@/lib/db"
import { Tag as TagType } from "@/lib/types/tag.types"
import SubAccount from "@/models/sub-account.model"
import Tag from "@/models/tag.model"
import Ticket from "@/models/ticket.model"
import mongoose from "mongoose"

export const upsertTag = async ( subAccountId: string, tag: Partial<TagType>) => {
    try {
       
        await connectDB()
        console.log("MongoDB connection established for upsertTag");
        const tagId = tag._id ? new mongoose.Types.ObjectId(tag._id) : new mongoose.Types.ObjectId()
        
        const upsertedTag = await Tag.findOneAndUpdate(
            { _id: tagId, subAccountId: subAccountId },
            {
                $set: {
                    name: tag.name,
                    color: tag.color,
                    subAccountId: new mongoose.Types.ObjectId(subAccountId),
                    updatedAt: new Date(),
                    ...(tag.createdAt ? { createdAt: tag.createdAt }: {})
                },
            },
            {
                upsert: true, // Create a new document if not found
                new: true, // Return the updated document (or newly created document)
                runValidators: true, // Ensure the document is validated before saving
                setDefaultsOnInsert: true,
            }
        )
        console.log("Tag upserted successfully:", upsertedTag)
        console.log("tag:", tag)

        console.log("tag.ticket:", tag.ticket)
        
        console.log("Tag ID to push into ticket:", upsertedTag._id);

        /* if (tag.ticket) {
      await Ticket.findByIdAndUpdate(
        tag.ticket,
        {
          $addToSet: { tags: upsertedTag._id }, // avoids duplicates
        },
        { new: true }
      );
    } */
    
    // 3. Add tag to subaccount if not already present
    await SubAccount.findByIdAndUpdate(
      new mongoose.Types.ObjectId(subAccountId),
      {
        $addToSet: { tags: upsertedTag._id }, // avoids duplicates
      },
      { new: true }
    );

    return upsertedTag;
    } catch (error) {
        console.error("UpsertTag error:", error);
    throw new Error("Failed to upsert tag");
    }
}


/* export const upsertTag = async (
    subaccountId: string,
    tag: TagUncheckedCreateInput
) => {
    const response = await db.tag.upsert({
        where: { id: tag.id || v4(), subAccountId: subaccountId },
        update: tag,
        create: { ...tag, subAccountId: subaccountId },
    })
    return repsonse

} */


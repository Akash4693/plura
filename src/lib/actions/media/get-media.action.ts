"use server"

import { connectDB } from "@/lib/db";

import SubAccount from "@/models/sub-account.model";
import Media from "@/models/media.model";

export const getMedia = async (subaccountId: string) => {
    try {
        await connectDB();
        
        const mediaFiles = await SubAccount.findById(subaccountId)
         .populate({
            path: "media",
            model: "Media", // Explicitly specify model
          })
        .lean()

        if (!mediaFiles) return null;

        console.log("Media Files:", mediaFiles)
        
        return {
            ...mediaFiles,
            media: mediaFiles.media.map((file: any) => ({
                ...file,
                _id: file._id.toString(), // Convert ObjectId to string
                subAccountId: file.subAccountId.toString(), // Convert ObjectId to string
            })),
        };
    } catch (error) {
        console.error("Internal getMedia Server Error:", error);
        throw error;        
    } 
}


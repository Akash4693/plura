"use server";

import { connectDB } from "@/lib/db";
import { Tag } from "@/lib/types/tag.types";

import SubAccount from "@/models/sub-account.model";
import { Types } from "mongoose";

export const getTagsForSubAccount = async (
  subAccountId: string
): Promise<Tag[]> => {
  try {

    await connectDB()
    console.log("MongoDB connection established for getTagsForSubAccount");
    
    const objectId = new Types.ObjectId(subAccountId);

    const subAccountWithTags = await SubAccount.findById(objectId)
    .select("tags") // Select only the 'tags' field
    .populate("tags") // Populate the actual tag documents if needed
    .lean();

    console.log("sub account with tags: ", subAccountWithTags)
  return (subAccountWithTags) ? (subAccountWithTags.tags as Tag[]) : []
  } catch (error) {
    console.error("[GET_TAGS_FOR_SUBACCOUNT_ERROR]", error);
    throw error;
  }
};

/* export const getTagsForSubaccount = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: { id: subaccountId },
        select: { Tags: true },
    })
    return response
} */

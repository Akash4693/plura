"use server";

import { CreateMediaType } from "@/lib/types/media.types";
import Media from "@/models/media.model";
import SubAccount from "@/models/sub-account.model";
import { Types } from "mongoose";

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType
) => {
  try {

    if (!Types.ObjectId.isValid(subaccountId)) {
      throw new Error("Invalid subaccount ID");
    }

    const media = await Media.create({
      name: mediaFile.name,
      link: mediaFile.link,
      type: mediaFile.type,
      subAccountId: new Types.ObjectId(subaccountId),
    });

    if (media) {
      const updatedSubAccount = await SubAccount.findByIdAndUpdate(
        subaccountId,
        { $push: { media: media._id } }, // Push new media ID to media array
        { new: true }
      );
    
      console.log("Updated SubAccount:", updatedSubAccount);
    }

    return media.toObject();
  } catch (error) {
    console.error("Error creating media:", error);
    throw new Error("Failed to create media.");
  }
};

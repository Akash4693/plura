"use server"

import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import SubAccount from "@/models/sub-account.model";

export const deleteSubaccount = async (subaccountId: string) => {
  try {
    await connectDB();
    

    if (!Types.ObjectId.isValid(subaccountId)) {
      console.error("Invalid subaccount id:", subaccountId)
      throw new Error("Invalid subaccount ID");
    }

    const deletedSubaccount = await SubAccount.findByIdAndDelete(subaccountId).lean();

    if (!deletedSubaccount) {
      throw new Error("Subaccount not found");
    }

    return deletedSubaccount;
  } catch (error) {
    console.error("Error deleting Subaccount:", error);
    throw new Error("Failed to delete Subaccount");
  }
};

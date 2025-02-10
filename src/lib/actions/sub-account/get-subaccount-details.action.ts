"use server"

import { connectDB } from "@/lib/db"
import SubAccount from "@/models/sub-account.model"
import { Types } from "mongoose"

export const getSubaccountDetails = async (subaccountId: string) => {
    try {
        await connectDB()

        if (!Types.ObjectId.isValid(subaccountId)) {
            throw new Error("Invalid subaccount ID");
          }
      

          const subaccountDetails = await SubAccount.findById(subaccountId).lean();

          console.log("subaccount details _id:", subaccountDetails)

          if (!subaccountDetails) {
            throw new Error("Subaccount not found");
          }
      
          return JSON.parse(JSON.stringify(subaccountDetails));


    } catch (error) {
            console.error("Error Fetching Subaccount Details ", error);
            throw new Error("Failed to get Subaccount Details");
    }
}


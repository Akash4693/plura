/*  "use server";


import { currentUser } from "@clerk/nextjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";


export const getAuthUserDetails = async () => {
  
  await connectDB();
  const user = await currentUser();
  
  if (!user) {
    return;
  }
 
  const userData = await User.findOne({
    email: user.emailAddresses[0].emailAddress,
  }).populate({
    path: "agencyId",
    populate: [
      { path: "sidebarOption" },
      {
        path: "subAccounts",
        populate: [{ path: "sidebarOption" }, { path: "agencyLogo" }],
      },
    ],
  }).populate("permissions")


  
  console.log("User data with permissions:", userData);

  return userData;
};  */
 

"use server";

import { currentUser } from "@clerk/nextjs";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { AuthUserWithAgencySidebarOptionsSubAccounts, PopulatedUser } from "@/lib/types/user.types"; // Updated type
import AgencySidebarOption from "@/models/agency-sidebar-option.model";
import SubAccountSidebarOption from "@/models/sub-account-sidebar-option.model";
import { logError } from "@/lib/utils/logger";


export const getAuthUserDetails = async (): Promise<AuthUserWithAgencySidebarOptionsSubAccounts | null> => {
  try {
    await connectDB();
    const user = await currentUser();

    if(!user) return null;

    const userData = await User.findOne({
      email: user.emailAddresses[0]?.emailAddress,
    })
    .populate({
      path: "agencyId",
      model: "Agency",
      populate: [
        { path: "sidebarOption", model: "AgencySidebarOption" },
      ],
    })
    .populate("permissions")
    .populate("tickets")
    .populate("notifications")
    .populate({
      path: "subAccounts",
      model: "SubAccount",
      populate: [
        { path: "sidebarOption", model: "SubAccountSidebarOption" },
      ],
    })
      .lean()
      .exec();

      if (!userData) {
        console.log("User data not found in database");
        return null;
      }
      
      console.log("User data with populated agency:", userData);
      const plainUserData = JSON.parse(JSON.stringify(userData));

      console.log("User data with permissions:", plainUserData);
      console.log("Sending data to client:", JSON.stringify(plainUserData, null, 2));
  
      return {
        ...plainUserData,
        Agency: plainUserData.agencyId
      } // Cast to PopulatedUser
  } catch (error) {
    logError("Error fetching authenticated user details", error);
    return null;
  }
}; 

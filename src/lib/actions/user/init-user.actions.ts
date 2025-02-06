/* "use server";

import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";
import { clerkClient, currentUser } from "@clerk/nextjs";

export const initUser = async (newUser: Partial<UserType>) => {

    await connectDB();
    const user = await currentUser();
    if (!user) return;

    const updatePayload: Partial<UserType> = {
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || Role.SUBACCOUNT_USER,
      ...newUser, 
    };
   
    if (newUser.role) {
      updatePayload.role = newUser.role;
    }

    const userData = await User.findOneAndUpdate(
        { email: user.emailAddresses[0].emailAddress }, // Search by email
        { $setOnInsert: updatePayload },
        { new: true, upsert: true, runValidators: true } // Create if not found, return the updated document
      ).lean(); 

    await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || Role.SUBACCOUNT_USER,
        },
    })

    return userData
}  */


"use server";

import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";
import { clerkClient, currentUser } from "@clerk/nextjs";

export const initUser = async (newUser: Partial<UserType>) => {
  try {
    await connectDB();
    console.log("monogodb connected in initUser")
    const user = await currentUser();
    if (!user) return;
  
    const updatePayload: Partial<UserType> = {
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || Role.SUBACCOUNT_USER,
      ...newUser,
    };
  
   
  
    if (newUser.role) {
      updatePayload.role = newUser.role;
    }
    console.log("updatePayload.role:",updatePayload.role )
  
    const userData = await User.findOneAndUpdate(
      { email: user.emailAddresses[0].emailAddress }, // Search by email
      { $setOnInsert: updatePayload },
      { new: true, upsert: true, runValidators: true } // Create if not found, return the updated document
    ).lean()
    .exec();
   
     const sanitizedData = {
      ...userData,
      _id: userData._id.toString(), // Convert ObjectId to string
      createdAt: userData.createdAt.toISOString(), // Convert Date to string
      updatedAt: userData.updatedAt.toISOString(), // Convert Date to string
    }; 
   
    
  
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        role: newUser.role || Role.SUBACCOUNT_USER,
      },
    });
  
    return sanitizedData;  
  } catch (error) {
      console.error("Error initializing user:", error);
      throw new Error("Failed to initialize user");
  }
  
};

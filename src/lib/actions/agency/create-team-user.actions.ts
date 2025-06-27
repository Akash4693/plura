"use server";
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";
import { User as ClerkUser } from "@clerk/nextjs/server";
import mongoose, { Types } from "mongoose";

export const createTeamUser = async (
  agencyId: Types.ObjectId | string, 
  user: Partial<UserType>
) => {
  try {
  await connectDB();
    console.log("createTeamUser connected")
  console.log("User role:", user.role);
  if (user.role === Role.AGENCY_OWNER) return null;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    throw new Error('Invalid agencyId: Must be a valid ObjectId');
  }

    const response = await User.create({
      email: user.email,
      agencyId: agencyId,
      
      avatarUrl: user.avatarUrl,
      role: user.role,
      name: user.name,
    });

    console.log("User created:", response);    
    return response;
  } catch (error) {
    console.error('Error creating team user:', error);
    throw new Error('Cannot create user with AGENCY OWNER role');
  }
}; 
 

/* export const createTeamUser = async (AgencyId: string, user: User) => {
  if (user.role === Role.AGENCY_OWNER) return null
  const response = await db.user.create({ data: {...user} })

  return response
}
 */



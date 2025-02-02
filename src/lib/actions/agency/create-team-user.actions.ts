"use server";
import { Role } from "@/constants/enums/role.enum";
import { connectDB } from "@/lib/db";
import { User as UserType } from "@/lib/types/user.types";
import User from "@/models/user.model";
import mongoose, { Types } from "mongoose";

export const createTeamUser = async (
  agencyId: Types.ObjectId | string, 
  user: Pick<UserType, "email" | "avatarUrl" | "role" | "name" | "id">  & { agencyId: mongoose.Types.ObjectId }
) => {
  try {
  await connectDB();

  console.log("User role:", user.role);
  if (user.role === Role.AGENCY_OWNER) return null;

  if (!mongoose.Types.ObjectId.isValid(agencyId)) {
    throw new Error('Invalid agencyId: Must be a valid ObjectId');
  }

    const response = await User.create({
      email: user.email,
      agencyId: agencyId,
      id: user.id,
      avatarUrl: user.avatarUrl,
      role: user.role,
      name: user.name,
    });

    
    return response;
  } catch (error) {
    console.error('Error creating team user:', error);
    throw new Error('Cannot create user with AGENCY OWNER role');
  }
};
 
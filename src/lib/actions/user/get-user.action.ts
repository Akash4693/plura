"use server"
import { Types } from "mongoose";
import User from "@/models/user.model";
import { User as UserType } from "@/lib/types/user.types";
import { connectDB } from "@/lib/db";


export const getUser = async (id: string): Promise<UserType | null> => {
    try {
        await connectDB();
        if (!Types.ObjectId.isValid(id)) return null; 

        return await User.findById(id).lean() as UserType | null;    
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }    
};

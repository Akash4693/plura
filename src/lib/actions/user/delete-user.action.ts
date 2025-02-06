"use server"
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { clerkClient } from "@clerk/nextjs";
import mongoose from "mongoose";



export const deleteUser = async (userId: string) => {
    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }

        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: { role: undefined },
        });

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Delete user (Triggers middleware)
        await user.deleteOne();

        return { message: "User and related data deleted successfully." };
        
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
};



        /* const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            throw new Error("User not found");
        }

        return deletedUser; */
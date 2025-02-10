/* "use server"
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { clerkClient } from "@clerk/nextjs";
import mongoose from "mongoose";



export const deleteUser = async (userId: string) => {
    try {
        await connectDB();

        console.log("user delete id:", userId);


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
 */

"use server"
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { clerkClient } from "@clerk/nextjs";
import mongoose from "mongoose";

export const deleteUser = async (userId: string) => {
    try {
        await connectDB();

        console.log("User delete ID:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format");
        }

        // Fetch user from MongoDB
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found in MongoDB.");
        }

        // Attempt to delete user from Clerk (using the correct Clerk ID)
        try {
            await clerkClient.users.deleteUser(userId);
            console.log("User deleted from Clerk.");
        } catch (clerkError) {
            console.warn("User not found in Clerk or already deleted.");
        }

        // Delete user from MongoDB
        await user.deleteOne();
        console.log("User deleted from MongoDB.");

        return { message: "User deleted successfully from Clerk & MongoDB." };

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
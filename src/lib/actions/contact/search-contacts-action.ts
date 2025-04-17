"use server";

import { connectDB } from "@/lib/db";
import Contact from "@/models/contact.model"; // Make sure this path is correct

export const searchContacts = async (searchTerms: string) => {
  try {
    await connectDB();

    const contacts = await Contact.find({
      name: { $regex: searchTerms, $options: "i" } // Case-insensitive partial match
    }).exec();

    return contacts;
  } catch (error) {
    console.error("Error searching contacts:", error);
    throw new Error("Failed to search contacts");
  }
};

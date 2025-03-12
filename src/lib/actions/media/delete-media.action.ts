"use server";

import Media from "@/models/media.model";

export const deleteMedia = async (mediaId: string) => {
  try {
    const response = await Media.findByIdAndDelete(mediaId);
    
    if (!response) {
      throw new Error("Media not found");
    }

    return response;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw new Error("Failed to delete media.");
  }
};


import mongoose, { Document } from "mongoose";
import { getMedia } from "../actions/media/get-media.action";

// Interface for the Media document
export interface Media extends Document {
  _id: string;
  type?: string | null;
  name: string;
  link: string;
  subAccountId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type GetMediaFiles = Awaited<ReturnType<typeof getMedia>> | {
  media: Media[];
}

 
export type CreateMediaType = {
  link: string;
  name: string;
  type?: string | null; 
};


//export type CreateMediaType = Omit<Media, "_id" | "subAccountId">;




//export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput
//export type GetMediaFiles = Prisma.PromisReturnType<typeof getMedia>

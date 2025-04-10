import mongoose, { Document, Types } from "mongoose";
import { getPipelineDetails } from "../actions/pipeline/get-pipeline-details.action";

// Interface for the Pipeline document
export interface Pipeline extends Document {
  name: string;
  subAccountId: Types.ObjectId;
  lane: Types.ObjectId[];
}

export interface PipelineUncheckedCreateWithoutLaneInput {
  _id?: string;
  name: string;
  subAccountId: string | Types.ObjectId;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type PipelineDetailsWithCardsTagsTickets = Awaited<ReturnType<typeof getPipelineDetails>>

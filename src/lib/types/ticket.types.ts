import mongoose, { Document, Types } from "mongoose";
import { Tag } from "./tag.types";
import { getTicketsWithTags } from "../actions/ticket/get-tickets-with-tags-action";

// Interface for the Ticket document
export interface Ticket extends Document {
  name: string;
  laneId: mongoose.Types.ObjectId;
  order: number;
  value: mongoose.Types.Decimal128 | null;
  description: string | null;
  customerId: mongoose.Types.ObjectId | null;
  assignedUserId: mongoose.Types.ObjectId | null;
  tags: Tag[] | mongoose.Types.ObjectId[];
}

export interface TicketCreateInput {
  _id?: Types.ObjectId;
  name: string;
  laneId: Types.ObjectId | string;
  order?: number;
  value?: number | string | null;
  description?: string | null;
  customerId?: Types.ObjectId | string | null;
  assignedUserId?: Types.ObjectId | string | null;
  tags?: Types.ObjectId[] | string[];
}

export type TicketWithTags = Awaited<ReturnType<typeof getTicketsWithTags>>;

import mongoose, { Document, Types } from "mongoose";
import { Tag } from "./tag.types";
import { getTicketsWithTags } from "../actions/ticket/get-tickets-with-tags-action";
import { _getTicketsWithAllRelations } from "../actions/ticket/_getTicketsWithAllRelations-action";
import { Contact } from "./contact.types";

// Interface for the Ticket document
export interface Ticket extends Document {
  name: string;
  laneId: mongoose.Types.ObjectId;
  order: number;
  value: mongoose.Types.Decimal128 | null;
  description: string | null;
  customerId: Contact | null;
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
  customerId?: Contact |Types.ObjectId | string | null;
  assignedUserId?: Types.ObjectId | string | null;
  tags?: Types.ObjectId[] | string[];
}

export type TicketWithTags = Awaited<ReturnType<typeof getTicketsWithTags>>;

export type TicketDetails = Awaited<ReturnType<typeof _getTicketsWithAllRelations>>;

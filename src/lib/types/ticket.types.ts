import mongoose, { Document, Types } from "mongoose";
import { Tag } from "./tag.types";
import { getTicketsWithTags } from "../actions/ticket/get-tickets-with-tags-action";
import { _getTicketsWithAllRelations } from "../actions/ticket/_getTicketsWithAllRelations-action";
import { Contact } from "./contact.types";
import { User } from "./user.types";

// Interface for the Ticket document
export interface Ticket extends Document {
  name: string;
  laneId: mongoose.Types.ObjectId | string;
  order: number;
  value: number | string;
  description: string | null;
  customerId: Contact | null;
  assignedUserId: mongoose.Types.ObjectId | User | null;
  tags: Tag[];
}

export type TicketOrderInput = {
   _id: string | Types.ObjectId;
  order: number;
  laneId: string | Types.ObjectId;
};

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
export interface TicketsAndTags extends Omit<Ticket, "customerId" | "assignedUserId" | "tags"> {
  tags: Tag[];
  assignedUserId: User | null;
  customerId: Contact | null;
}


export type TicketWithTags = Awaited<ReturnType<typeof getTicketsWithTags>>;


export type TicketDetails = Awaited<ReturnType<typeof _getTicketsWithAllRelations>>;

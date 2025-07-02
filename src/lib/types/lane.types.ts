import { ObjectId } from 'mongodb';
import mongoose, { Document, Types } from "mongoose";
import { Tag } from "./tag.types";
import { Ticket, TicketCreateInput, TicketsAndTags } from "./ticket.types";
import { User } from "./user.types";
import { Contact } from "./contact.types";

// Interface for the Lane document
export interface Lane extends Document {
  name: string;
  pipelineId: mongoose.Types.ObjectId; 
  tickets?: mongoose.Types.ObjectId[] | TicketsAndTags[]; 
  order: number;
}


export interface LaneDetail extends Omit<Lane, "tickets"> {
  name: string
  tickets: TicketsAndTags[]
}


export interface LaneCreateInput {
  _id?: Types.ObjectId;                     // Optional if you want to pass a custom _id
  name?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  pipelineId: Types.ObjectId | string;      // Required
  order?: number;
  tickets?: Types.ObjectId[] | TicketCreateInput[]; // Optional, can be embedded docs or just ObjectIds
}


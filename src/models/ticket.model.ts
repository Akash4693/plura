import mongoose, { Schema, Model } from "mongoose";
import type { Ticket } from "@/lib/types/ticket.types";


// Ticket Schema
const ticketSchema: Schema<Ticket> = new Schema({
    name: { 
      type: String, 
      required: [true, "Ticket name is required"], 
    },
    laneId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lane", 
      required: [true, "Lane Id is required"], 
    },
    order: {
      type: Number,
      default: 0,
    },
    value: { 
      type: mongoose.Schema.Types.Decimal128,  // Use Decimal128 for efficient storage of decimals
      default: null, 
    },
    description: { 
      type: String,
      default: null, 
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    
    assignedUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      default: null,
    },
    tags: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Tag", 
      }
    ],
  },
  { 
    timestamps: true, 
});

ticketSchema.index({ laneId: 1 });
ticketSchema.index({ customerId: 1 });
ticketSchema.index({ assignedUserId: 1 });

const Ticket: Model<Ticket> = mongoose.models.Ticket ||  mongoose.model<Ticket>("Ticket", ticketSchema);
export default Ticket;
import mongoose, { Schema, Model } from "mongoose";
import type { Contact } from "@/lib/types/contact.types";

// Contact Schema
const contactSchema: Schema<Contact> = new Schema({
    name: {
      type: String,
      required: [true, "Contact name is required"],
    },
    email: {
      type: String,
      required: [true, "Company email is required"],
      trim: true,
      lowercase: true,
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount", 
      required: [true, "SubAccount Id is required"],
    },
    ticket: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket", // Refers to the Ticket model
      },
    ],
  }, 
  {
    timestamps: true,
});
  
contactSchema.index({ subAccountId: 1 });
  
const Contact: Model<Contact> = mongoose.model<Contact>("Contact", contactSchema);
export default Contact;
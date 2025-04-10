import mongoose, { Schema, Model } from "mongoose";
import type { Tag } from "@/lib/types/tag.types";


// Tag Schema
const tagSchema: Schema<Tag> = new Schema({
    name: {
      type: String,
      required: [true, "Tag name is required"], 
    },
    color: {
      type: String,
      required: [true, "Tag color is required"], 
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"], 
    },
    ticket: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket", 
      },
    ],
  }, 
  {
    timestamps: true,
});
  
// Create an index on `subAccountId` for efficient querying
tagSchema.index({ subAccountId: 1 });

const Tag: Model<Tag> = mongoose.models.Tag || mongoose.model<Tag>("Tag", tagSchema);
export default Tag;
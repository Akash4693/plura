import mongoose, { Schema, Model } from "mongoose";
import type { Media } from "@/lib/types/media.types";


// Media Schema
const mediaSchema: Schema<Media> = new Schema({
    type: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: [true, "Media name is required"],
    }, 
    link: {
      type: String,
      unique: true,
      required: [true, "Media link is required"],
      match: [
        /^(https?:\/\/[^\s$.?#].[^\s]*)$/i, // URL validation regex
        'Please provide a valid URL.',
      ],
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"],
    },
  }, 
  {
    timestamps: true,
});
  
mediaSchema.index({ subAccountId: 1 });

const Media: Model<Media> = mongoose.models.Media || mongoose.model<Media>("Media", mediaSchema);
export default Media;
  
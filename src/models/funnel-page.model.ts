import type { FunnelPage } from "@/lib/types/funnel-page.types";
import mongoose, { Schema, Model } from "mongoose";

// Funnel Page Schema
const funnelPageSchema: Schema<FunnelPage> = new Schema({
    name: {
      type: String,
      required: [true, "funnelPage name is required"],
      trim: true, 
    },
    pathName: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: null,
    },
    visits: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      required: [true, "Order is required"],
    },
    previewImage: {
      type: String,
      default: null,
    },
    funnelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Funnel",
      required: [true, "funnel Id is required"],
    },
  },
  {
    timestamps: true, 
});
  
funnelPageSchema.index({ funnelId: 1 });

const FunnelPage: Model<FunnelPage> = mongoose.model<FunnelPage>("FunnelPage", funnelPageSchema);
export default FunnelPage;  
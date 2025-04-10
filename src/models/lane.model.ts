import mongoose, { Schema,  Model } from "mongoose";
import type { Lane } from "@/lib/types/lane.types";
import "@/models/ticket.model";
import "@/models/pipeline.model";


//Lane Schema
const laneSchema: Schema<Lane> = new Schema({
    name: {
      type: String,
      required: true,
    },
    pipelineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: [true, "Pipeline Id is required"],
    },
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket"
      }
    ],
    order: {
      type: Number,
      default: 0,
    }
  
  }, 
  {
    timestamps: true,
});
  
laneSchema.index({pipelineId: 1});

const Lane: Model<Lane> = mongoose.models.Lane || mongoose.model<Lane>("Lane", laneSchema);
export default Lane;
  
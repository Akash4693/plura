import mongoose, { Schema, Model } from "mongoose";
import type { Pipeline } from "@/lib/types/pipeline.types";


// Pipeline Schema
const pipelineSchema: Schema<Pipeline> = new Schema({
    name: { 
      type: String, 
      required: [true, "Pipeline name is required"], 
    },
    subAccountId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"], 
    },
    lane: [
      { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "Lane", 
      },
    ],
       
  }, 
  {
    timestamps: true,
})
  
pipelineSchema.index({ subAccountId: 1 });

const Pipeline: Model<Pipeline> = mongoose.model<Pipeline>("Pipeline", pipelineSchema);
export default Pipeline;
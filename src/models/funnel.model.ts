import mongoose, { Schema, Model } from "mongoose";
import type { Funnel } from "@/lib/types/funnel.types";

//Funnel Schema
const funnelSchema: Schema<Funnel> = new Schema({
    name: {
      type: String,
      required: [true, "Funnel name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: false
    },
    subDomainName: {
      type: String,
      unique: true,
      default: null,
    },
    favicon: {
      type: String,
      default: null,
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"],
    },
    funnelPages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FunnelPage",
      }
    ],
    liveProducts: {
      type: [String],
      default: [],
    },
    className: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClassName",
      }
    ],
  }, 
  {
    timestamps: true,
});
  
funnelSchema.index({ subAccountId: 1 });

const Funnel: Model<Funnel> = mongoose.model<Funnel>("Funnel", funnelSchema);
export default Funnel;
  
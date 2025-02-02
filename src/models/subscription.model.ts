import mongoose, { Schema, Model } from "mongoose";
import { SubscriptionPlan } from '../constants/enums/subscription-plan.enum';
import type { Subscription } from "@/lib/types/subscription.types";

// Subscription Schema
const subscriptionSchema: Schema<Subscription> = new Schema({
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlan),
    default: null,
  },
  price: {
      type: String,
      default: null,
    },
    priceId: {
      type: String,
      required: [true, "Price Id is required"],
    },
    active: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: String,
      required: [true, "Customer Id is required"],
    },
    currentPeriodEndDate: {
      type: Date,
      required: [true, "Current period end Date is required"],
    },
    subscriptionId: {
      type: String,
      unique: true,
      required: [true, "Subscription Id is required"],
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      unique: true,
      default: null,
    },
  }, 
  {
    timestamps: true,
});
  
subscriptionSchema.index({ customerId: 1 });
  
const Subscription: Model<Subscription> = mongoose.model<Subscription>("Subscription", subscriptionSchema);
export default Subscription;  
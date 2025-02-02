import mongoose, { Document } from "mongoose";
import { SubscriptionPlan } from "@/constants/enums/subscription-plan.enum";

// Interface for the Subscription document
export interface Subscription extends Document {
  plan: SubscriptionPlan | null;
  price: string | null;
  priceId: string;
  active: boolean;
  customerId: string;
  currentPeriodEndDate: Date;
  agencyId: mongoose.Types.ObjectId | null; 
  subscriptionId: string;
}
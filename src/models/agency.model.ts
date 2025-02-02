import mongoose, { Schema, Model } from "mongoose";
import type { Agency } from "@/lib/types/agency.types";
import "@/models/agency-sidebar-option.model";

// Agency schema
const agencySchema: Schema<Agency> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    connectAccountId: {
      type: String,
      default: "",
    },
    /* customerId: { 
      type: String, 
      default:  "", 
      required: true,
    }, */
    agencyLogo: {
      type: String,
      required: true,
    },
    companyEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    companyPhone: {
      type: String,
      required: true,
    },
    whiteLabel: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      default: 5,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subAccounts: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubAccount",
      },
    ],
    sidebarOption: [
      {
        type: Schema.Types.ObjectId,
        ref: "AgencySidebarOption",
      },
    ],
    invitation: [
      {
        type: Schema.Types.ObjectId,
        ref: "Invitation",
      },
    ],
    notification: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    addOns: [
      {
        type: Schema.Types.ObjectId,
        ref: "AddOns",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Agency: Model<Agency> =
  mongoose.models.Agency || mongoose.model<Agency>("Agency", agencySchema);
export default Agency;

import mongoose, { Schema, Model } from "mongoose";
import type { SubAccount } from "@/lib/types/sub-account.types";
import"@/lib/types/sub-account-sidebar-option.types"
import "@/models/pipeline.model";
import "@/models/media.model"

// SubAccount schema
const subAccountSchema: Schema<SubAccount> = new Schema(
  {
    connectAccountId: {
      type: String,
      default: "",
    },
    // SubAccount details
    name: {
      type: String,
      required: [true, "SubAccount name is required"],
      trim: true,
    },
    subAccountLogo: {
      type: String,
      required: [true, "SubAccount logo is required"],
    },
    // Company information
    companyEmail: {
      type: String,
      required: [true, "Company email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    companyPhone: {
      type: String,
      required: [true, "Company phone number is required"],
    },
    goal: {
      type: Number,
      default: 5,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    zipCode: {
      type: String,
      required: [true, "ZIP code is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    // Reference to the Agency model
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "Agency Id is required"],
    },
    // Relationships to other models
    sidebarOption: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubAccountSidebarOption",
      },
    ],
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    funnels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Funnel",
      },
    ],
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    contact: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact",
      },
    ],
    trigger: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trigger",
      },
    ],
    automation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Automation",
      },
    ],
    pipeline: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pipeline",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    notification: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
    toJSON: {
      virtuals: true, // Include virtuals when converting to JSON
    },
    toObject: {
      virtuals: true, // Include virtuals when converting to an object
    },
  }
);

// Add an index for `agencyId` to optimize queries
subAccountSchema.index({ agencyId: 1 });

const SubAccount: Model<SubAccount> =
  mongoose.models.SubAccount ||
  mongoose.model<SubAccount>("SubAccount", subAccountSchema);
export default SubAccount;

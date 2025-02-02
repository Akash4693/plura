/* import mongoose, { Schema, Model } from "mongoose";
import type { Permission } from "@/lib/types/permission.types";

import "@/models/user.model";

// Permissions Schema
const permissionsSchema: Schema<Permission> = new Schema({
    email: { 
      type: String, 
      required: [true, "Email is required for permissions"],
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User reference is required "],
    }, 
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required "],
    },
    access: { 
      type: Boolean, 
      required: true, 
    },
  },
  { 
    timestamps: true, 
});

permissionsSchema.index({ subAccountId: 1, email: 1 });


const Permission: Model<Permission> = mongoose.models.Permission || mongoose.model<Permission>("Permission", permissionsSchema);

export default Permission;


 */

import mongoose, { Schema, Model } from "mongoose";
import type { Permission } from "@/lib/types/permission.types";
import "@/models/sub-account.model"

// Permissions Schema
const permissionsSchema: Schema<Permission> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for permissions"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      required: [true, "SubAccount Id is required"],
    },
    access: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only defined once
permissionsSchema.index({ subAccountId: 1, email: 1 });

// Check if we're in the server environment
if (typeof mongoose.models.Permission === "undefined") {
  mongoose.model<Permission>("Permission", permissionsSchema);
}

// Define and export the Permission model
const Permission: Model<Permission> = mongoose.models.Permission || mongoose.model<Permission>("Permission", permissionsSchema);

export default Permission;

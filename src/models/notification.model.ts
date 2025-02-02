import mongoose, { Schema, Model } from "mongoose";
import type { Notification } from "@/lib/types/notification.types";
import "@/models/user.model"
import "@/models/agency.model"
import "@/models/sub-account.model"

// Notification Schema
const notificationSchema: Schema<Notification> = new Schema(
  {
    notification: {
      type: String,
      required: [true, "notification is required"],
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "agencyId is required"],
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
  },
  {
    timestamps: true,
});

notificationSchema.index({ agencyId: 1 });
notificationSchema.index({ subAccountId: 1 });
notificationSchema.index({ userId: 1 });

const Notification: Model<Notification> = mongoose.models.Notification || mongoose.model<Notification>("Notification", notificationSchema);
export default Notification;

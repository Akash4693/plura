import mongoose, { Schema, Model } from "mongoose";
import { InvitationStatus } from "@/constants/enums/invitation-status.enum";
import { Role } from "@/constants/enums/role.enum";
import type { Invitation } from "@/lib/types/invitation.types";

  // Invitation Schema
  const invitationSchema: Schema<Invitation> = new Schema({
    email: {
      type: String,
     
      required: [true, "Invitation email is required"],
      trim: true,
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "agencyId is required"],
    },
    status: {
      type: String,
      enum: Object.values(InvitationStatus),
      default: InvitationStatus.PENDING,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.SUBACCOUNT_USER,
    },
  }, 
  {
    timestamps: true,
});
  
invitationSchema.index({ agencyId: 1 });

const Invitation: Model<Invitation> = mongoose.models.Invitation || mongoose.model<Invitation>("Invitation", invitationSchema);
export default Invitation;


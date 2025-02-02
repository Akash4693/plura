import mongoose, { Document } from "mongoose";
import { InvitationStatus } from "@/constants/enums/invitation-status.enum";
import { Role } from "@/constants/enums/role.enum";

// Interface for the Invitation document
export interface Invitation extends Document {
  email: string;
  agencyId: mongoose.Types.ObjectId;
  status: InvitationStatus;
  role: Role;
  }

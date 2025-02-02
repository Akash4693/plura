import mongoose, { Document } from "mongoose";
import { Icon } from "@/constants/enums/icon.enum";


// Interface for Agency Sidebar Option for document
export interface AgencySidebarOption extends Document {
  name: string;
  link: string;
  icon: Icon;
  agencyId: mongoose.Types.ObjectId;
}

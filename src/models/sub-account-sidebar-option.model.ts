import mongoose, { Schema, Document, Model } from "mongoose";
import { Icon } from "@/constants/enums/icon.enum";
import type { SubAccountSidebarOption } from "@/lib/types/sub-account-sidebar-option.types";


// SubAccount Sidebar option Schema
const subAccountSidebarOptionSchema: Schema<SubAccountSidebarOption> = new Schema({
    name: {
      type: String,
      default: "Menu",
    },
    link: {
      type: String,
      default: "#",
    },
    icon: {
      type: String,
      enum: Object.values(Icon),
      default: Icon.info,
    },
    subAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubAccount",
    },
  }, 
  {
    timestamps: true,
});
  
subAccountSidebarOptionSchema.index({ subAccountId: 1 });

const SubAccountSidebarOption: Model<SubAccountSidebarOption> = mongoose.models.SubAccountSidebarOption || mongoose.model<SubAccountSidebarOption>("SubAccountSidebarOption", subAccountSidebarOptionSchema);

export default SubAccountSidebarOption;
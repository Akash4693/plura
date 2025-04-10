import mongoose, { Schema, Model } from "mongoose";
import { Icon } from "@/constants/enums/icon.enum";
import type { AgencySidebarOption } from "@/lib/types/agency-sidebar-option.types";

// Agency Sidebar options Schema
const agencySidebarOptionSchema: Schema<AgencySidebarOption> = new Schema(
  {
    name: {
      type: String,
      default: "Menu",
    },
    icon: {
      type: String,
      enum: Object.values(Icon),
      default: Icon.info,
    },
    link: {
      type: String,
      default: "#",
    },
    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: [true, "agencyId is required"],
    },
  },
  {
    timestamps: true,
  }
);

agencySidebarOptionSchema.index({ agencyId: 1 });

const AgencySidebarOption: Model<AgencySidebarOption> =
  mongoose.models.AgencySidebarOption ||
  mongoose.model<AgencySidebarOption>(
    "AgencySidebarOption",
    agencySidebarOptionSchema
  );
export default AgencySidebarOption;

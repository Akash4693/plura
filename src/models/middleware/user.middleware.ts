"use server";

import Ticket from "@/models/ticket.model";
import Notification from "@/models/notification.model";
import SubAccount from "@/models/sub-account.model";
import { Document, Types } from "mongoose";
import Agency from "../agency.model";
import Permission from "../permission.model";
import SubAccountSidebarOption from "../sub-account-sidebar-option.model";
import AgencySidebarOption from "../agency-sidebar-option.model";

// Middleware to delete related documents when a user is deleted
export const userDeletionMiddleware = async function (
    this: Document & { 
        tickets: Types.ObjectId[], 
        notifications: Types.ObjectId[], 
        subAccounts: Types.ObjectId[],
        agencyId: Types.ObjectId[],
        permissions: Types.ObjectId[]

    },
    next: Function
) {
    try {
        const ticketResult = await Ticket.deleteMany({ _id: { $in: this.tickets } });
        console.log(`Deleted Tickets:`, ticketResult);

        const notificationResult = await Notification.deleteMany({ _id: { $in: this.notifications } });
        console.log(`Deleted Notifications:`, notificationResult);

        const subAccountResult = await SubAccount.deleteMany({ _id: { $in: this.subAccounts } });
        console.log(`Deleted SubAccounts:`, subAccountResult);

        const subAccountSidebarResult = await SubAccountSidebarOption.deleteMany({
            subAccountId: { $in: this.subAccounts }
        });
        console.log(`Deleted SubAccount Sidebar Options:`, subAccountSidebarResult);

        
        const agencyResult = await Agency.deleteOne({ _id: this.agencyId });
        console.log(`Deleted Agency:`, agencyResult);

        const agencySidebarResult = await AgencySidebarOption.deleteMany({
            agencyId: this.agencyId
        });
        console.log(`Deleted Agency Sidebar Options:`, agencySidebarResult);


        // Delete associated Permissions if they exist
        const permissionResult = await Permission.deleteMany({ _id: { $in: this.permissions } });
        console.log(`Deleted Permissions:`, permissionResult);

        console.log(`User ${this._id} and related data deleted.`);
        next();
    } catch (error) {
        console.error("Error deleting related data:", error);
        next(error);
    }
};

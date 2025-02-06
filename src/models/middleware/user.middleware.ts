"use server";

import Ticket from "@/models/ticket.model";
import Notification from "@/models/notification.model";
import SubAccount from "@/models/sub-account.model";
import { Document, Types } from "mongoose";

// Middleware to delete related documents when a user is deleted
export const userDeletionMiddleware = async function (
    this: Document & { tickets: Types.ObjectId[], notifications: Types.ObjectId[], subAccounts: Types.ObjectId[] },
    next: Function
) {
    try {
        await Ticket.deleteMany({ _id: { $in: this.tickets } });
        await Notification.deleteMany({ _id: { $in: this.notifications } });
        await SubAccount.deleteMany({ _id: { $in: this.subAccounts } });

        console.log(`User ${this._id} and related data deleted.`);
        next();
    } catch (error) {
        console.error("Error deleting related data:", error);
        next(error);
    }
};
